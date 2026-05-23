import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import Calendar from '../../components/Calendar/Calendar';
import projectMenuIcon from '../../assets/projectMenuIcon.svg';
import SummaryCard from '../../components/SummaryCard/SummaryCard';
import ProjectBox from '../../components/ProjectBox/ProjectBox';
import moreIcon from '../../assets/moreIcon.svg';
import apiClient from '../../api/apiClient';

// 임시 데이터
const dummyDashboardData = {
  projects: [
    { id: 1, title: 'WAP 프로젝트', dueDate: '2026.06.05', currentStep: 125, totalStep: 150 },
    { id: 2, title: '프로그래밍 팀플', dueDate: '2026.06.17', currentStep: 12, totalStep: 18 },
  ],
  urgentTasks: [
    { id: 1, title: '캡스톤 디자인 - 자료 조사하기', dueDate: '2026.05.05' },
    { id: 2, title: 'WAP 프로젝트 - 중간 발표', dueDate: '2026.05.06' },
  ],
  completedTasks: [
    { id: 1, title: 'WAP 프로젝트 - 대시보드 개발', dueDate: '2025.11.28' },
    { id: 2, title: '프로그래밍 팀플 - 오류 수정', dueDate: '2026.04.01' },
    { id: 3, title: '프로그래밍 팀플 - PPT 제작', dueDate: '2026.04.17' },
    { id: 4, title: '캡스톤 디자인 - 프로젝트 계획서 작성', dueDate: '2026.05.01' },
  ],
};

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    projects: [],
    urgentTasks: [],
    completedTasks: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [visibleStatusCount, setVisibleStatusCount] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        const [projectsRes, urgentTasksRes, completedTasksRes] = await Promise.all([
          apiClient.get('/dashboard/projects/me'),
          apiClient.get('/dashboard/tasks/deadline'),
          apiClient.get('/dashboard/tasks/completed'),
        ]);

        const newDashboardData = { ...dummyDashboardData };

        if (projectsRes.data.isSuccess) {
          newDashboardData.projects = projectsRes.data.data.map((project) => ({
            id: project.projectId,
            title: project.title,
            dueDate: project.endDate.replace(/-/g, '.'),
            currentStep: 0,
            totalStep: 0,
          }));
        }

        if (urgentTasksRes.data.isSuccess) {
          newDashboardData.urgentTasks = urgentTasksRes.data.data.map((task) => ({
            id: task.taskId,
            projectId: task.projectId, // 나중에 태스크 클릭 시 해당 프로젝트로 이동하기 위해 추가
            title: `${task.projectTitle} - ${task.title}`,
            dueDate: task.dueDate.replace(/-/g, '.'),
          }));
        }

        if (completedTasksRes.data.isSuccess) {
          newDashboardData.completedTasks = completedTasksRes.data.data.map((task) => ({
            id: task.taskId,
            projectId: task.projectId,
            title: `${task.projectTitle} - ${task.title}`,
            dueDate: task.dueDate.replace(/-/g, '.'),
          }));
        }

        setDashboardData(newDashboardData);
      } catch (error) {
        console.error('대시보드 데이터 조회 실패:', error);
        // 실패 시 UI를 확인하기 위해 기존 더미 데이터 세팅
        setDashboardData(dummyDashboardData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const summaryCards = useMemo(
    () => [
      {
        id: 1,
        title: '참여 중인 프로젝트',
        items: dashboardData.projects,
        showDot: true,
      },
      {
        id: 2,
        title: '마감 임박 테스크',
        items: dashboardData.urgentTasks,
      },
      {
        id: 3,
        title: '완료한 테스크',
        items: dashboardData.completedTasks,
      },
    ],
    [dashboardData]
  );

  const handleShowMoreStatus = () => {
    setVisibleStatusCount((prevCount) => prevCount + 3);
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <h1 className="dashboard-title">대시보드</h1>
        <p>대시보드 데이터를 불러오는 중입니다.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">대시보드</h1>

      <div className="dashboard-content">
        <div className="dashboard-summary-row">
          {summaryCards.map(({ id, title, items, showDot }) => (
            <SummaryCard
              key={id}
              title={title}
              count={items.length}
              items={items}
              showDot={showDot}
              onItemClick={(item) => navigate(`/project/${item.projectId || item.id}`)}
            />
          ))}
        </div>

        <div className="dashboard-detail-row">
          <Calendar />

          <div className="status-section">
            <div className="section-header">
              <img src={projectMenuIcon} alt="프로젝트 현황 아이콘" />
              <h2>프로젝트 현황</h2>
            </div>

            <div className="status-list">
              {dashboardData.projects.slice(0, visibleStatusCount).map((project) => (
                <ProjectBox
                  key={project.id}
                  title={project.title}
                  dueDate={project.dueDate}
                  currentStep={project.currentStep}
                  totalStep={project.totalStep}
                  avatarSize="52px"
                  onClick={() => navigate(`/project/${project.id}`)}
                  hidePcLabel
                />
              ))}
            </div>

            {visibleStatusCount < dashboardData.projects.length ? (
              <button 
                className="more-btn" 
                onClick={handleShowMoreStatus} 
                style={{ alignSelf: 'center', marginTop: '16px' }}
              >
                더보기
                <img src={moreIcon} alt="moreIcon" />
              </button>
            ) : dashboardData.projects.length > 3 ? (
              <button 
                className="more-btn" 
                onClick={() => setVisibleStatusCount(3)} 
                style={{ alignSelf: 'center', marginTop: '16px' }}
              >
                접기
                <img src={moreIcon} alt="moreIcon" style={{ transform: 'rotate(180deg)' }} />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;