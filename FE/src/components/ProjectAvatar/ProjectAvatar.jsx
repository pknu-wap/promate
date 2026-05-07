import React, { useRef } from 'react';
import logoImg from '../../assets/logoGray.svg';
import './ProjectAvatar.css';

function ProjectAvatar({ src, onImageChange }) {
  const fileInputRef = useRef(null);

  const isEditable = !!onImageChange;

  const handleContainerClick = () => {
    if (isEditable) {
      fileInputRef.current?.click();
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
  };

  return (
    <div
      className={`avatar-container ${isEditable ? 'editable' : ''}`}
      onClick={handleContainerClick}
      onKeyDown={(e) => {
        if (isEditable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleContainerClick();
        }
      }}
      role={isEditable ? 'button' : undefined}
      tabIndex={isEditable ? 0 : -1}
      aria-label={isEditable ? '프로젝트 이미지 변경' : '프로젝트 로고'}
    >
      <img src={src || logoImg} alt={src ? '프로젝트 이미지' : '아바타 로고'} className="avatar-logo" />
      {isEditable && <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />}
    </div>
  );
}

export default ProjectAvatar;