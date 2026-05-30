import { useMemo, useState, useEffect } from "react";
import ApplyModal from "../../components/ApplyModal/ApplyModal.jsx";
import Badge from "../../components/Badge/Badge.jsx";
import ApplicantBox from "../../components/ApplicantBox/ApplicantBox.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";
import apiClient from "../../api/apiClient.js";
import "./FindTeamPage.css";

const KOREAN_INITIALS = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

const categories = [
  { id: "assignment", label: "조별과제" },
  { id: "study", label: "스터디" },
  { id: "contest", label: "공모전" },
  { id: "development", label: "개발" },
  { id: "etc", label: "기타" },
];

const mockTeamPosts = [
  {
    id: 1,
    category: "assignment",
    title: "캡스톤 디자인",
    summary: "안녕하세요. WAP 화이팅",
    capacity: 4,
    bookmarked: false,
    applied: false,
  },
  {
    id: 2,
    category: "assignment",
    title: "인공지능 개발",
    summary: "인공지능 프로젝트에 참여할 팀원을 모집합니다",
    capacity: 4,
    bookmarked: false,
    applied: true,
    applyStatus: "reviewing",
  },
  {
    id: 3,
    category: "assignment",
    title: "캡스톤 디자인",
    summary: "안녕하세요. WAP 화이팅",
    capacity: 4,
    bookmarked: false,
    applied: true,
    applyStatus: "accepted",
  },
  {
    id: 4,
    category: "assignment",
    title: "캡스톤 디자인",
    summary: "안녕하세요. WAP 화이팅",
    capacity: 4,
    bookmarked: false,
    applied: true,
    applyStatus: "rejected",
  },
];

const getInitialConsonants = (text) =>
  Array.from(text)
    .map((char) => {
      const code = char.charCodeAt(0);

      if (code < 0xac00 || code > 0xd7a3) {
        return char;
      }

      const initialIndex = Math.floor((code - 0xac00) / 588);
      return KOREAN_INITIALS[initialIndex];
    })
    .join("");

const normalizeSearchText = (text) => text.toLowerCase().replace(/\s+/g, "");

const isMatchedTeam = (team, keyword) => {
  if (keyword.length === 0) {
    return true;
  }

  const searchableText = `${team.title} ${team.summary}`;
  const normalizedKeyword = normalizeSearchText(keyword);
  const normalizedSearchableText = normalizeSearchText(searchableText);
  const initialSearchableText = normalizeSearchText(
    getInitialConsonants(searchableText),
  );

  return (
    normalizedSearchableText.includes(normalizedKeyword) ||
    initialSearchableText.includes(normalizedKeyword)
  );
};

function FindTeamPage() {
  const [selectedCategory, setSelectedCategory] = useState("assignment");
  const [teamPosts, setTeamPosts] = useState(mockTeamPosts);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [job, setJob] = useState("");
  const [motivation, setMotivation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchKeyword]);

  const filteredTeamPosts = useMemo(() => {
    const keyword = searchKeyword.trim();

    return teamPosts.filter(
      (team) =>
        team.category === selectedCategory &&
        isMatchedTeam(team, keyword) &&
        team.applyStatus !== "accepted" &&
        team.applyStatus !== "rejected",
    );
  }, [selectedCategory, searchKeyword, teamPosts]);

  const totalPages = Math.ceil(filteredTeamPosts.length / ITEMS_PER_PAGE) || 1;
  const currentTeamPosts = filteredTeamPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
    handleCloseApplyModal();
  };

  return (
    <main className="find-team-page">
      <h1 className="find-team-title">팀 찾기</h1>

      <div className="find-team-toolbar">
        <section className="find-team-filter" aria-label="팀 카테고리">
          {categories.map((category) => (
            <Badge
              key={category.id}
              selected={selectedCategory === category.id}
              className="find-team-category"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </Badge>
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
        {currentTeamPosts.length > 0 ? (
          currentTeamPosts.map((team) => {
            let buttonText = "지원하기";
            let buttonColor = "#FE9A57";
            let buttonTextColor = "#FFFFFF";

            if (team.applied) {
              buttonText = "심사중";
              buttonColor = "#D9D9D9";
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
                  if (!team.applied) handleOpenApplyModal(team.id);
                }}
                onBookmarkClick={() => handleToggleBookmark(team.id)}
              />
            );
          })
        ) : (
          <div className="find-team-empty">해당 카테고리에 모집중인 팀이 없습니다.</div>
        )}
      </section>

      {filteredTeamPosts.length > 0 && (
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
