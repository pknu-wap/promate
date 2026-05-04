import { useMemo, useState } from "react";
import Badge from "../../components/Badge/Badge.jsx";
import MainButton from "../../components/MainButton/MainButton.jsx";
import "./FindTeamPage.css";

const categories = [
  {
    id: "assignment",
    label: "조별 과제",
    colors: {
      bg: "#C2DCBB",
      border: "#5C8C61",
      text: "#5C8C61",
      activeBg: "#C2DCBB",
      activeBorder: "#5C8C61",
      activeText: "#5C8C61",
    },
  },
  {
    id: "study",
    label: "스터디",
    colors: {
      bg: "#FFD1D1",
      border: "#FF8F8F",
      text: "#D65A5A",
      activeBg: "#FFD1D1",
      activeBorder: "#FF8F8F",
      activeText: "#D65A5A",
    },
  },
  {
    id: "contest",
    label: "공모전",
    colors: {
      bg: "#E8DDF8",
      border: "#8A78A8",
      text: "#777777",
      activeBg: "#E8DDF8",
      activeBorder: "#8A78A8",
      activeText: "#777777",
    },
  },
  {
    id: "development",
    label: "개발",
    colors: {
      bg: "#B9E1FA",
      border: "#6EB7E5",
      text: "#777777",
      activeBg: "#B9E1FA",
      activeBorder: "#6EB7E5",
      activeText: "#777777",
    },
  },
  {
    id: "etc",
    label: "기타",
    colors: {
      bg: "#D9D9D9",
      border: "#666666",
      text: "#777777",
      activeBg: "#D9D9D9",
      activeBorder: "#666666",
      activeText: "#777777",
    },
  },
];

const mockTeamPosts = [
  {
    id: 1,
    category: "assignment",
    title: "캡스톤 디자인",
    capacity: 4,
    description: "컴퓨터 인공지능 공학부 캡스톤 디자인에 참여할 4분 구합니다.\nFE 2명, BE 2명 모집 받고 있습니다.",
  },
  {
    id: 2,
    category: "assignment",
    title: "캡스톤 디자인",
    capacity: 4,
    description: "컴퓨터 인공지능 공학부 캡스톤 디자인에 참여할 4분 구합니다.\nFE 2명, BE 2명 모집 받고 있습니다.",
  },
  {
    id: 3,
    category: "assignment",
    title: "캡스톤 디자인",
    capacity: 4,
    description: "컴퓨터 인공지능 공학부 캡스톤 디자인에 참여할 4분 구합니다.\nFE 2명, BE 2명 모집 받고 있습니다.",
  },
];

const getCategoryStyle = (colors) => ({
  "--category-bg": colors.bg,
  "--category-border": colors.border,
  "--category-text": colors.text,
  "--category-active-bg": colors.activeBg,
  "--category-active-border": colors.activeBorder,
  "--category-active-text": colors.activeText,
});

const getCategoryLabel = (categoryId) =>
  categories.find((category) => category.id === categoryId)?.label ?? "";

function FindTeamPage() {
  const [selectedCategory, setSelectedCategory] = useState("assignment");
  const [teamPosts] = useState(mockTeamPosts);

  const filteredTeamPosts = useMemo(
    () => teamPosts.filter((team) => team.category === selectedCategory),
    [selectedCategory, teamPosts],
  );

  const handleApply = (teamTitle) => {
    alert(`${teamTitle} 팀에 지원했습니다.`);
  };

  return (
    <main className="find-team-page">
      <section className="find-team-filter" aria-label="팀 카테고리">
        {categories.map((category) => (
          <Badge
            key={category.id}
            selected={selectedCategory === category.id}
            className="find-team-category"
            style={getCategoryStyle(category.colors)}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
          </Badge>
        ))}
      </section>

      <section className="find-team-list" aria-label="팀 목록">
        {filteredTeamPosts.length > 0 ? (
          filteredTeamPosts.map((team) => (
            <article className="find-team-card" key={team.id}>
              <div className="find-team-thumbnail" aria-hidden="true" />

              <div className="find-team-content">
                <div className="find-team-heading">
                  <h2>{team.title}</h2>
                  <span>{getCategoryLabel(team.category)}</span>
                </div>

                <p className="find-team-capacity">모집 대상: {team.capacity}명</p>
                <p className="find-team-description">{team.description}</p>
              </div>

              <MainButton
                className="find-team-apply-button"
                onClick={() => handleApply(team.title)}
              >
                지원하기
              </MainButton>
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
