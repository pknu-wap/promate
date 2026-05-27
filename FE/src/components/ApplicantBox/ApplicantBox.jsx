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
  onBookmarkClick
}) {
  return (
    <div className="applicant-box">
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
              onClick={onBookmarkClick}
              aria-label={isBookmarked ? "즐겨찾기 해제" : "즐겨찾기 추가"}
            >
              <img src={isBookmarked ? bookmarkOrange : bookmarkGray} alt="bookmark icon" />
            </button>
          )}
          <button
            type="button"
            className="applicant-action-btn"
            style={{ backgroundColor: buttonColor, color: buttonTextColor }}
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApplicantBox;