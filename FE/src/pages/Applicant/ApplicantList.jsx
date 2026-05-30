import React from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicantBox from '../../components/ApplicantBox/ApplicantBox';
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
          <ApplicantBox
            key={project.id}
            title={project.title}
            summary={project.summary}
            capacity={project.capacity}
            buttonText="지원자 검토"
            showBookmark={false}
            onButtonClick={() => navigate('/applicant/detail')}
          />
        ))}
      </section>
    </main>
  );
};

export default ApplicantList;
