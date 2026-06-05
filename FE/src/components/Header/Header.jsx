import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserInfo } from '../../api/User/userProfileApi.js';
import logoImg from '../../assets/logoOrange.svg';
import profileIcon from '../../assets/icons/profileIcon.svg';
import profileIconHover from '../../assets/icons/profileOrangeIcon.svg';
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar';
import './Header.css';

function Header({ onMenuClick }) {
  const [userData, setUserData] = useState({ userName: "...", profileImageUrl: null });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        const response = await getUserInfo();
        
        if (response?.isSuccess) {
          const userData = response.data;
          
          setUserData({
            userName: userData?.name || userData?.nickname || userData?.userName || "사용자",
            profileImageUrl: userData?.profileImageUrl || null
          });
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("유저 정보 로드 실패", error);
        setIsLoggedIn(false);
      }
    };
    fetchUserData();

    window.addEventListener('userProfileUpdated', fetchUserData);
    return () => {
      window.removeEventListener('userProfileUpdated', fetchUserData);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <button className="hamburger-btn" onClick={onMenuClick} aria-label="메뉴 열기">
          <span></span><span></span><span></span>
        </button>
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <img src={logoImg} alt="ProMate 로고" className="logo-image" />
            <span className="logo-text">PRO:MATE</span>
          </Link>
          <span className="logo-sub">최고의 팀을 꾸려, 협업하세요.</span>
        </div>
      </div>

      <div className="header-right">
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="header-greeting">
              <strong>{userData.userName}</strong> 님 안녕하세요 :)
            </Link>
            <Link to="/profile">
              <ProfileAvatar src={userData.profileImageUrl} size="36px" />
            </Link>
          </>
        ) : (
          <Link to="/login" className="header-login-btn">
            <img src={profileIcon} alt="" className="header-login-icon default-icon" />
            <img src={profileIconHover} alt="" className="header-login-icon hover-icon" />
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;