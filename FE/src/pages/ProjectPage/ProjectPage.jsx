import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectBox from './components/ProjectBox/ProjectBox';
import './ProjectPage.css';

const mockProjects = [
  { id: 1, title: '프로그래밍 팀플', dueDate: '2026.05.17', currentStep: 12, totalStep: 18, bookmarked: true, applied: true, status: 'active' },
  { id: 2, title: 'WAP 프로젝트', dueDate: '2026.06.05', currentStep: 125, totalStep: 150, bookmarked: true, applied: true, status: 'active' },
  { id: 3, title: '캡스톤 디자인', dueDate: '2026.07.07', currentStep: 51, totalStep: 100, bookmarked: false, applied: true, status: 'active' },
  { id: 4, title: '알고리즘 스터디', dueDate: '2023.05.10', currentStep: 93, totalStep: 100, bookmarked: false, applied: true, status: 'completed' },
  { id: 5, title: '인공지능 개발', dueDate: '2026.12.05', currentStep: 0, totalStep: 0, bookmarked: true, applied: false, status: 'active' }
];

const tabs = [
  { key: 'bookmarked', label: '북마크' },
  { key: 'applied', label: '내 지원 현황' },
  { key: 'active', label: '진행중인 프로젝트' },
  { key: 'completed', label: '완료된 프로젝트' }
];

function ProjectPage() {
  const [activeTab, setActiveTab] = useState('bookmarked');
  const navigate = useNavigate();

  const filteredProjects = useMemo(() => {
    return mockProjects.filter((project) => {
      switch (activeTab) {
        case 'active':
          return project.applied && project.status === 'active';
        case 'applied':
          return project.applied;
        case 'bookmarked':
          return project.bookmarked;
        case 'completed':
          return project.applied && project.status === 'completed';
        default:
          return true;
      }
    });
  }, [activeTab]);

  return (
    <div className="project-container">
      <div className="project-content">
        <h1 className="project-page-title">프로젝트</h1>
        
        <div className="tabs-container">
          {tabs.map((tab) => (
            <div 
              key={tab.key} 
              className={`tab-item ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        <div className="project-list">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectBox 
                key={project.id}
                title={project.title}
                dueDate={project.dueDate}
                currentStep={project.currentStep}
                totalStep={project.totalStep}
                onClick={() => navigate(`/project/${project.id}`)}
              />
            ))
          ) : (
            <div className="project-empty">해당하는 프로젝트가 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;