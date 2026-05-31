import React, { useState } from 'react';
import Avatar from '../../components/Avatar/Avatar';
import './Applicant.css';

const applicantList = [
  {
    id: 1, name: '김은비', taskStats: { completed: 3, total: 5 }, date: '2026-05-02',
    peerEvaluationScore: 4.6,
    contributionArea: '프론트엔드 개발자',
    introduction: '함께 성장하고 배우겠습니다.',
    projects: [
      { name: '동아리 프로젝트', role: 'PM', status: '진행중', score: null, taskNames: ['시작발표 PPT 제작', '프로젝트 기획', '최종발표 PT'] },
      { name: 'WAP 해커톤', role: 'FE', status: '완료', score: 4.7, taskNames: [] },
      { name: '교양 팀플', role: null, status: '완료', score: 4.2, taskNames: null },
    ],
  },
  {
    id: 2, name: '김은비', taskStats: { completed: 3, total: 5 }, date: '2026-05-02',
    peerEvaluationScore: 3.8,
    contributionArea: '백엔드 개발자',
    introduction: '열심히 하겠습니다.',
    projects: [
      { name: '동아리 프로젝트', role: 'PM', status: '진행중', score: null, taskNames: [] },
      { name: 'WAP 해커톤', role: 'FE', status: '완료', score: 4.5, taskNames: [] },
    ],
  },
  {
    id: 3, name: '김은비', taskStats: { completed: 3, total: 5 }, date: '2026-05-02',
    peerEvaluationScore: 4.2,
    contributionArea: 'UI/UX 디자이너',
    introduction: '최선을 다하겠습니다.',
    projects: [
      { name: '동아리 프로젝트', role: 'PM', status: '진행중', score: null, taskNames: [] },
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
                <div className="ad-avatar" />
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

                {/* 프로필 헤더 */}
                <div className="app-profile-header">
                  <Avatar size="md" className="app-avatar-md" />
                  <div className="app-profile-text">
                    <div className="app-name-row">
                      <span className="app-name">{selectedApplicant.name}</span>
                      <div className="app-task-stat">
                        <span className="app-task-num">{selectedApplicant.taskStats.completed}</span>
                        <span className="app-task-denom">/{selectedApplicant.taskStats.total}</span>
                      </div>
                    </div>

                    {/* PR */}
                    {selectedApplicant.introduction && (
                      <div className="app-info-section">
                        <div className="app-info-labels">
                          <span className="app-info-label">PR</span>
                        </div>
                        <div className="app-info-values">
                          <span className="app-info-value">{selectedApplicant.introduction}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 프로젝트 경험 */}
                <div className="app-projects-section">
                  <div className="app-projects-list">
                    {selectedApplicant.projects.map((proj, i) => (
                      <div key={i} className="app-project-item">
                        <div className="app-project-header">
                          <div className="app-proj-left">
                            <span className="app-proj-name">{proj.name}</span>
                            {proj.role && <span className="app-proj-role">{proj.role}</span>}
                          </div>
                          <div className="app-proj-right">
                            <span className={proj.status === '진행중' ? 'app-status-badge--active' : 'app-status-badge--done'}>
                              {proj.status}
                            </span>
                            {proj.score != null ? (
                              <div className="app-score">
                                <span className="app-score-num">{proj.score.toFixed(1)}</span>
                                <span className="app-score-label">점</span>
                              </div>
                            ) : (
                              <div style={{ width: 47 }} />
                            )}
                          </div>
                        </div>
                        {proj.taskNames && proj.taskNames.length > 0 && (
                          <div className="app-task-names">
                            {proj.taskNames.map((task, j) => (
                              <span key={j} className="app-task-name-item">- {task}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 수락/거절 버튼 */}
              <div className="app-panel-actions">
                <button className="app-btn-reject" onClick={closePanel}>거절</button>
                <button className="app-btn-accept">수락</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ApplicantDetail;
