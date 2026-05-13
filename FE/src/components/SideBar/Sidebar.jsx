import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './Sidebar.css'; 
import SidebarItem from "./SidebarItem";
import FavoriteItem from "./FavoriteItem";
import { getMyProjectList } from '../../api/DashboardApi';

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
  const [favoriteList, setFavoriteList] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getMyProjectList(); 
        setFavoriteList(response.data); 
      } catch (error) {
        console.error("데이터 로드 실패", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

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
          />
          <SidebarItem
            to="/find-team"
            label="팀 찾기"
            icon={teamFindIcon}
            activeIcon={teamFindOrangeIcon}
          />
          <SidebarItem
            to="/applicants"
            label="지원자 검토"
            icon={applicantReviewIcon}
            activeIcon={applicantReviewOrangeIcon}
          />
          <SidebarItem
            to="/project"
            label="프로젝트"
            icon={projectIcon}
            activeIcon={projectOrangeIcon}
          />
          <SidebarItem
            to="/profile"
            label="프로필"
            icon={profileIcon}
            activeIcon={profileOrangeIcon}
          />
        </nav>

        <hr className="divider" />
        <div className="favorite-section">
          <p className="favorite-title">★ 현재 진행중인 프로젝트</p>
          <ul className="favorite-list">
            {isLoading ? (
              <p>로딩 중...</p>
            ) : (
              favoriteList.map((item) => (
                <FavoriteItem 
                  key={item.id} 
                  id={item.id}
                  name={item.projectName} 
                  dueDate={item.deadLine} 
                  dotColor={item.colorTag || 'red'} 
                />
              ))
            )}
          </ul>
        </div>
        <hr className="divider" />

        <button className="new-project-btn" onClick={() => navigate('/teammaking')}>
          + 새 프로젝트 생성
        </button>

      </aside>
    </>
  );
}

export default Sidebar;