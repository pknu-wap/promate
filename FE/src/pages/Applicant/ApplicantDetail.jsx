import React, { useState } from 'react';
import Avatar from '../../components/Avatar/Avatar';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import logoIcon from '../../assets/logoIcon.svg';
import './Applicant.css';

const applicantList = [
  {
    id: 1, name: '김은비', taskStats: { completed: 3, total: 5 }, date: '2026-05-02',
    projects: [
      { name: '동아리 프로젝트', role: 'PM', status: '진행중', score: 4.6 },
      { name: 'WAP 해커톤', role: 'FE', status: '완료', score: 4.7 },
    ],
  },
  {
    id: 2, name: '김은비', taskStats: { completed: 3, total: 5 }, date: '2026-05-02',
    projects: [
      { name: '동아리 프로젝트', role: 'PM', status: '진행중', score: 4.6 },
      { name: 'WAP 해커톤', role: 'FE', status: '완료', score: 4.7 },
    ],
  },
  {
    id: 3, name: '김은비', taskStats: { completed: 3, total: 5 }, date: '2026-05-02',
    projects: [
      { name: '동아리 프로젝트', role: 'PM', status: '진행중', score: 4.6 },
      { name: 'WAP 해커톤', role: 'FE', status: '완료', score: 4.7 },
    ],
  },
];

const tabs = [
  { key: 'applicant', label: '현재 지원자' },
  { key: 'member', label: '현재 팀원' },
  { key: 'rejected', label: '거절한 지원자' },
];

const ApplicantDetail = () => {
  const [activeTab, setActiveTab] = useState('applicant');
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const closePanel = () => setSelectedApplicant(null);

  return (
    <div className="ad-page">
      <h1 className="ad-title">지원자 검토 - 캡스톤 디자인</h1>

      <div className="ad-card">
        <div className="ad-tab-bar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`ad-tab${activeTab === tab.key ? ' ad-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="ad-table">
          <div className="ad-thead">
            <span className="ad-th ad-th--name">이름</span>
            <span className="ad-th">태스크</span>
            <span className="ad-th ad-th--date">지원 날짜</span>
            <span />
          </div>

          {applicantList.map((person) => (
            <div key={person.id} className="ad-row">
              <div className="ad-name-cell">
                <div className="al-logo-box">
                  <img src={logoIcon} alt="avatar" />
                </div>
                <span className="ad-name-text">{person.name}</span>
              </div>
              <div className="ad-cell ad-task-stat">
                <span className="ad-task-num">{person.taskStats.completed}</span>
                <span className="ad-task-sep">/</span>
                <span className="ad-task-total">{person.taskStats.total}</span>
              </div>
              <span className="ad-cell ad-cell--date">{person.date.replace(/-/g, ' - ')}</span>
              <button
                className="ad-view-btn"
                onClick={() => setSelectedApplicant(person)}
              >
                지원서 보기
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedApplicant && (
        <>
          <div className="app-panel-dim" onClick={closePanel} />

          <div className="app-panel">
            <div className="app-panel-inner">
              <div className="app-panel-top">
                <div className="app-profile-header">
                  <Avatar size="lg" className="app-avatar-lg" />
                  <div className="app-profile-text">
                    <div className="app-name-row">
                      <span className="app-name">{selectedApplicant.name}</span>
                      <div className="app-task-stat">
                        <span className="app-task-num">{selectedApplicant.taskStats.completed}</span>
                        <span className="app-task-denom">/{selectedApplicant.taskStats.total}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="app-projects-section">
                  <span className="app-projects-title">프로젝트 경험</span>
                  <div className="app-projects-list">
                    {selectedApplicant.projects.map((proj, i) => (
                      <ProjectCard
                        key={i}
                        name={proj.name}
                        role={proj.role}
                        status={proj.status}
                        score={proj.score}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="app-panel-actions">
                <button className="app-btn-accept">수락</button>
                <button className="app-btn-reject" onClick={closePanel}>거절</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ApplicantDetail;
