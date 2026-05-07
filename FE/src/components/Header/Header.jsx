import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserInfo } from '../../api/userProfileApi.js';
import logoImg from '../../assets/logoOrange.svg';
import './Header.css';

function Header({ onMenuClick }) {
  const [userData, setUserData] = useState({ userName: "...", userInitial: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserInfo(); 
        const name = response.data.name;
        
        setUserData({
          userName: name,
          userInitial: name.charAt(0).toUpperCase() 
        });
      } catch (error) {
        console.error("유저 정보 로드 실패", error);
      }
    };
    fetchUserData();
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
          <span className="logo-sub">최고의 팀과 협업하세요.</span>
        </div>
      </div>

      <div className="header-right">
        <span className="header-greeting">
          <strong>{userData.userName}</strong> 님 안녕하세요 :)
        </span>
        <div className="header-avatar">{userData.userInitial}</div>
      </div>
    </header>
  );
}

export default Header;