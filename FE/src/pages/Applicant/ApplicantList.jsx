import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../components/Avatar/Avatar';
import './Applicant.css';

const ApplicantList = () => {
  const navigate = useNavigate();

  const projects = [
    { id: 1, title: '캡스톤 디자인', description: '안녕하세요. WAP 파이팅', members: 4 },
    { id: 2, title: '캡스톤 디자인', description: '안녕하세요. WAP 파이팅', members: 4 },
    { id: 3, title: '캡스톤 디자인', description: '안녕하세요. WAP 파이팅', members: 4 },
    { id: 4, title: '캡스톤 디자인', description: '안녕하세요. WAP 파이팅', members: 4 },
    { id: 5, title: '캡스톤 디자인', description: '안녕하세요. WAP 파이팅', members: 4 },
  ];

  const handleReviewClick = (id) => {
    navigate(`/applicant/detail`);
    // 나중에 서버 연결하면 navigate(`/applicant/detail/${id}`) 로 바꿀 거예요!
  };

  return (
    <div className="applicant-list-container">
      <h2>지원자 검토</h2>
      <div className="project-cards">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="card-left">
              <Avatar size="md" />
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
            </div>
            <div className="card-right">
              <span className="member-count">모집인원: {project.members}명</span>
              <button className="review-btn" onClick={() => handleReviewClick(project.id)}>
                지원자 검토
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicantList;