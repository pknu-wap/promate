import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import logoGray from '../../assets/icons/logoGW.svg';
import ProfileModal from '../../components/ProfileModal/ProfileModal';
import ApplyModal from '../../components/ApplyModal/ApplyModal';
import apiClient from '../../api/apiClient';
import Tag from '../../components/Tag/Tag';
import './ProjectReadMePage.css';

const categoryMap = {
  PROJECT: "조별과제",
  STUDY: "스터디",
  CONTEST: "공모전",
  DEV: "개발",
  ETC: "기타"
};

const categories = [
  { id: "PROJECT", label: "조별과제" },
  { id: "STUDY", label: "스터디" },
  { id: "CONTEST", label: "공모전" },
  { id: "DEV", label: "개발" },
  { id: "ETC", label: "기타" },
];

function ProjectReadMePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { postId } = useParams();
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
        const response = await apiClient.get(`/recruitments/${postId}`);
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

    if (postId) fetchProjectDetail();
    else setIsLoading(false);
  }, [postId]);

  const handleMemberClick = async (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setModalPosition({
      top: rect.top,
      left: rect.left,
      width: rect.width
    });

    try {
      const response = await apiClient.get(`/recruitments/${postId}/leader-profile`);
      if (response.data && response.data.isSuccess) {
        setSelectedUser(response.data.data);
        setIsProfileModalOpen(true);
      }
    } catch (error) {
      console.error('팀장 프로필 조회 실패:', error);
      alert('팀장 프로필 정보를 불러오는데 실패했습니다.');
    }
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
        const response = await apiClient.delete(`/recruitments/${postId}`);
        if (response.data && response.data.isSuccess) {
          alert(response.data.message || "성공적으로 삭제되었습니다.");
          navigate(-1, { replace: true });
        }
      } catch (error) {
        console.error("게시글 삭제 실패:", error);
        alert(error.message || "게시글 삭제에 실패했습니다.");
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
          <div className="project-readme-date-container">
            <span className="project-readme-created-at">
              작성일: {projectData.createdAt?.split('T')[0]}
            </span>
            {projectData.startDate && projectData.endDate && (
              <span className="project-readme-created-at">
                프로젝트 기간: {projectData.startDate} ~ {projectData.endDate}
              </span>
            )}
          </div>
        </div>

        <div className="project-readme-tags">
          {categories.map((category) => (
            <Tag
              key={category.id}
              isActive={projectData.category === category.id || projectData.category?.toUpperCase() === category.id}
              hideInactiveOnMobile={true}
            >
              {category.label}
            </Tag>
          ))}
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
              onClick={handleMemberClick}
            >
              {projectData.author?.nickname || "알 수 없음"}
            </div>
          </div>
          <div className="project-readme-team-group">
            <div className="project-readme-team-role">팀원</div>
            <div className="project-readme-team-members-list">
              <span className="project-readme-team-member-name recruiting">
                {projectData.totalSlots || 0}명 모집중
              </span>
            </div>
          </div>
        </div>

        {projectData.isAuthor ? (
          <div className="project-readme-apply-container">
            <button 
              className="project-readme-delete-btn"
              onClick={handleDelete}
            >
              삭제
            </button>
          </div>
        ) : (
          projectData.status === "RECRUITING" && (
            <div className="project-readme-apply-container">
              <button 
                className={`project-readme-apply-btn ${isApplied ? 'reviewing' : 'apply'}`}
                onClick={() => !isApplied && handleApplyClick()}
                disabled={isApplied}
              >
                {isApplied ? '심사중' : '지원하기'}
              </button>
            </div>
          )
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