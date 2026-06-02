import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Avatar from '../../components/Avatar/Avatar';
import logoIcon from '../../assets/logoIcon.svg';
import {
  getPendingApplications,
  getAcceptedApplications,
  getRejectedApplications,
  getApplicationDetail,
  updateApplicationStatus,
  completeRecruitment,
} from '../../api/RecruitApi';
import './Applicant.css';

const tabs = [
  { key: 'PENDING', label: '현재 지원자' },
  { key: 'ACCEPTED', label: '현재 팀원' },
  { key: 'REJECTED', label: '거절한 지원자' },
];

const ApplicantDetail = () => {
  const { state } = useLocation();
  const recruitmentId = state?.recruitmentId;
  const projectTitle = state?.projectTitle ?? '프로젝트';
  const maxMember = state?.maxMember ?? 0;

  const [activeTab, setActiveTab] = useState('PENDING');
  const [applicantMap, setApplicantMap] = useState({ PENDING: [], ACCEPTED: [], REJECTED: [] });
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!recruitmentId) return;
    setLoading(true);

    Promise.allSettled([
      getPendingApplications(recruitmentId),
      getAcceptedApplications(recruitmentId),
      getRejectedApplications(recruitmentId),
    ]).then(([pendingRes, acceptedRes, rejectedRes]) => {
      const extract = (res) =>
        res.status === 'fulfilled' ? (res.value.data?.data?.applicants ?? []) : [];

      setApplicantMap({
        PENDING: extract(pendingRes),
        ACCEPTED: extract(acceptedRes),
        REJECTED: extract(rejectedRes),
      });
    }).finally(() => setLoading(false));
  }, [recruitmentId]);

  const handleViewDetail = (person) => {
    getApplicationDetail(recruitmentId, person.applicationId)
      .then((res) => setSelectedApplicant(res.data?.data ?? res.data))
      .catch((err) => console.error('지원서 조회 실패', err));
  };

  const handleStatusChange = (applicationId, status) => {
    updateApplicationStatus(recruitmentId, applicationId, status)
      .then((res) => {
        const resData = res.data?.data;

        setApplicantMap((prev) => {
          let person = null;
          let fromTab = null;

          Object.keys(prev).forEach((tab) => {
            const found = prev[tab].find((p) => p.applicationId === applicationId);
            if (found) { person = found; fromTab = tab; }
          });

          if (!person || !fromTab) return prev;

          const updated = { ...prev };
          updated[fromTab] = updated[fromTab].filter((p) => p.applicationId !== applicationId);
          updated[status] = [...updated[status], { ...person, status }];
          return updated;
        });

        // 현재 합격자 == 최대 인원 → 프로젝트 자동 시작
        if (resData?.currentParticipants === resData?.maxParticipants) {
          alert('모집 인원이 다 찼습니다! 프로젝트가 자동으로 시작됩니다.');
        }

      })
      .catch((err) => console.error('상태 변경 실패', err))
      .finally(() => setSelectedApplicant(null));
  };

  const isCapacityFull = maxMember > 0 && applicantMap.ACCEPTED.length >= maxMember;

  const handleCompleteRecruitment = () => {
    completeRecruitment(recruitmentId)
      .then(() => setIsCompleted(true))
      .catch((err) => console.error('모집 완료 처리 실패', err));
  };

  const filtered = applicantMap[activeTab] ?? [];
  const closePanel = () => setSelectedApplicant(null);

  return (
    <div className="ad-page">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h1 className="ad-title">지원자 검토 - {projectTitle}</h1>
        <button
          disabled={isCompleted || !isCapacityFull}
          onClick={handleCompleteRecruitment}
          style={{
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 600,
            fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
            color: '#FFFFFF',
            background: (!isCompleted && isCapacityFull) ? '#FE9A57' : '#D9D9D9',
            border: 'none',
            borderRadius: '4px',
            cursor: (!isCompleted && isCapacityFull) ? 'pointer' : 'default',
          }}
        >
          모집 완료
        </button>
      </div>

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

          {loading && <p style={{ padding: '20px' }}>불러오는 중...</p>}

          {!loading && filtered.map((person) => (
            <div key={person.applicationId} className="ad-row">
              <div className="ad-name-cell">
                <div className="al-logo-box">
                  <img src={logoIcon} alt="avatar" />
                </div>
                <span className="ad-name-text">{person.name}</span>
              </div>
              <div className="ad-cell ad-task-stat">
                <span className="ad-task-num">{person.completedTasks ?? '-'}</span>
                <span className="ad-task-sep">/</span>
                <span className="ad-task-total">{person.totalTasks ?? '-'}</span>
              </div>
              <span className="ad-cell ad-cell--date">
                {person.appliedAt?.slice(0, 10).replace(/-/g, ' - ')}
              </span>
              <button
                className="ad-view-btn"
                onClick={() => handleViewDetail(person)}
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
                  <Avatar
                    src={selectedApplicant.applicant?.profileImageUrl}
                    size="lg"
                    className="app-avatar-lg"
                  />
                  <div className="app-profile-text">
                    <div className="app-name-row">
                      <span className="app-name">{selectedApplicant.applicant?.name}</span>
                      <div className="app-task-stat">
                        <span className="app-task-num">{selectedApplicant.applicant?.completedTasks ?? '-'}</span>
                        <span className="app-task-denom">/{selectedApplicant.applicant?.totalTasks ?? '-'}</span>
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
                    {selectedApplicant.pastProjects?.map((proj, i) => (
                      <div key={i} className="app-project-item">
                        <div className="app-project-header">
                          <div className="app-proj-left">
                            <span className="app-proj-name">{proj.title}</span>
                            <span className="app-proj-role">
                              {proj.type === 'PROMATE' ? 'ProMate' : '직접 입력'}
                            </span>
                          </div>
                          <div className="app-proj-right">
                            {proj.status && (
                              <span className={proj.status === 'ACTIVE' || proj.status === '진행중' ? 'app-status-badge--active' : 'app-status-badge--done'}>
                                {proj.status === 'ACTIVE' ? '진행중' : proj.status === 'COMPLETED' ? '완료' : proj.status}
                              </span>
                            )}
                            {proj.score != null ? (
                              <div className="app-score">
                                <span className="app-score-num">{typeof proj.score === 'number' ? proj.score.toFixed(1) : proj.score}</span>
                                <span className="app-score-label">점</span>
                              </div>
                            ) : (
                              <div style={{ width: 47 }} />
                            )}
                          </div>
                        </div>
                        {/* PROMATE: 완료한 태스크 목록 */}
                        {proj.taskNames && proj.taskNames.length > 0 && (
                          <div className="app-task-names">
                            {proj.taskNames.map((task, j) => (
                              <span key={j} className="app-task-name-item">- {task}</span>
                            ))}
                          </div>
                        )}
                        {/* MANUAL: 직접 입력한 설명 */}
                        {proj.selfTaskDescription && (
                          <div className="app-task-names">
                            <span className="app-task-name-item">{proj.selfTaskDescription}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 수락/거절 버튼 */}
              <div className="app-panel-actions">
                {selectedApplicant.status === 'PENDING' && (
                  <>
                    <button
                      className="app-btn-reject"
                      onClick={() => handleStatusChange(selectedApplicant.applicationId, 'REJECTED')}
                    >
                      거절
                    </button>
                    <button
                      className="app-btn-accept"
                      onClick={() => handleStatusChange(selectedApplicant.applicationId, 'ACCEPTED')}
                    >
                      수락
                    </button>
                  </>
                )}
                {selectedApplicant.status === 'ACCEPTED' && (
                  <button
                    className="app-btn-reject"
                    style={{ width: '100%' }}
                    onClick={() => handleStatusChange(selectedApplicant.applicationId, 'REJECTED')}
                  >
                    팀에서 제외
                  </button>
                )}
                {selectedApplicant.status === 'REJECTED' && (
                  <button
                    className="app-btn-accept"
                    style={{ width: '100%' }}
                    onClick={() => handleStatusChange(selectedApplicant.applicationId, 'ACCEPTED')}
                  >
                    수락
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ApplicantDetail;
