import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import SidebarItem from "./SidebarItem";

import dashboardIcon from "../../assets/icons/dashboardIcon.svg";
import teamFindIcon from "../../assets/icons/teamFindIcon.svg";
import applicantReviewIcon from "../../assets/icons/applicantReviewIcon.svg";
import projectIcon from "../../assets/icons/projectIcon.svg";
import profileIcon from "../../assets/icons/profileIcon.svg";
import dashboardOrangeIcon from "../../assets/icons/dashboardOrangeIcon.svg";
import teamFindOrangeIcon from "../../assets/icons/teamFindOrangeIcon.svg";
import applicantReviewOrangeIcon from "../../assets/icons/applicantReviewOrangeIcon.svg";
import projectOrangeIcon from "../../assets/icons/projectOrangeIcon.svg";
import profileOrangeIcon from "../../assets/icons/profileOrangeIcon.svg";

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleNewProjectClick = () => {
    navigate('/teamCreate');
    if (onClose) onClose();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <nav className="menu-section">
          <SidebarItem
            to="/"
            label="대시보드"
            icon={dashboardIcon}
            activeIcon={dashboardOrangeIcon}
            onClick={onClose}
          />
          <SidebarItem
            to="/findTeam"
            label="팀 찾기"
            icon={teamFindIcon}
            activeIcon={teamFindOrangeIcon}
            onClick={onClose}
          />
          <SidebarItem
            to="/applicant"
            label="지원자 검토"
            icon={applicantReviewIcon}
            activeIcon={applicantReviewOrangeIcon}
            onClick={onClose}
          />
          <SidebarItem
            to="/project"
            label="프로젝트"
            icon={projectIcon}
            activeIcon={projectOrangeIcon}
            onClick={onClose}
          />
          <SidebarItem
            to="/profile"
            label="프로필"
            icon={profileIcon}
            activeIcon={profileOrangeIcon}
            onClick={onClose}
          />
        </nav>

        <hr className="divider" />

        <button className="new-project-btn" onClick={handleNewProjectClick}>
          + 새 프로젝트 생성
        </button>

      </aside>
    </>
  );
}

export default Sidebar;