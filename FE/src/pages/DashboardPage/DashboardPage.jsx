import React, { useEffect, useMemo, useState } from 'react';
import './DashboardPage.css';
import Calendar from './components/Calendar';
import projectMenuIcon from '../../assets/projectMenuIcon.svg';
import SummaryCard from './components/SummaryCard';
import StatusItem from './components/StatusItem';
import moreIcon from '../../assets/moreIcon.svg';

// 임시 데이터
const dummyDashboardData = {
  projects: [
    { id: 1, title: '캡스톤 디자인', date: '2026.05.08', ratio: '12/18' },
    { id: 2, title: 'WAP 프로젝트', date: '2026.06.05', ratio: '3/18' },
  ],
  urgentTasks: [
    { id: 1, title: '캡스톤 디자인 - 자료 조사하기', date: '2026.05.05' },
    { id: 2, title: 'WAP 프로젝트 - 중간 발표', date: '2026.05.06' },
    
  ],
  completedTasks: [
    { id: 1, title: 'WAP 프로젝트 - 대시보드 개발', date: '2025.11.28' },
    { id: 2, title: '프로그래밍 팀플 - 오류 수정', date: '2026.04.01' },
    { id: 3, title: '프로그래밍 팀플 - PPT 제작', date: '2026.04.17' },
    { id: 4, title: '캡스톤 디자인 - 프로젝트 계획서 작성', date: '2026.05.01' },
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

  useEffect(() => {
    // 백엔드 API 연결 시 이 부분 수정
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setDashboardData(dummyDashboardData);
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
                <StatusItem
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  date={project.date}
                  ratio={project.ratio}
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