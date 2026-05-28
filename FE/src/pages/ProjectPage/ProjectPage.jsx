import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectBox from '../../components/ProjectBox/ProjectBox';
import ApplicantBox from '../../components/ApplicantBox/ApplicantBox';
import ApplyModal from '../../components/ApplyModal/ApplyModal';
import './ProjectPage.css';

const mockProjects = [
  { id: 1, title: '프로그래밍 팀플', summary: '안녕하세요. 팀플 화이팅', capacity: 4, dueDate: '2026.05.17', currentStep: 12, totalStep: 18, bookmarked: true, applied: true, applyStatus: 'accepted', status: 'active' },
  { id: 2, title: 'WAP 프로젝트', summary: '대시보드 기획 및 FE/BE 개발', capacity: 6, dueDate: '2026.06.05', currentStep: 125, totalStep: 150, bookmarked: true, applied: true, applyStatus: 'reviewing', status: 'active' },
  { id: 3, title: '캡스톤 디자인', summary: '캡스톤 디자인 프로젝트 팀원 모집합니다.', capacity: 4, dueDate: '2026.07.07', currentStep: 51, totalStep: 100, bookmarked: false, applied: true, applyStatus: 'rejected', status: 'active' },
  { id: 4, title: '알고리즘 스터디', summary: '매주 1회 알고리즘 문제 풀이 스터디', capacity: 8, dueDate: '2023.05.10', currentStep: 93, totalStep: 100, bookmarked: false, applied: true, applyStatus: 'accepted', status: 'completed', isEvaluated: false },
  { id: 6, title: '웹 서비스 클론코딩', summary: 'React를 이용한 프론트엔드 스터디', capacity: 5, dueDate: '2023.08.20', currentStep: 100, totalStep: 100, bookmarked: false, applied: true, applyStatus: 'accepted', status: 'completed', isEvaluated: true },
  { id: 5, title: '인공지능 개발', summary: 'AI 모델링 및 데이터 전처리 팀원 모집', capacity: 3, dueDate: '2026.12.05', currentStep: 0, totalStep: 0, bookmarked: true, applied: false, applyStatus: null, status: 'active' }
];

const tabs = [
  { key: 'bookmarked', label: '북마크' },
  { key: 'applied', label: '내 지원 현황' },
  { key: 'active', label: '진행중인 프로젝트' },
  { key: 'completed', label: '완료된 프로젝트' }
];

function ProjectPage() {
  const [activeTab, setActiveTab] = useState('bookmarked');
  const [projects, setProjects] = useState(mockProjects);
  const navigate = useNavigate();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedProjectForApply, setSelectedProjectForApply] = useState(null);
  const [applyJob, setApplyJob] = useState('');
  const [applyMotivation, setApplyMotivation] = useState('');

  const handleToggleBookmark = (id) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, bookmarked: !p.bookmarked } : p)));
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      switch (activeTab) {
        case 'active':
          return project.applied && project.status === 'active';
        case 'applied':
          return project.applied;
        case 'bookmarked':
          return project.bookmarked;
        case 'completed':
          return project.applied && project.status === 'completed';
        default:
          return true;
      }
    });
  }, [activeTab, projects]);

  const handleCloseApplyModal = () => {
    setIsApplyModalOpen(false);
    setSelectedProjectForApply(null);
    setApplyJob('');
    setApplyMotivation('');
  };

  return (
    <div className="project-container">
      <div className="project-content">
        <h1 className="project-page-title">프로젝트</h1>
        
        <div className="tabs-container">
          {tabs.map((tab) => (
            <div 
              key={tab.key} 
              className={`tab-item ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        <div className="project-list">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => {
              if (activeTab === 'active') {
                return (
                  <ProjectBox 
                    key={project.id}
                    title={project.title}
                    dueDate={project.dueDate}
                    currentStep={project.currentStep}
                    totalStep={project.totalStep}
                    onClick={() => navigate(`/project/${project.id}`)}
                  />
                );
              }

              let buttonText = '지원하기';
              let buttonColor = '#FE9A57';
              let buttonTextColor;
              let isButtonDisabled = false;

              if (activeTab === 'completed' || (activeTab === 'bookmarked' && project.status === 'completed')) {
                if (project.isEvaluated) {
                  buttonText = '완료';
                  buttonColor = '#D9D9D9';
                  isButtonDisabled = true;
                } else {
                  buttonText = '상호평가';
                  buttonColor = '#FE9A57';
                }
              } else if (activeTab === 'applied' || (activeTab === 'bookmarked' && project.applied)) {
                isButtonDisabled = true;
                switch (project.applyStatus) {
                  case 'accepted':
                    buttonText = '합격';
                    buttonColor = '#FFEBDE';
                    buttonTextColor = '#FE9A57';
                    break;
                  case 'rejected':
                    buttonText = '불합격';
                    buttonColor = '#D9D9D9';
                    break;
                  case 'reviewing':
                  default:
                    buttonText = '심사중';
                    buttonColor = '#D9D9D9';
                    break;
                }
              }

              return (
                <ApplicantBox
                  key={project.id}
                  title={project.title}
                  summary={project.summary}
                  capacity={project.capacity}
                  isBookmarked={project.bookmarked}
                  buttonText={buttonText}
                  buttonColor={buttonColor}
                  buttonTextColor={buttonTextColor}
                  disabled={isButtonDisabled}
                  onClick={() => navigate(`/project/${project.id}`)}
                  onButtonClick={() => {
                    if (isButtonDisabled) return;
                    if (buttonText === '지원하기') {
                      setSelectedProjectForApply(project);
                      setIsApplyModalOpen(true);
                    } else if (buttonText === '상호평가') {
                      navigate('/member-review', { state: { projectId: project.id } });
                    } else {
                      navigate(`/project/${project.id}`);
                    }
                  }}
                  onBookmarkClick={() => handleToggleBookmark(project.id)}
                />
              );
            })
          ) : (
            <div className="project-empty">해당하는 프로젝트가 없습니다.</div>
          )}
        </div>
      </div>

      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={handleCloseApplyModal}
        onSubmit={() => {
          console.log('지원하기 제출:', selectedProjectForApply?.title, applyJob, applyMotivation);
          handleCloseApplyModal();
        }}
        projectName={selectedProjectForApply?.title || ''}
        job={applyJob}
        motivation={applyMotivation}
        setJob={setApplyJob}
        setMotivation={setApplyMotivation}
      />
    </div>
  );
}

export default ProjectPage;