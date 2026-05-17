import React from "react";
import "./ProfileAvatar.css";
import profileIcon from "../../assets/icons/profileIcon.svg";

function ProfileAvatar({ src, alt = "프로필 이미지", className = "", onClick, style }) {
  const displaySrc = src || profileIcon;

  return (
    <div 
      className={`profile-avatar ${onClick ? "clickable" : ""} ${className}`.trim()}
      onClick={onClick}
      style={style}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <img src={displaySrc} alt={alt} />
    </div>
  );
}

export default ProfileAvatar;