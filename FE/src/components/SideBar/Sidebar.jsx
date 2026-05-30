import React from 'react';
import './Sidebar.css';
import SidebarItem from "./SidebarItem";

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <nav className="menu-section">
          <SidebarItem to="/" label="대시보드" />
          <SidebarItem to="/team" label="팀 찾기" />
          <SidebarItem to="/applicants" label="지원자 검토" />
          <SidebarItem to="/projects" label="프로젝트" />
          <SidebarItem to="/self-pr" label="프로필" />
        </nav>

        <button className="new-project-btn">
          + 새 프로젝트 생성
        </button>

      </aside>
    </>
  );
}

export default Sidebar;