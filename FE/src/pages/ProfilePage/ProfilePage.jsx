import React, { useState } from 'react';
import MainButton from '../../components/MainButton/MainButton';
import Avatar from '../../components/Avatar/Avatar';
import './ProfilePage.css';
import '../Teammaking/TeammakingPage.css';

const ProfilePage = () => {
  const [userInfo] = useState({
    name: '김아무개',
    taskStats: { completed: 3, total: 5 },
  });

  const [projects] = useState([
    { id: 1, title: '동아리 프로젝트', role: 'PM', startDate: '2025-03-20', endDate: null, score: null },
    { id: 2, title: 'WAP 해커톤', role: 'FE', startDate: '2025-03-20', endDate: '2025-07-20', score: 4.7 },
  ]);

  const [manualProjects] = useState([]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${y}.${m}.${d}`;
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title">
        <span style={{ color: '#FE9A57' }}>{userInfo.name}</span> 님 프로필
      </h1>

      <section className="card profile-main-card">
        {/* 상단: 아바타+이름 / 태스크 */}
        <div className="profile-header-row">
          <div className="profile-user-info">
            <Avatar src="/default-profile.png" alt="프로필" size="lg" />
            <div className="profile-name-block">
              <h2 className="user-name-text">{userInfo.name}</h2>
            </div>
          </div>
          <div className="user-task-display">
            <span className="task-stats-num">
              {userInfo.taskStats.completed}/{userInfo.taskStats.total}
            </span>
          </div>
        </div>

        <hr className="profile-divider" />

        {/* 프로젝트 경험 */}
        <div className="form-field">
          <label className="form-label">프로젝트 경험</label>
          <div className="project-experience-list">
            {[...projects]
              .sort((a, b) => (a.endDate ? 1 : -1) - (b.endDate ? 1 : -1))
              .map((proj) => (
                <div key={proj.id} className="project-experience-row">
                  <div className="proj-row-inner">
                    <div className="proj-name-group">
                      <span className="proj-title">{proj.title}</span>
                      <span className="proj-role">{proj.role}</span>
                    </div>
                    <div className="proj-right-group">
                      <span className="proj-period">
                        {formatDate(proj.startDate)}{proj.endDate ? ` ~ ${formatDate(proj.endDate)}` : ' ~'}
                      </span>
                      <span className={proj.endDate ? 'badge-completed' : 'badge-ongoing'}>
                        <span>{proj.endDate ? '완료' : '진행중'}</span>
                      </span>
                      <div className="proj-score-container">
                        {proj.score != null ? (
                          <>
                            <span className="proj-score-num">{proj.score.toFixed(1)}</span>
                            <span className="proj-score-text">점</span>
                          </>
                        ) : (
                          <span style={{ width: 47 }} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {manualProjects.map((proj) => (
              <div key={proj.id} className="project-experience-row">
                <div className="proj-row-inner">
                  <div className="proj-name-group">
                    <span className="proj-title">{proj.title}</span>
                    {proj.role && <span className="proj-role">{proj.role}</span>}
                  </div>
                  <div className="proj-right-group">
                    <span className="proj-period">
                      {formatDate(proj.startDate)}{proj.endDate ? ` ~ ${formatDate(proj.endDate)}` : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="profile-actions">
          <MainButton size="md">수정하기</MainButton>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;