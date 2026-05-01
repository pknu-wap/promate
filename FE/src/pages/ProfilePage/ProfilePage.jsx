import React, { useState } from 'react';
import MainButton from '../../components/MainButton/MainButton';
import AwardSection from './components/AwardSection';
import './ProfilePage.css';
import '../Teammaking/TeammakingPage.css'; // 기존 카드 스타일 재사용

const ProfilePage = () => {
  const [userInfo] = useState({
    name: "김아무개",
    role: "UIUX",
    temp: 75,
    phone: "010.0000.0000",
    email: "WAP1234@WAP.com"
  });

  return (
    <div className="page-wrapper">
      <h1 className="page-title">{userInfo.name} 님 프로필</h1>
      
      <section className="card profile-main-card">
        <div className="profile-header-row">
          <div className="profile-user-info">
            {/* ImageUploadField의 서클 스타일 참고 */}
            <div className="image-upload-circle profile-img">
              <img src="/default-profile.png" alt="프로필" className="image-preview" />
            </div>
            <div>
              <h2 className="user-name-text">{userInfo.name}</h2>
              <p className="user-role-text">{userInfo.role}</p>
            </div>
          </div>
          <div className="user-temp-display">{userInfo.temp}°C</div>
        </div>

        <div className="form-field">
          <label className="form-label">연락처</label>
          <div className="contact-details">
            <p>📞 {userInfo.phone}</p>
            <p>✉️ {userInfo.email}</p>
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">프로젝트 경험</label>
          {/* 기존 textarea 스타일을 빈 박스로 표현 */}
          <div className="textarea-input experience-box"></div>
        </div>

        <div className="profile-actions">
          <MainButton size="md">수정하기</MainButton>
        </div>
      </section>

      <AwardSection />
    </div>
  );
};

export default ProfilePage;