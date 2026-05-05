import { useMemo, useState } from "react";
import logoIcon from "../../assets/logoIcon.svg";
import Badge from "../../components/Badge/Badge.jsx";
import MainButton from "../../components/MainButton/MainButton.jsx";
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
    applied: false,
  },
  {
    id: 3,
    category: "assignment",
    title: "캡스톤 디자인",
    summary: "안녕하세요. WAP 화이팅",
    capacity: 4,
    bookmarked: false,
    applied: false,
  },
  {
    id: 4,
    category: "assignment",
    title: "캡스톤 디자인",
    summary: "안녕하세요. WAP 화이팅",
    capacity: 4,
    bookmarked: false,
    applied: false,
  },
  {
    id: 5,
    category: "assignment",
    title: "캡스톤 디자인",
    summary: "안녕하세요. WAP 화이팅",
    capacity: 4,
    bookmarked: false,
    applied: false,
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

  const filteredTeamPosts = useMemo(() => {
    const keyword = searchKeyword.trim();

    return teamPosts.filter(
      (team) =>
        team.category === selectedCategory && isMatchedTeam(team, keyword),
    );
  }, [selectedCategory, searchKeyword, teamPosts]);

  const handleToggleBookmark = (teamId) => {
    setTeamPosts((prevTeamPosts) =>
      prevTeamPosts.map((team) =>
        team.id === teamId ? { ...team, bookmarked: !team.bookmarked } : team,
      ),
    );
  };

  const handleApply = (teamId) => {
    setTeamPosts((prevTeamPosts) =>
      prevTeamPosts.map((team) =>
        team.id === teamId ? { ...team, applied: true } : team,
      ),
    );
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
          filteredTeamPosts.map((team) => (
            <article className="find-team-card" key={team.id}>
              <div className="find-team-logo-box">
                <img src={logoIcon} alt={`${team.title} 로고`} />
              </div>

              <div className="find-team-content">
                <div className="find-team-heading">
                  <h2>{team.title}</h2>
                </div>
                <p>{team.summary}</p>
              </div>

              <div className="find-team-actions">
                <span>모집인원: {team.capacity}명</span>
                <div className="find-team-action-row">
                  <button
                    type="button"
                    className={`find-team-bookmark ${team.bookmarked ? "is-active" : ""}`}
                    aria-label={team.bookmarked ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                    aria-pressed={team.bookmarked}
                    onClick={() => handleToggleBookmark(team.id)}
                  >
                    <span aria-hidden="true" />
                  </button>
                  <MainButton
                    className={`find-team-apply-button ${team.applied ? "is-applied" : ""}`}
                    onClick={() => handleApply(team.id)}
                    aria-pressed={team.applied}
                  >
                    {team.applied ? "지원 완료" : "지원하기"}
                  </MainButton>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="find-team-empty">해당 카테고리에 모집 중인 팀이 없습니다.</div>
        )}
      </section>
    </main>
  );
}

export default FindTeamPage;
