import React, { useState } from 'react';
import Avatar from '../../components/Avatar/Avatar';
import './Applicant.css';

const ApplicantDetail = () => {
  const [activeTab, setActiveTab] = useState('applicant');

  const applicantList = [
    { id: 1, name: '김은비', position: 'UIUX', temperature: 94, date: '2026-05-02' },
    { id: 2, name: '김은비', position: 'UIUX', temperature: 94, date: '2026-05-02' },
    { id: 3, name: '김은비', position: 'UIUX', temperature: 94, date: '2026-05-02' },
  ];

  const tabs = [
    { key: 'applicant', label: '현재 지원자' },
    { key: 'member',    label: '현재 팀원' },
    { key: 'rejected',  label: '거절한 지원자' },
  ];

  return (
    <div className="detail-container">
      <h2 className="detail-title">지원자 검토 - 캡스톤 디자인</h2>

      {/* 탭 메뉴 */}
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

      {/* 지원자 테이블 */}
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
              <tr key={person.id}>
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
                  <button className="profile-view-btn">프로필 보기</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicantDetail;