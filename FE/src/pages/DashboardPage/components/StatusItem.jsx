import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StatusItem.css';
import Avatar from '../../../components/Avatar/Avatar';
import ProgressBar from '../../../components/ProgressBar/ProgressBar';
import { getDiffDays } from '../components/DateUtils';

function StatusItem({ id, title, date = '', tag = '여유', ratio }) {
  const navigate = useNavigate();
  let progressValue = 0;
  
  if (ratio && ratio.includes('/')) {
    const [current, total] = ratio.split('/').map(Number);
    if (total > 0 && !isNaN(current)) {
      progressValue = Math.round((current / total) * 100);
    }
  }

  const diffDays = getDiffDays(date);

  return (
    <div 
      className="status-item"
      onClick={() => navigate(`/project/${id}`)}
    >
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