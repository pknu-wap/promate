import React from 'react';
import './StatusItem.css';
import Avatar from '../../../components/Avatar/Avatar';
import ProgressBar from '../../../components/ProgressBar/ProgressBar';

function StatusItem({ title, date = '', tag = '여유', ratio }) {
  let progressValue = 0;
  
  if (ratio && ratio.includes('/')) {
    const [current, total] = ratio.split('/').map(Number);
    if (total > 0 && !isNaN(current)) {
      progressValue = Math.round((current / total) * 100);
    }
  }

  // 마감일과 현재 날짜 차이 계산 (일 단위)
  let diffDays = Infinity; // 기본값을 무한대로 설정
  
  if (date) {
    const today = new Date();
    const targetDate = new Date(date.replace(/\./g, '-'));
    diffDays = (targetDate - today) / (1000 * 60 * 60 * 24);
  }

  return (
    <div className="status-item">
      <div className="status-info-row">
        <div className="status-left">
          <div className="logo-placeholder">
            <Avatar />
          </div>

          <div className="status-text">
            <h4>{title}</h4>
            <p>마감일: {date}</p>
          </div>
        </div>

        <div className={`status-tag ${diffDays < 7 ? 'urgent' : ''}`}>
          {diffDays < 7 ? '긴급' : tag}
        </div>
      </div>

      <div className="status-progress-row">
        <span className="progress-label">진행률</span>
        <span className="progress-ratio">{ratio}</span>
        <span className="progress-percent">{progressValue}%</span>
      </div>

      <ProgressBar percent={progressValue} />
    </div>
  );
}

export default StatusItem;