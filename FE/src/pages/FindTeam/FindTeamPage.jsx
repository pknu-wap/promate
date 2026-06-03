import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApplyModal from "../../components/ApplyModal/ApplyModal.jsx";
import Tag from "../../components/Tag/Tag.jsx";
import ApplicantBox from "../../components/ApplicantBox/ApplicantBox.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";
import apiClient from "../../api/apiClient.js";
import "./FindTeamPage.css";

const categories = [
  { id: "PROJECT", label: "조별과제" },
  { id: "STUDY", label: "스터디" },
  { id: "CONTEST", label: "공모전" },
  { id: "DEV", label: "개발" },
  { id: "ETC", label: "기타" },
];

function FindTeamPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("PROJECT");
  const [teamPosts, setTeamPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [job, setJob] = useState("");
  const [motivation, setMotivation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchKeyword]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, debouncedKeyword]);

  useEffect(() => {
    const fetchRecruitments = async () => {
      try {
        const params = {
          page: currentPage - 1,
          size: ITEMS_PER_PAGE,
          sort: "createdAt,desc",
          status: "RECRUITING",
        };

        if (selectedCategory) {
          params.category = selectedCategory;
        }

        if (debouncedKeyword.trim()) {
          params.search = debouncedKeyword.trim();
        }

        const response = await apiClient.get("/recruitments", { params });

        if (response.data && response.data.isSuccess) {
          const { content, pageInfo } = response.data.data;

          const mappedData = content
            .filter((item) => item.status === "RECRUITING")
            .map((item) => {
              let mappedStatus = null;
              if (item.myApplyStatus === "PENDING") mappedStatus = "reviewing";
              else if (item.myApplyStatus === "ACCEPTED") mappedStatus = "accepted";
              else if (item.myApplyStatus === "REJECTED") mappedStatus = "rejected";

              return {
                id: item.recruitmentId,
                title: item.title,
                summary: item.description || "",
                capacity: item.maxMember,
                category: item.category,
                bookmarked: false,
                applied: item.myApplyStatus !== null,
                applyStatus: mappedStatus,
                status: item.status,
              };
            });

          setTeamPosts(mappedData);
          setTotalPages(pageInfo.totalPages === 0 ? 1 : pageInfo.totalPages);
        }
      } catch (error) {
        console.error("모집글 조회 실패:", error);
      }
    };

    fetchRecruitments();
  }, [selectedCategory, debouncedKeyword, currentPage]);

  const selectedTeam = teamPosts.find((team) => team.id === selectedTeamId);
  const isApplyModalOpen = selectedTeamId !== null;

  const handleToggleBookmark = async (teamId) => {
    try {
      const response = await apiClient.post(`/recruitments/${teamId}/bookmark`);
      const { isBookmarked } = response.data.data;

      setTeamPosts((prevTeamPosts) =>
        prevTeamPosts.map((team) =>
          team.id === teamId ? { ...team, bookmarked: isBookmarked } : team,
        ),
      );
    } catch (error) {
      console.error("북마크 설정/해제 실패:", error);
      alert(error.message || "관심 설정 중 오류가 발생했습니다.");
    }
  };

  const handleOpenApplyModal = (teamId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      navigate(-1);
      return;
    }

    setSelectedTeamId(teamId);
    setJob("");
    setMotivation("");
  };

  const handleCloseApplyModal = () => {
    setSelectedTeamId(null);
    setJob("");
    setMotivation("");
  };

  const handleSubmitApply = () => {
    if (selectedTeamId === null) return;

    setTeamPosts((prevTeamPosts) =>
      prevTeamPosts.map((team) =>
        team.id === selectedTeamId
          ? { ...team, applied: true, applyStatus: "reviewing" }
          : team,
      ),
    );
  };

  return (
    <main className="find-team-page">
      <h1 className="find-team-title">팀 찾기</h1>

      <div className="find-team-toolbar">
        <section className="find-team-filter" aria-label="팀 카테고리">
          {categories.map((category) => (
            <Tag
              key={category.id}
              isActive={selectedCategory === category.id}
              className="find-team-category"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </Tag>
          ))}
        </section>

        <label className="find-team-search">
          <span className="sr-only">팀 검색</span>
          <input
            type="search"
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
          />
        </label>
      </div>

      <section className="find-team-list" aria-label="팀 목록">
        {teamPosts.length > 0 ? (
          teamPosts.map((team) => {
            let buttonText = "지원하기";
            let buttonColor = "#FE9A57";
            let buttonTextColor = "#FFFFFF";
            let isDisabled = false;

            if (team.applyStatus === "accepted") {
              buttonText = "합격";
              buttonColor = "#FFEBDE";
              buttonTextColor = "#FE9A57";
              isDisabled = true;
            } else if (team.applyStatus === "rejected") {
              buttonText = "불합격";
              buttonColor = "#D9D9D9";
              isDisabled = true;
            } else if (team.applied) {
              buttonText = "심사중";
              buttonColor = "#D9D9D9";
              isDisabled = true;
            }

            return (
              <ApplicantBox
                key={team.id}
                title={team.title}
                summary={team.summary}
                capacity={team.capacity}
                isBookmarked={team.bookmarked}
                buttonText={buttonText}
                buttonColor={buttonColor}
                buttonTextColor={buttonTextColor}
                onButtonClick={() => {
                  if (!isDisabled) handleOpenApplyModal(team.id);
                }}
                onBookmarkClick={() => handleToggleBookmark(team.id)}
              onClick={() => navigate(`/readme/${team.id}`, { state: team })}
              />
            );
          })
        ) : (
          <div className="find-team-empty">해당 카테고리에 모집중인 팀이 없습니다.</div>
        )}
      </section>

      {teamPosts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={handleCloseApplyModal}
        onSubmit={handleSubmitApply}
        recruitmentId={selectedTeamId}
        projectName={selectedTeam?.title ?? ""}
        job={job}
        motivation={motivation}
        setJob={setJob}
        setMotivation={setMotivation}
      />
    </main>
  );
}

export default FindTeamPage;
