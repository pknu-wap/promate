import React, { useState } from 'react';
import Avatar from '../../components/Avatar/Avatar';
import Badge from '../../components/Badge/Badge';
import MainButton from '../../components/MainButton/MainButton';
import './Applicant.css';

const ApplicantDetail = () => {
  const [activeTab, setActiveTab] = useState('applicant');
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const applicantList = [
    {
      id: 1,
      name: '김은비',
      position: 'UIUX',
      temperature: 94,
      date: '2026-05-02',
      role: 'UIUX 디자이너',
      phone: '010.0000.0000',
      email: 'WAP1234@WAP.com',
      motivation: '디자인에 대한 열정으로 팀 프로젝트에 적극 기여하고 싶습니다. 다양한 프로젝트 경험을 바탕으로 UI/UX 품질을 높이겠습니다.',
      projects: [
        { name: '동아리 프로젝트', role: 'PM', status: '진행중', score: 4.6 },
        { name: 'WAP 해커톤', role: 'FE', status: '경험', score: 4.7 },
      ],
    },
    {
      id: 2,
      name: '김은비',
      position: 'UIUX',
      temperature: 94,
      date: '2026-05-02',
      role: 'UIUX 디자이너',
      phone: '010.0000.0000',
      email: 'WAP1234@WAP.com',
      motivation: '디자인에 대한 열정으로 팀 프로젝트에 적극 기여하고 싶습니다. 다양한 프로젝트 경험을 바탕으로 UI/UX 품질을 높이겠습니다.',
      projects: [
        { name: '동아리 프로젝트', role: 'PM', status: '진행중', score: 4.6 },
        { name: 'WAP 해커톤', role: 'FE', status: '경험', score: 4.7 },
      ],
    },
    {
      id: 3,
      name: '김은비',
      position: 'UIUX',
      temperature: 94,
      date: '2026-05-02',
      role: 'UIUX 디자이너',
      phone: '010.0000.0000',
      email: 'WAP1234@WAP.com',
      motivation: '디자인에 대한 열정으로 팀 프로젝트에 적극 기여하고 싶습니다. 다양한 프로젝트 경험을 바탕으로 UI/UX 품질을 높이겠습니다.',
      projects: [
        { name: '동아리 프로젝트', role: 'PM', status: '진행중', score: 4.6 },
        { name: 'WAP 해커톤', role: 'FE', status: '경험', score: 4.7 },
      ],
    },
  ];

  const tabs = [
    { key: 'applicant', label: '현재 지원자' },
    { key: 'member',    label: '현재 팀원' },
    { key: 'rejected',  label: '거절한 지원자' },
  ];

  return (
    <div className="detail-container">
      <h2 className="detail-title">지원자 검토 - 캡스톤 디자인</h2>

      <div className="detail-body">
        {/* 좌측: 탭 + 테이블 */}
        <div className="table-section">
          <div className="tab-menu">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={activeTab === tab.key ? 'tab-btn active' : 'tab-btn'}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="table-wrapper">
            <table className="applicant-table">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>포지션</th>
                  <th>온도</th>
                  <th>지원 날짜</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {applicantList.map((person) => (
                  <tr
                    key={person.id}
                    className={selectedApplicant?.id === person.id ? 'selected-row' : ''}
                  >
                    <td>
                      <div className="user-cell">
                        <Avatar size="sm" />
                        {person.name}
                      </div>
                    </td>
                    <td>{person.position}</td>
                    <td className="temp-text">{person.temperature}℃</td>
                    <td>{person.date.replace(/-/g, ' - ')}</td>
                    <td>
                      <button
                        className="profile-view-btn"
                        onClick={() => setSelectedApplicant(person)}
                      >
                        프로필 보기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 우측: 프로필 패널 */}
        {selectedApplicant && (
          <div className="profile-panel">
            <div className="profile-header">
              <Avatar size="lg" />
              <div className="profile-name-row">
                <span className="profile-name">{selectedApplicant.name}</span>
                <span className="profile-temp">{selectedApplicant.temperature}℃</span>
              </div>
              <p className="profile-role">{selectedApplicant.role}</p>
            </div>

            <div className="profile-divider" />

            <div className="profile-section">
              <h4 className="profile-section-title">연락처</h4>
              <p className="profile-contact-item">
                <span className="contact-icon">☎</span>
                {selectedApplicant.phone}
              </p>
              <p className="profile-contact-item">
                <span className="contact-icon">✉</span>
                {selectedApplicant.email}
              </p>
            </div>

            <div className="profile-divider" />

            <div className="profile-section">
              <h4 className="profile-section-title">지원동기</h4>
              <p className="profile-motivation">{selectedApplicant.motivation}</p>
            </div>

            <div className="profile-divider" />

            <div className="profile-section">
              <h4 className="profile-section-title">프로젝트 경험</h4>
              {selectedApplicant.projects.map((proj, i) => (
                <div key={i} className="proj-row">
                  <span className="proj-name">{proj.name}</span>
                  <span className="proj-role-tag">{proj.role}</span>
                  <Badge selected={proj.status === '진행중'}>{proj.status}</Badge>
                  <span className="proj-score">{proj.score} 점</span>
                </div>
              ))}
            </div>

            <div className="profile-actions">
              <MainButton>수락</MainButton>
              <button className="reject-btn" onClick={() => setSelectedApplicant(null)}>
                거절
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantDetail;
