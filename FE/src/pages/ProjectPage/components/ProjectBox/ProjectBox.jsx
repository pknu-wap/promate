import React from 'react';
import ProjectAvatar from '../../../../components/ProjectAvatar/ProjectAvatar';
import ProgressBar from '../../../../components/ProgressBar/ProgressBar';
import './ProjectBox.css';

function ProjectBox({ title, dueDate, status, currentStep, totalStep, avatarSrc }) {
  const calculatedProgress = totalStep > 0 ? Math.round((currentStep / totalStep) * 100) : 0;

  return (
    <div className="project-box">
      <div className="project-box-upper">
        <ProjectAvatar src={avatarSrc} size="54px" />
        <div className="project-box-content">
          <div className="project-box-top">
            <div className="project-box-info">
              <div className="project-box-text">
                <h4 className="project-box-title">{title}</h4>
                <span className="project-due-date">마감일: {dueDate}</span>
              </div>
            </div>
            <div className="project-box-status">
              <span className="status-badge">{status}</span>
            </div>
          </div>
          <div className="progress-stats">
            <span className="progress-step">{currentStep}/{totalStep}</span>
            <span className="progress-percent">{calculatedProgress}%</span>
          </div>
        </div>
      </div>
      
      <div className="progress-header">
        <span className="progress-label">진행률</span>
        <ProgressBar percent={calculatedProgress} />
      </div>
    </div>
  );
}

export default ProjectBox;