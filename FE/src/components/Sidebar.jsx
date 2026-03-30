import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; 
import SidebarItem from "./SidebarItem";
import FavoriteItem from "./FavoriteItem";

function Sidebar() {
  const favoriteList = [
    { id: 1, projectName: "캡스톤 디자인", deadLine: "2026.03.17", colorTag: "red" },
    { id: 2, projectName: "WAP 프로젝트", deadLine: "2026.03.31", colorTag: "yellow" },
    { id: 3, projectName: "팀플 과제", deadLine: "2026.04.01", colorTag: "green" },
  ];

  return (
    <aside className="sidebar">
      
      {/* 1. 상단 메인 메뉴 */}
      <SidebarItem to="/" label="대시보드" />
      <SidebarItem to="/team" label="팀 찾기" />
      <SidebarItem to="/applicants" label="지원자 검토" />
      <SidebarItem to="/projects" label="프로젝트" />
      <SidebarItem to="/self-pr" label="프로필" />

      <hr className="divider" />

      {/* 2. 중간 즐겨찾기 메뉴 */}
      <div className="favorite-section">
        <p className="favorite-title">★ 즐겨찾기</p>
        <ul className="favorite-list">
          {favoriteList.map((item) => (
            <FavoriteItem 
              key={item.id} 
              name={item.projectName} 
              dueDate={item.deadLine} 
              dotColor={item.colorTag} 
            />
          ))}
        </ul>
      </div>

      {/* 3. 하단 버튼 */}
      <button className="new-project-btn">
        + 새 프로젝트 생성
      </button>

    </aside>
  );
}

export default Sidebar;