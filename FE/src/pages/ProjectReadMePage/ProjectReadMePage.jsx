import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import logoGray from '../../assets/icons/logoGW.svg';
import ProfileModal from '../../components/ProfileModal/ProfileModal';
import ApplyModal from '../../components/ApplyModal/ApplyModal';
import './ProjectReadMePage.css';

const categoryMap = {
  assignment: "조별과제",
  study: "스터디",
  contest: "공모전",
  development: "개발",
  etc: "기타"
};

function ProjectReadMePage() {
  const location = useLocation();
  const passedData = location.state || {};

  const projectData = {
    title: passedData.title || "ProMate",
    createdAt: passedData.dueDate || "2026-05-30T14:30:00",
    category: categoryMap[passedData.category] || "개발",
    status: passedData.status === 'completed' ? 'COMPLETED' : "RECRUITING",
    applied: passedData.applied ?? false,
    recruitingCount: passedData.capacity || 6,
    tags: ["조별과제", "스터디", "공모전", "개발", "기타"],
    description: passedData.summary || "FE 3명, BE 3명 모집합니다. ProMate는 팀 프로젝트의 협업 툴로서 과거 데이터 기반 팀빌딩, 협업 지원 웹사이트입니다.",
    leader: { name: "이찬이", role: "팀장" },
    members: [
      { name: "구정아", role: "팀원" },
      { name: "김수민", role: "팀원" },
      { name: "김원빈", role: "팀원" },
      { name: "김재민", role: "팀원" },
      { name: "백진선", role: "팀원" },
      { name: "최하진", role: "팀원" }
    ]
  };

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalPosition, setModalPosition] = useState(null);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyJob, setApplyJob] = useState('');
  const [applyMotivation, setApplyMotivation] = useState('');
  const [isApplied, setIsApplied] = useState(passedData.applied || false);

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

  const handleApplyClick = () => {
    setIsApplyModalOpen(true);
  };

  const handleCloseApplyModal = () => {
    setIsApplyModalOpen(false);
    setApplyJob('');
    setApplyMotivation('');
  };

  const handleSubmitApply = () => {
    console.log('지원 완료:', projectData.title, applyJob, applyMotivation);
    setIsApplied(true);
    handleCloseApplyModal();
  };

  return (
    <main className="project-readme-page">
      <div className="project-readme-banner">
        <div className="project-readme-banner-logo-wrapper">
          <img className='project-readme-banner-logo' src={logoGray} alt="프로젝트 로고" />
        </div>
      </div>
      
      <div className="project-readme-info-section">
        <div className="project-readme-header-row">
          <h1 className="project-readme-title">{projectData.title}</h1>
          <span className="project-readme-created-at">
            {passedData.dueDate 
              ? `마감일: ${projectData.createdAt}` 
              : `생성일: ${projectData.createdAt.replace('T', ' ')}`}
          </span>
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

        {projectData.status === "RECRUITING" && (
          <div className="project-readme-apply-container">
            <button 
              className={`project-readme-apply-btn ${isApplied ? 'reviewing' : 'apply'}`}
              onClick={() => !isApplied && handleApplyClick()}
              disabled={isApplied}
            >
              {isApplied ? '심사중' : '지원하기'}
            </button>
          </div>
        )}
      </div>

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        user={selectedUser} 
        position={modalPosition}
      />

      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={handleCloseApplyModal}
        onSubmit={handleSubmitApply}
        projectName={projectData.title}
        job={applyJob}
        motivation={applyMotivation}
        setJob={setApplyJob}
        setMotivation={setApplyMotivation}
      />
    </main>
  );
}

export default ProjectReadMePage;