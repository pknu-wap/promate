import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoIcon from '../../assets/logoIcon.svg';
import { getMyRecruitments } from '../../api/RecruitApi';
import './Applicant.css';

const CATEGORY_LABEL = {
  PROJECT: '과제/팀플',
  STUDY: '스터디',
  CONTEST: '공모전',
  DEV: '개발',
  ETC: '기타',
};

const STATUS_LABEL = {
  RECRUITING: '모집 중',
  COMPLETED: '모집 완료',
  CANCELLED: '모집 취소',
};

const ApplicantList = () => {
  const navigate = useNavigate();
  const [recruitments, setRecruitments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMyRecruitments()
      .then((res) => {
        const data = res.data?.data?.content ?? res.data?.data ?? [];
        setRecruitments(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error('모집글 목록 조회 실패', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="al-page">
      <h1 className="al-title">지원자 검토</h1>

      {loading && <p style={{ padding: '20px' }}>불러오는 중...</p>}

      <section className="al-list">
        {recruitments.map((recruitment) => (
          <article className="al-card" key={recruitment.postId}>
            <div className="al-logo-box">
              <img src={logoIcon} alt={`${recruitment.title} 로고`} />
            </div>

            <div className="al-content">
              <h2 className="al-project-title">{recruitment.title}</h2>
              <p className="al-project-summary">{CATEGORY_LABEL[recruitment.category] ?? recruitment.category}</p>
            </div>

            <div className="al-actions">
              <span className="al-status">{STATUS_LABEL[recruitment.status] ?? recruitment.status}</span>
              <span className="al-capacity">{recruitment.currentMember} / {recruitment.maxMember}명</span>
              <button
                className="al-review-btn"
                onClick={() =>
                  navigate('/applicant/detail', {
                    state: {
                      recruitmentId: recruitment.postId,
                      projectTitle: recruitment.title,
                    },
                  })
                }
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
