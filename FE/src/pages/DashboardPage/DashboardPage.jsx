import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import Calendar from '../../components/Calendar/Calendar';
import projectMenuIcon from '../../assets/projectMenuIcon.svg';
import SummaryCard from '../../components/SummaryCard/SummaryCard';
import ProjectBox from '../../components/ProjectBox/ProjectBox';
import moreIcon from '../../assets/moreIcon.svg';
import apiClient from '../../api/apiClient';

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    projects: [],
    urgentTasks: [],
    completedTasks: [],
    projectStatuses: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [visibleStatusCount, setVisibleStatusCount] = useState(3);
  const navigate = useNavigate();

  const formatDate = (date) => date?.replace(/-/g, '.') ?? '';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        const results = await Promise.allSettled([
          apiClient.get('/dashboard/projects/me'),
          apiClient.get('/dashboard/tasks/deadline'),
          apiClient.get('/dashboard/tasks/completed'),
          apiClient.get('/dashboard/projects/status'),
        ]);

        const newDashboardData = {
          projects: [],
          urgentTasks: [],
          completedTasks: [],
          projectStatuses: [],
        };

        const projectsRes = results[0].status === 'fulfilled' ? results[0].value : null;
        const urgentTasksRes = results[1].status === 'fulfilled' ? results[1].value : null;
        const completedTasksRes = results[2].status === 'fulfilled' ? results[2].value : null;
        const projectStatusesRes = results[3].status === 'fulfilled' ? results[3].value : null;

        if (projectsRes?.data?.isSuccess) {
          newDashboardData.projects = (projectsRes.data.data || []).map((item) => {
            return {
              id: item.projectId,
              title: item.title,
              dueDate: formatDate(item.endDate),
              currentStep: 0,
              totalStep: 0,
            };
          });
        }

        if (urgentTasksRes?.data?.isSuccess) {
          newDashboardData.urgentTasks = (urgentTasksRes.data.data || []).map((task) => ({
            id: task.taskId,
            projectId: task.projectId, // 나중에 태스크 클릭 시 해당 프로젝트로 이동하기 위해 추가
            title: `${task.projectTitle} - ${task.title}`,
            dueDate: formatDate(task.dueDate),
          }));
        }

        if (completedTasksRes?.data?.isSuccess) {
          newDashboardData.completedTasks = (completedTasksRes.data.data || []).map((task) => ({
            id: task.taskId,
            projectId: task.projectId,
            title: `${task.projectTitle} - ${task.title}`,
            dueDate: formatDate(task.dueDate),
          }));
        }

        if (projectStatusesRes?.data?.isSuccess) {
          newDashboardData.projectStatuses = (projectStatusesRes.data.data || []).map((status) => {
            return {
              id: status.projectId,
              title: status.title,
              dueDate: formatDate(status.endDate),
              currentStep: status.completedTaskCount ?? 0,
              totalStep: status.totalTaskCount ?? 0,
            };
          });
        }

        setDashboardData(newDashboardData);
      } catch (error) {
        console.error('대시보드 데이터 조회 실패:', error);
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
              {dashboardData.projectStatuses.length === 0 ? (
                <div className="empty-state">
                  진행 중인 프로젝트가 없습니다.
                </div>
              ) : (
                dashboardData.projectStatuses.slice(0, visibleStatusCount).map((project) => (
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
                ))
              )}
            </div>

            {visibleStatusCount < dashboardData.projectStatuses.length ? (
              <button 
                className="more-btn" 
                onClick={handleShowMoreStatus} 
                style={{ alignSelf: 'center', marginTop: '16px' }}
              >
                더보기
                <img src={moreIcon} alt="moreIcon" />
              </button>
            ) : dashboardData.projectStatuses.length > 3 ? (
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