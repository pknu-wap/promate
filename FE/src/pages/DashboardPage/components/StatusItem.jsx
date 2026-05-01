import React from 'react';
import './StatusItem.css';
import Avatar from '../../../components/Avatar/Avatar';
import ProgressBar from '../../../components/ProgressBar/ProgressBar';

function StatusItem({ title, date, tag, ratio }) {
  let progressValue = 0;
  
  if (ratio && ratio.includes('/')) {
    const [current, total] = ratio.split('/').map(Number);
    if (total > 0 && !isNaN(current)) {
      progressValue = Math.round((current / total) * 100);
    }
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

        <div className="status-tag">{tag}</div>
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