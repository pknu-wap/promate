import React from 'react';
import ProjectAvatar from '../../../../components/ProjectAvatar/ProjectAvatar';
import ProgressBar from '../../../../components/ProgressBar/ProgressBar';
import './ProjectBox.css';

function ProjectBox({ title, dueDate, status, currentStep, totalStep, progress, avatarSrc }) {
  return (
    <div className="project-box">
      <div className="project-box-top">
        <div className="project-box-info">
          <ProjectAvatar src={avatarSrc} size="54px" />
          <div className="project-box-text">
            <h3 className="project-box-title">{title}</h3>
            <span className="project-due-date">마감일: {dueDate}</span>
          </div>
        </div>
        <div className="project-box-status">
          <span className="status-badge">{status}</span>
        </div>
      </div>
      
      <div className="project-box-bottom">
        <div className="progress-header">
          <span className="progress-label">진행률</span>
          <span className="progress-stats">
            <span className="progress-step">{currentStep}/{totalStep}</span>
            <span className="progress-percent">{progress}%</span>
          </span>
        </div>
        <ProgressBar percent={progress} />
      </div>
    </div>
  );
}

export default ProjectBox;