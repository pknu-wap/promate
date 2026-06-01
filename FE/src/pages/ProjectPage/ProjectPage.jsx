import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectBox from '../../components/ProjectBox/ProjectBox';
import ApplicantBox from '../../components/ApplicantBox/ApplicantBox';
import ApplyModal from '../../components/ApplyModal/ApplyModal';
import { getAppliedProjects, getBookmarkedProjects, getActiveProjects, getCompletedProjects } from '../../api/Project/projectApi';
import Pagination from '../../components/Pagination/Pagination';
import apiClient from '../../api/apiClient';
import './ProjectPage.css';

const tabs = [
  { key: 'bookmarked', label: '북마크' },
  { key: 'applied', label: '내 지원 현황' },
  { key: 'active', label: '진행중인 프로젝트' },
  { key: 'completed', label: '완료된 프로젝트' }
];

function ProjectPage() {
  const [activeTab, setActiveTab] = useState('bookmarked');
  const [projects, setProjects] = useState([]);
  const [appliedProjects, setAppliedProjects] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const navigate = useNavigate();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedProjectForApply, setSelectedProjectForApply] = useState(null);
  const [applyJob, setApplyJob] = useState('');
  const [applyMotivation, setApplyMotivation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      navigate(-1);
      return;
    }

    const fetchAppliedProjects = async () => {
      try {
        const response = await getAppliedProjects();
        if (response.data && response.data.isSuccess) {
          const fetchedData = response.data.data.map((item) => {
            let mappedStatus;
            switch (item.status) {
              case 'ACCEPTED': mappedStatus = 'accepted'; break;
              case 'REJECTED': mappedStatus = 'rejected'; break;
              case 'PENDING':
              default:
                mappedStatus = 'reviewing';
                break;
            }

            return {
              id: item.recruitmentId,
              applicationId: item.applicationId,
              title: item.title,
              summary: item.description,
              capacity: item.recruitCount,
              applied: true,
              applyStatus: mappedStatus,
              status: 'active',
              bookmarked: false,
            };
          });
          setAppliedProjects(fetchedData);
        }
      } catch (error) {
        console.error('지원 현황 조회 실패:', error);
      }
    };

    const fetchBookmarkedProjects = async () => {
      try {
        const response = await getBookmarkedProjects(0, ITEMS_PER_PAGE);
        if (response.data && response.data.isSuccess) {
          const fetchedData = await Promise.all(response.data.data.content.map(async (item) => {
            let mappedStatus = null;
            switch (item.myApplyStatus) {
              case 'ACCEPTED': mappedStatus = 'accepted'; break;
              case 'REJECTED': mappedStatus = 'rejected'; break;
              case 'PENDING': mappedStatus = 'reviewing'; break;
              default: mappedStatus = null; break;
            }

            let projectStatus = 'active';
            if (['COMPLETED', 'CANCELLED', 'EXPIRED'].includes(item.status)) {
              projectStatus = 'completed';
            }

            let isEvaluated = false;
            if (projectStatus === 'completed' && item.projectId && item.projectId !== 'null') {
              try {
                const statusRes = await apiClient.get(`/projects/${item.projectId}/reviews/status`);
                isEvaluated = statusRes.data?.data?.reviewed || false;
              } catch (error) {
                console.error(`프로젝트 ${item.projectId} 평가 상태 조회 실패:`, error);
              }
            }

            return {
              id: item.recruitmentId,
              projectId: item.projectId,
              applicationId: item.myApplicationId,
              title: item.title,
              summary: item.description,
              capacity: item.maxMember,
              dueDate: item.deadline ? item.deadline.split('T')[0].replace(/-/g, '.') : '',
              currentStep: item.currentMember,
              totalStep: item.maxMember,
              bookmarked: true,
              applied: item.myApplyStatus !== null,
              applyStatus: mappedStatus,
              status: projectStatus,
              isEvaluated
            };
          }));
          setProjects(fetchedData);
        }
      } catch (error) {
        console.error('북마크 내역 조회 실패:', error);
      }
    };

    const fetchActiveProjects = async () => {
      try {
        const response = await getActiveProjects();
        if (response.data && response.data.isSuccess) {
          const fetchedData = response.data.data.map((item) => ({
            id: `active-${item.projectId}`,
            projectId: item.projectId,
            title: item.title,
            dueDate: item.endDate ? item.endDate.replace(/-/g, '.') : '',
            currentStep: item.completedTaskCount,
            totalStep: item.completedTaskCount + item.incompleteTaskCount,
          }));
          setActiveProjects(fetchedData);
        }
      } catch (error) {
        console.error('진행중인 프로젝트 조회 실패:', error);
      }
    };

    const fetchCompletedProjects = async () => {
      try {
        const response = await getCompletedProjects();
        if (response.data && response.data.isSuccess) {
          const fetchedData = await Promise.all(response.data.data.map(async (item) => {
            let isEvaluated = false;
            if (item.projectId && item.projectId !== 'null') {
              try {
                const statusRes = await apiClient.get(`/projects/${item.projectId}/reviews/status`);
                isEvaluated = statusRes.data?.data?.reviewed || false;
              } catch (error) {
                console.error(`프로젝트 ${item.projectId} 평가 상태 조회 실패:`, error);
              }
            }

            return {
              id: `completed-${item.projectId}`,
              projectId: item.projectId,
              title: item.title,
              summary: item.description,
              status: 'completed',
              applyStatus: 'accepted',
              bookmarked: false,
              isEvaluated,
            };
          }));
          setCompletedProjects(fetchedData);
        }
      } catch (error) {
        console.error('완료된 프로젝트 조회 실패:', error);
      }
    };

    fetchAppliedProjects();
    fetchBookmarkedProjects();
    fetchActiveProjects();
    fetchCompletedProjects();
  }, [navigate]);

  const handleToggleBookmark = (id) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, bookmarked: !p.bookmarked } : p)));
    setAppliedProjects((prev) => prev.map((p) => (p.id === id ? { ...p, bookmarked: !p.bookmarked } : p)));
  };

  const filteredProjects = useMemo(() => {
    if (activeTab === 'applied') {
      return appliedProjects;
    }
    if (activeTab === 'active') {
      return activeProjects;
    }
    if (activeTab === 'completed') {
      return completedProjects;
    }

    return projects.filter((project) => {
      switch (activeTab) {
        case 'bookmarked':
          return project.bookmarked;
        default:
          return true;
      }
    });
  }, [activeTab, projects, appliedProjects, activeProjects, completedProjects]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
              onClick={() => {
                setActiveTab(tab.key);
                setCurrentPage(1);
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>

        <div className="project-list">
          {filteredProjects.length > 0 ? (
            currentProjects.map((project) => {
              // 합격한 경우에 한해 존재하는 projectId로 이동 처리. 대기 중/탈락은 기존 id 활용
              const targetId = (project.applyStatus === 'accepted' && project.projectId) ? project.projectId : project.id;

              if (activeTab === 'active') {
                return (
                  <ProjectBox 
                    key={project.id}
                    title={project.title}
                    dueDate={project.dueDate}
                    currentStep={project.currentStep}
                    totalStep={project.totalStep}
                    onClick={() => navigate(`/project/${project.projectId}`, { state: { projectTitle: project.title, dueDate: project.dueDate } })}
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

              const handleBoxClick = () => {
                if (project.applyStatus === 'rejected') {
                  alert('불합격한 프로젝트는 상세 내역에 접근할 수 없습니다.');
                  return;
                }

                if (activeTab === 'completed' || project.status === 'completed') {
                  navigate(`/project/${project.projectId || targetId}`, { state: { projectTitle: project.title, dueDate: project.dueDate } });
                  return;
                }
                
                navigate(`/readme/${targetId}`, { state: project });
              };

              const handleButtonClick = () => {
                if (isButtonDisabled) return;
                if (buttonText === '지원하기') {
                  setSelectedProjectForApply(project);
                  setIsApplyModalOpen(true);
                } else if (buttonText === '상호평가') {
                  navigate('/member-review', { state: { projectId: project.projectId || project.id } });
                } else {
                  handleBoxClick();
                }
              };

              return (
                <ApplicantBox
                  key={project.id}
                  title={project.title}
                  summary={project.summary}
                  capacity={project.capacity}
                  showCapacity={project.status !== 'completed'}
                  isBookmarked={project.bookmarked}
                  buttonText={buttonText}
                  buttonColor={buttonColor}
                  buttonTextColor={buttonTextColor}
                  disabled={isButtonDisabled}
                  onClick={handleBoxClick}
                  onButtonClick={handleButtonClick}
                  onBookmarkClick={() => handleToggleBookmark(project.id)}
                />
              );
            })
          ) : (
            <div className="project-empty">해당하는 프로젝트가 없습니다.</div>
          )}
        </div>
        
        {filteredProjects.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={handleCloseApplyModal}
        onSubmit={() => {
          console.log('지원하기 제출:', selectedProjectForApply?.title, applyJob, applyMotivation);
          alert('지원이 완료되었습니다.');
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