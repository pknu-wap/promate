import React, { useState, useEffect } from 'react'; 
import './Sidebar.css'; 
import SidebarItem from "./SidebarItem";
import FavoriteItem from "./FavoriteItem";
import { getMyProjectList } from '../../api/DashboardApi';

function Sidebar({ isOpen, onClose }) {
  const [favoriteList, setFavoriteList] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  
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
          <SidebarItem to="/" label="대시보드" />
          <SidebarItem to="/team" label="팀 찾기" />
          <SidebarItem to="/applicants" label="지원자 검토" />
          <SidebarItem to="/projects" label="프로젝트" />
          <SidebarItem to="/self-pr" label="프로필" />
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
                  name={item.projectName} 
                  dueDate={item.deadLine} 
                  dotColor={item.colorTag || 'red'} 
                />
              ))
            )}
          </ul>
        </div>

        <button className="new-project-btn">
          + 새 프로젝트 생성
        </button>

      </aside>
    </>
  );
}

export default Sidebar;