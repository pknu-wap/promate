import React from "react";
import "./ProfileAvatar.css";

function ProfileAvatar({ src, alt = "프로필 이미지" }) {
  return (
    <div className="profile-avatar">
      <img src={src} alt={alt} />
    </div>
  );
}

export default ProfileAvatar;