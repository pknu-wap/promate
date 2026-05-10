import React from 'react';
import ProjectAvatar from '../../../../components/ProjectAvatar/ProjectAvatar';
import ProgressBar from '../../../../components/ProgressBar/ProgressBar';
import { getDiffDays } from '../../../DashboardPage/components/DateUtils';
import './ProjectBox.css';

function ProjectBox({ title, dueDate, currentStep, totalStep, avatarSrc }) {
  const calculatedProgress = totalStep > 0 ? Math.round((currentStep / totalStep) * 100) : 0;
  const diffDays = getDiffDays(dueDate);

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
              <div className={`status-tag ${diffDays < 7 ? 'urgent' : ''}`}>
                {diffDays < 7 ? '긴급' : '여유'}
              </div>
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