import React from 'react';
import logoImg from '../../assets/logoGray.svg';
import './ProjectAvatar.css';

function ProjectAvatar() {
  return (
    <div className="avatar-container">
      <img src={logoImg} alt="아바타 로고" className="avatar-logo" />
    </div>
  );
}

export default ProjectAvatar;