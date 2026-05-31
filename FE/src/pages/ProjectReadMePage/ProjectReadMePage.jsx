import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import logoGray from '../../assets/icons/logoGW.svg';
import ProfileModal from '../../components/ProfileModal/ProfileModal';
import ApplyModal from '../../components/ApplyModal/ApplyModal';
import apiClient from '../../api/apiClient';
import './ProjectReadMePage.css';

const categoryMap = {
  ASSIGNMENT: "조별과제",
  STUDY: "스터디",
  CONTEST: "공모전",
  DEVELOPMENT: "개발",
  ETC: "기타"
};

function ProjectReadMePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // recruitmentId
  const passedData = location.state || {};

  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalPosition, setModalPosition] = useState(null);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyJob, setApplyJob] = useState('');
  const [applyMotivation, setApplyMotivation] = useState('');
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/recruitments/${id}`);
        if (response.data && response.data.isSuccess) {
          const data = response.data.data;
          setProjectData(data);
          setIsApplied(data.hasApplied);
        }
      } catch (error) {
        console.error('게시글 상세 정보 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProjectDetail();
    else setIsLoading(false);
  }, [id]);

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
    alert('지원이 완료되었습니다.');
    setIsApplied(true);
    handleCloseApplyModal();
    navigate(-1);
  };

  const handleDelete = async () => {
    if (window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      try {
        const response = await apiClient.delete(`/recruitments/${id}`);
        if (response.data && response.data.isSuccess) {
          alert("게시글이 삭제되었습니다.");
          navigate(-1);
        }
      } catch (error) {
        console.error("게시글 삭제 실패:", error);
        alert("게시글 삭제에 실패했습니다.");
      }
    }
  };

  if (isLoading) {
    return <main className="project-readme-page"><div style={{ padding: '40px', textAlign: 'center' }}>데이터를 불러오는 중입니다...</div></main>;
  }

  if (!projectData) {
    return <main className="project-readme-page"><div style={{ padding: '40px', textAlign: 'center' }}>게시글을 찾을 수 없습니다.</div></main>;
  }

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {projectData.isAuthor && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleDelete} style={{ padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #f44336', backgroundColor: '#f44336', color: '#fff', fontSize: '14px' }}>삭제</button>
              </div>
            )}
            <span className="project-readme-created-at">
              작성일: {projectData.createdAt?.split('T')[0]}
            </span>
          </div>
        </div>

        <div className="project-readme-tags">
          <span className="project-readme-tag active">
            {categoryMap[projectData.category] || projectData.category}
          </span>
        </div>

        <p className="project-readme-description">
          {projectData.content}
        </p>

        <hr className="project-readme-info-divider" />

        <div className="project-readme-team-section">
          <div className="project-readme-team-group">
            <div className="project-readme-team-role">팀장</div>
            <div 
              className="project-readme-team-member-name clickable" 
              onClick={(e) => handleMemberClick({ name: projectData.author?.nickname, profileImage: projectData.author?.profileImageUrl }, e)}
            >
              {projectData.author?.nickname || "알 수 없음"}
            </div>
          </div>
          <div className="project-readme-team-group">
            <div className="project-readme-team-role">팀원</div>
            <div className="project-readme-team-members-list">
              <span className="project-readme-team-member-name recruiting">
                {projectData.applicantCount || 0}명 지원 중
              </span>
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