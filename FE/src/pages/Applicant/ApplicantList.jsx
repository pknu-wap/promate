import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicantBox from '../../components/ApplicantBox/ApplicantBox';
import { getMyRecruitments } from '../../api/RecruitApi';
import './Applicant.css';

const CATEGORY_LABEL = {
  PROJECT: '과제/팀플',
  STUDY: '스터디',
  CONTEST: '공모전',
  DEV: '개발',
  ETC: '기타',
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
        {recruitments.map((recruitment) => {
          const isClosed = recruitment.status === 'COMPLETED' || recruitment.status === 'CANCELLED';
          return (
            <ApplicantBox
              key={recruitment.postId}
              title={recruitment.title}
              summary={CATEGORY_LABEL[recruitment.category] ?? recruitment.category}
              capacity={recruitment.maxMember}
              showBookmark={false}
              buttonText={isClosed ? '모집 마감' : '지원자 검토'}
              buttonColor={isClosed ? '#D9D9D9' : '#FE9A57'}
              disabled={isClosed}
              onButtonClick={
                isClosed
                  ? undefined
                  : () =>
                      navigate('/applicant/detail', {
                        state: {
                          recruitmentId: recruitment.postId,
                          projectTitle: recruitment.title,
                        },
                      })
              }
            />
          );
        })}
      </section>
    </main>
  );
};

export default ApplicantList;
