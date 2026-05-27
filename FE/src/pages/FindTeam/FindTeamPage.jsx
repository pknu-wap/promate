import { useMemo, useState } from "react";
import ApplyModal from "../../components/ApplyModal/ApplyModal.jsx";
import Badge from "../../components/Badge/Badge.jsx";
import ApplicantBox from "../../components/ApplicantBox/ApplicantBox.jsx";
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

  const filteredTeamPosts = useMemo(() => {
    const keyword = searchKeyword.trim();

    return teamPosts.filter(
      (team) =>
        team.category === selectedCategory && isMatchedTeam(team, keyword),
    );
  }, [selectedCategory, searchKeyword, teamPosts]);

  const selectedTeam = teamPosts.find((team) => team.id === selectedTeamId);
  const isApplyModalOpen = selectedTeamId !== null;

  const handleToggleBookmark = (teamId) => {
    setTeamPosts((prevTeamPosts) =>
      prevTeamPosts.map((team) =>
        team.id === teamId ? { ...team, bookmarked: !team.bookmarked } : team,
      ),
    );
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
        {filteredTeamPosts.length > 0 ? (
          filteredTeamPosts.map((team) => {
            let buttonText = "지원하기";
            let buttonColor = "#FE9A57";
            let buttonTextColor = "#FFFFFF";

            if (team.applied) {
              switch (team.applyStatus) {
                case "accepted":
                  buttonText = "합격";
                  buttonColor = "#FFEBDE";
                  buttonTextColor = "#FE9A57";
                  break;
                case "rejected":
                  buttonText = "불합격";
                  buttonColor = "#D9D9D9";
                  break;
                case "reviewing":
                default:
                  buttonText = "심사중";
                  buttonColor = "#D9D9D9";
                  break;
              }
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
          <div className="find-team-empty">해당 카테고리에 모집 중인 팀이 없습니다.</div>
        )}
      </section>

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
