import React from 'react';
import ProjectAvatar from '../ProjectAvatar/ProjectAvatar';
import bookmarkGray from '../../assets/icons/bookmarkGray.svg';
import bookmarkOrange from '../../assets/icons/bookmarkOrange.svg';
import './ApplicantBox.css';

function ApplicantBox({
  title,
  summary,
  capacity,
  avatarSrc,
  buttonText = '지원하기',
  buttonColor = '#FE9A57',
  buttonTextColor = '#FFFFFF',
  onButtonClick,
  showBookmark = true,
  isBookmarked = false,
  onBookmarkClick,
  disabled = false,
  onClick
}) {
  return (
    <div className="applicant-box" onClick={onClick} style={{ cursor: onClick ? 'pointer' : undefined }}>
      <div className="applicant-box-left">
        <ProjectAvatar 
          src={avatarSrc} 
          size="46px"
          className="applicant-box-avatar" 
        />
        <div className="applicant-box-text">
          <h4 className="applicant-box-title">{title}</h4>
          <p className="applicant-box-summary">{summary}</p>
        </div>
      </div>

      <div className="applicant-box-right">
        <span className="applicant-box-capacity">모집인원: {capacity}명</span>
        <div className="applicant-box-actions">
          {showBookmark && (
            <button
              type="button"
              className="applicant-bookmark-btn"
              style={{ backgroundColor: isBookmarked ? '#FFEBDE' : '#EDEDED' }}
              onClick={(e) => {
                if (onClick) e.stopPropagation();
                if (onBookmarkClick) onBookmarkClick(e);
              }}
              aria-label={isBookmarked ? "즐겨찾기 해제" : "즐겨찾기 추가"}
            >
              <img src={isBookmarked ? bookmarkOrange : bookmarkGray} alt="bookmark icon" />
            </button>
          )}
          <button
            type="button"
            className={`applicant-action-btn ${buttonColor === '#FE9A57' && !disabled ? 'hover-active' : ''}`}
            style={{ backgroundColor: buttonColor, color: buttonTextColor, cursor: disabled ? 'default' : 'pointer' }}
            onClick={(e) => {
              if (onClick) e.stopPropagation();
              if (onButtonClick) onButtonClick(e);
            }}
            disabled={disabled}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApplicantBox;