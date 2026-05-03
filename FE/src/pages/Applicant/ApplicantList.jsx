import React from 'react';
import './Applicant.css';

const ApplicantList = () => {
  // 시안에 있는 데이터 예시입니다. 나중에 서버에서 받아오면 됩니다!
  const projects = [
    { id: 1, title: '캡스톤 디자인', description: '안녕하세요. WAP 파이팅', members: 4 },
    { id: 2, title: '캡스톤 디자인', description: '안녕하세요. WAP 파이팅', members: 4 },
    { id: 3, title: '캡스톤 디자인', description: '안녕하세요. WAP 파이팅', members: 4 },
    { id: 4, title: '캡스톤 디자인', description: '안녕하세요. WAP 파이팅', members: 4 },
    { id: 5, title: '캡스톤 디자인', description: '안녕하세요. WAP 파이팅', members: 4 },
  ];

  return (
    <div className="applicant-list-container">
      <h2>지원자 검토</h2>
      <div className="project-cards">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="card-left">
              <div className="project-icon">D</div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
            </div>
            <div className="card-right">
              <span className="member-count">모집인원: {project.members}명</span>
              <button className="review-btn">지원자 검토</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicantList;