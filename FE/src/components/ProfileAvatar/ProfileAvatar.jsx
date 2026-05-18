import React, { useRef } from "react";
import "./ProfileAvatar.css";
import profileIcon from "../../assets/icons/profileIcon.svg";
import imageIcon from "../../assets/icons/imageIcon.svg";

function ProfileAvatar({ src, alt = "프로필 이미지", className = "", onClick, style, onImageChange }) {
  const fileInputRef = useRef(null);
  const displaySrc = src || profileIcon;
  const imageClass = src ? "user-image" : "default-icon";

  const isEditable = !!onImageChange;
  const isClickable = isEditable || !!onClick;

  const handleClick = (e) => {
    if (isEditable) {
      fileInputRef.current?.click();
    } else if (onClick) {
      onClick(e);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file || !onImageChange) return;

    const fileReader = new FileReader();
    fileReader.onload = ({ target }) => {
      onImageChange(target?.result ?? null);
    };
    fileReader.readAsDataURL(file);
    event.target.value = "";
  };

  return (
    <div 
      className={`profile-avatar ${isClickable ? "clickable" : ""} ${isEditable ? "editable" : ""} ${className}`.trim()}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (isClickable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleClick(e);
        }
      }}
      style={style}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={isEditable ? "프로필 이미지 변경" : alt}
    >
      <img src={displaySrc} alt={alt} className={imageClass} />
      {isEditable && (
        <div className="profile-edit-badge">
          <img src={imageIcon} alt="이미지 변경 아이콘" className="edit-icon" />
        </div>
      )}
      {isEditable && (
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      )}
    </div>
  );
}

export default ProfileAvatar;