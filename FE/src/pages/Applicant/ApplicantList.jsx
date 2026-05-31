import React from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicantBox from '../../components/ApplicantBox/ApplicantBox';
import './Applicant.css';

const projects = [
  { recruitmentId: 1, title: '캡스톤 디자인', summary: '안녕하세요. WAP 화이팅', capacity: 4 },
  { recruitmentId: 2, title: '캡스톤 디자인', summary: '안녕하세요. WAP 화이팅', capacity: 4 },
  { recruitmentId: 3, title: '캡스톤 디자인', summary: '안녕하세요. WAP 화이팅', capacity: 4 },
  { recruitmentId: 4, title: '캡스톤 디자인', summary: '안녕하세요. WAP 화이팅', capacity: 4 },
  { recruitmentId: 5, title: '캡스톤 디자인', summary: '안녕하세요. WAP 화이팅', capacity: 4 },
];

const ApplicantList = () => {
  const navigate = useNavigate();

  return (
    <main className="al-page">
      <h1 className="al-title">지원자 검토</h1>

      <section className="al-list">
        {projects.map((project) => (
          <ApplicantBox
            key={project.recruitmentId}
            title={project.title}
            summary={project.summary}
            capacity={project.capacity}
            buttonText="지원자 검토"
            showBookmark={false}
            onButtonClick={() =>
              navigate('/applicant/detail', {
                state: {
                  recruitmentId: project.recruitmentId,
                  projectTitle: project.title,
                },
              })
            }
          />
        ))}
      </section>
    </main>
  );
};

export default ApplicantList;
