import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoIcon from '../../assets/logoIcon.svg';
import './Applicant.css';

const projects = [
  { id: 1, title: '캡스톤 디자인', summary: '안녕하세요. WAP 화이팅', capacity: 4 },
  { id: 2, title: '캡스톤 디자인', summary: '안녕하세요. WAP 화이팅', capacity: 4 },
  { id: 3, title: '캡스톤 디자인', summary: '안녕하세요. WAP 화이팅', capacity: 4 },
  { id: 4, title: '캡스톤 디자인', summary: '안녕하세요. WAP 화이팅', capacity: 4 },
  { id: 5, title: '캡스톤 디자인', summary: '안녕하세요. WAP 화이팅', capacity: 4 },
];

const ApplicantList = () => {
  const navigate = useNavigate();

  return (
    <main className="al-page">
      <h1 className="al-title">지원자 검토</h1>

      <section className="al-list">
        {projects.map((project) => (
          <article className="al-card" key={project.id}>
            <div className="al-logo-box">
              <img src={logoIcon} alt={`${project.title} 로고`} />
            </div>

            <div className="al-content">
              <h2 className="al-project-title">{project.title}</h2>
              <p className="al-project-summary">{project.summary}</p>
            </div>

            <div className="al-actions">
              <span className="al-capacity">모집인원: {project.capacity}명</span>
              <button
                className="al-review-btn"
                onClick={() => navigate('/applicant/detail')}
              >
                지원자 검토
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default ApplicantList;
