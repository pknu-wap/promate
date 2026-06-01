import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import Calendar from '../../components/Calendar/Calendar';
import projectMenuIcon from '../../assets/projectMenuIcon.svg';
import SummaryCard from '../../components/SummaryCard/SummaryCard';
import ProjectBox from '../../components/ProjectBox/ProjectBox';
import moreIcon from '../../assets/moreIcon.svg';
import { getDashboardProjects, getDashboardUrgentTasks, getDashboardCompletedTasks, getDashboardProjectStatuses } from '../../api/Dashboard/dashboardApi';

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    projects: [],
    urgentTasks: [],
    completedTasks: [],
    projectStatuses: [],
  });

  const [fetchErrors, setFetchErrors] = useState({
    projects: false,
    urgentTasks: false,
    completedTasks: false,
    projectStatuses: false,
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
          getDashboardProjects(),
          getDashboardUrgentTasks(),
          getDashboardCompletedTasks(),
          getDashboardProjectStatuses(),
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

        setFetchErrors({
          projects: results[0].status === 'rejected',
          urgentTasks: results[1].status === 'rejected',
          completedTasks: results[2].status === 'rejected',
          projectStatuses: results[3].status === 'rejected',
        });

        if (projectsRes) {
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

        if (urgentTasksRes) {
          newDashboardData.urgentTasks = (urgentTasksRes.data.data || []).map((task) => ({
            id: task.taskId,
            projectId: task.projectId, // 나중에 태스크 클릭 시 해당 프로젝트로 이동하기 위해 추가
            projectTitle: task.projectTitle,
            title: `${task.projectTitle} - ${task.title}`,
            dueDate: formatDate(task.dueDate),
          }));
        }

        if (completedTasksRes) {
          newDashboardData.completedTasks = (completedTasksRes.data.data || []).map((task) => ({
            id: task.taskId,
            projectId: task.projectId,
            projectTitle: task.projectTitle,
            title: `${task.projectTitle} - ${task.title}`,
            dueDate: formatDate(task.dueDate),
          }));
        }

        if (projectStatusesRes) {
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
        isError: fetchErrors.projects,
      },
      {
        id: 2,
        title: '마감 임박 테스크',
        items: dashboardData.urgentTasks,
        isError: fetchErrors.urgentTasks,
      },
      {
        id: 3,
        title: '완료한 테스크',
        items: dashboardData.completedTasks,
        isError: fetchErrors.completedTasks,
      },
    ],
    [dashboardData, fetchErrors]
  );

  const handleShowMoreStatus = () => {
    setVisibleStatusCount((prevCount) => prevCount + 3);
  };

  const isAllEmpty = summaryCards.every((card) => card.items.length === 0);

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
          {summaryCards.map(({ id, title, items, showDot, isError }) => (
            <SummaryCard
              key={id}
              title={title}
              count={items.length}
              items={items}
              showDot={showDot}
              isError={isError}
            isAllEmpty={isAllEmpty}
            onItemClick={(item) => navigate(`/project/${item.projectId || item.id}`, { state: { projectTitle: item.projectTitle || item.title, dueDate: item.dueDate } })}
            />
          ))}
        </div>

        <div className="dashboard-detail-row">
          <Calendar showAddButton={false} />

          <div className="status-section">
            <div className="section-header">
              <img src={projectMenuIcon} alt="프로젝트 현황 아이콘" />
              <h2>프로젝트 현황</h2>
            </div>

            <div className="status-list">
            {fetchErrors.projectStatuses ? (
              <div className="empty-state error-state" style={{ color: '#E53E3E' }}>
                프로젝트 현황을 불러오는 데 실패했습니다.
              </div>
            ) : dashboardData.projectStatuses.length === 0 ? (
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
                    onClick={() => navigate(`/project/${project.id}`, { state: { projectTitle: project.title, dueDate: project.dueDate } })}
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