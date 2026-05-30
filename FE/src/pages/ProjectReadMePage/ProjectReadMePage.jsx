import React, { useState } from 'react';
import logoGray from '../../assets/icons/logoGW.svg';
import ProfileModal from '../../components/ProfileModal/ProfileModal';
import './ProjectReadMePage.css';

function ProjectReadMePage() {
  const projectData = {
    title: "ProMate",
    createdAt: "2026-03-18T14:30:00",
    category: "개발",
    // status: "RECRUITING", // RECRUITING, IN_PROGRESS, COMPLETED
    status: "COMPLETED",
    recruitingCount: 6,
    tags: ["조별과제", "스터디", "공모전", "개발", "기타"],
    description: "ProMate는 팀 프로젝트의 협업 툴로서 과거 데이터 기반 팀빌딩, 협업 지원 웹사이트입니다. FE 3명, BE 3명 모집합니다.",
    leader: { name: "홍길동", role: "팀장" },
    members: [
      { name: "김영희", role: "팀원" },
      { name: "김철수", role: "팀원" },
      { name: "김영희", role: "팀원" },
      { name: "김영희", role: "팀원" }
    ]
  };

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalPosition, setModalPosition] = useState(null);

  const handleMemberClick = (user, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setModalPosition({
      top: rect.top,
      left: rect.left,
      width: rect.width
    });
    setSelectedUser(user);
    setIsProfileModalOpen(true);
  };

  return (
    <main className="project-readme-page">
      <div className="project-readme-banner">
        <div className="project-readme-banner-logo-wrapper">
          <img src={logoGray} alt="프로젝트 로고" width="180" height="180" />
        </div>
      </div>
      
      <div className="project-readme-info-section">
        <div className="project-readme-header-row">
          <h1 className="project-readme-title">{projectData.title}</h1>
          <span className="project-readme-created-at">생성일: {projectData.createdAt.replace('T', ' ')}</span>
        </div>

        <div className="project-readme-tags">
          {projectData.tags.map((tag, index) => (
            <span 
              key={index} 
              className={`project-readme-tag ${projectData.category === tag ? 'active' : ''}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="project-readme-description">
          {projectData.description}
        </p>

        <hr className="project-readme-info-divider" />

        <div className="project-readme-team-section">
          <div className="project-readme-team-group">
            <div className="project-readme-team-role">{projectData.leader.role}</div>
            <div 
              className="project-readme-team-member-name clickable" 
              onClick={(e) => handleMemberClick(projectData.leader, e)}
            >
              {projectData.leader.name}
            </div>
          </div>
          <div className="project-readme-team-group">
            <div className="project-readme-team-role">팀원</div>
            <div className="project-readme-team-members-list">
              {projectData.status === "RECRUITING" ? (
                <span className="project-readme-team-member-name recruiting">
                  {projectData.recruitingCount}명 모집중
                </span>
              ) : (
                projectData.members.map((member, idx) => (
                  <span 
                    key={idx} 
                    className="project-readme-team-member-name clickable" 
                    onClick={(e) => handleMemberClick(member, e)}
                  >
                    {member.name}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        user={selectedUser} 
        position={modalPosition}
      />
    </main>
  );
}

export default ProjectReadMePage;