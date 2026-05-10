import React, { useState } from 'react';
import ProjectBox from './components/ProjectBox/ProjectBox';
import './ProjectPage.css';

function ProjectPage() {
  const [activeTab, setActiveTab] = useState('전체');

  const tabs = ['전체', '진행중인 프로젝트', '내 지원 현황', '북마크', '완료된 프로젝트'];

  // 임시 데이터
  const dummyProjects = [
    { id: 1, title: 'WAP 프로젝트', dueDate: '2026.06.05', currentStep: 125, totalStep: 150 },
    { id: 2, title: '프로그래밍 팀플', dueDate: '2026.06.17', currentStep: 12, totalStep: 18 },
    { id: 3, title: '캡스톤 디자인', dueDate: '2026.06.24', currentStep: 71, totalStep: 100 }
  ];

  return (
    <div className="project-container">
      <div className="project-content">
        <h1 className="project-page-title">프로젝트</h1>
        
        <div className="tabs-container">
          {tabs.map((tab) => (
            <div 
              key={tab} 
              className={`tab-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className="project-list">
          {dummyProjects.map((project) => (
            <ProjectBox 
              key={project.id}
              title={project.title}
              dueDate={project.dueDate}
              currentStep={project.currentStep}
              totalStep={project.totalStep}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;