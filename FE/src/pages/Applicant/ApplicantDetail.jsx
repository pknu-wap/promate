import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Avatar from '../../components/Avatar/Avatar';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
<<<<<<< HEAD
import logoIcon from '../../assets/logoIcon.svg';
import { getApplicationList, getApplicationDetail, updateApplicationStatus } from '../../api/RecruitApi';
=======
>>>>>>> 19327204d060a659d32a68bbcbf6a228058b3427
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

  const [activeTab, setActiveTab] = useState('PENDING');
  const [applicantList, setApplicantList] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!recruitmentId) return;
    setLoading(true);
    getApplicationList(recruitmentId)
      .then((res) => {
        console.log('지원자 목록 응답:', res.data);
        const list = Array.isArray(res.data) ? res.data : res.data.data ?? res.data.content ?? [];
        setApplicantList(list);
      })
      .catch((err) => console.error('지원자 목록 조회 실패', err))
      .finally(() => setLoading(false));
  }, [recruitmentId]);

  const handleViewDetail = (person) => {
    getApplicationDetail(recruitmentId, person.applicationId)
      .then((res) => setSelectedApplicant(res.data))
      .catch((err) => console.error('지원서 조회 실패', err));
  };

  const handleStatusChange = (applicationId, status) => {
    updateApplicationStatus(recruitmentId, applicationId, status)
      .then(() => {
        setApplicantList((prev) =>
          prev.map((p) =>
            p.applicationId === applicationId ? { ...p, status } : p
          )
        );
        setSelectedApplicant(null);
      })
      .catch((err) => console.error('상태 변경 실패', err));
  };

  const filtered = applicantList.filter((p) => p.status === activeTab);

  const closePanel = () => setSelectedApplicant(null);

  return (
    <div className="ad-page">
      <h1 className="ad-title">지원자 검토 - {projectTitle}</h1>

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
                <div className="ad-avatar" />
                <span className="ad-name-text">{person.name}</span>
              </div>
              <div className="ad-cell ad-task-stat">
                <span className="ad-task-num">{person.taskStats?.completed ?? '-'}</span>
                <span className="ad-task-sep">/</span>
                <span className="ad-task-total">{person.taskStats?.total ?? '-'}</span>
              </div>
              <span className="ad-cell ad-cell--date">
                {person.appliedAt?.replace(/-/g, ' - ')}
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
                <div className="app-profile-header">
                  <Avatar size="lg" className="app-avatar-lg" />
                  <div className="app-profile-text">
                    <div className="app-name-row">
                      <span className="app-name">{selectedApplicant.name}</span>
                      <div className="app-task-stat">
                        <span className="app-task-num">{selectedApplicant.taskStats?.completed ?? '-'}</span>
                        <span className="app-task-denom">/{selectedApplicant.taskStats?.total ?? '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="app-projects-section">
                  <span className="app-projects-title">프로젝트 경험</span>
                  <div className="app-projects-list">
                    {selectedApplicant.projects?.map((proj, i) => (
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
                <button
                  className="app-btn-accept"
                  onClick={() => handleStatusChange(selectedApplicant.applicationId, 'ACCEPTED')}
                >
                  수락
                </button>
                <button
                  className="app-btn-reject"
                  onClick={() => handleStatusChange(selectedApplicant.applicationId, 'REJECTED')}
                >
                  거절
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ApplicantDetail;
