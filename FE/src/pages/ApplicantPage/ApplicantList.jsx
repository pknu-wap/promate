import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicantBox from '../../components/ApplicantBox/ApplicantBox';
import Pagination from '../../components/Pagination/Pagination';
import { getMyRecruitments } from '../../api/RecruitApi';
import apiClient from '../../api/apiClient';
import './ApplicantPage.css';

const CATEGORY_LABEL = {
  PROJECT: '과제/팀플',
  STUDY: '스터디',
  CONTEST: '공모전',
  DEV: '개발',
  ETC: '기타',
};

const ITEMS_PER_PAGE = 5;

const ApplicantList = () => {
  const navigate = useNavigate();
  const [recruitments, setRecruitments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchRecruitments = () => {
    setLoading(true);
    getMyRecruitments()
      .then((res) => {
        const data = res.data?.data?.content ?? res.data?.data ?? [];
        setRecruitments(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error('모집글 목록 조회 실패', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      navigate(-1);
      return;
    }

    fetchRecruitments();
  }, [navigate]);

  const handleCompleteRecruitment = async (recruitmentId) => {
    if (!window.confirm('모집을 수동으로 완료하시겠습니까?\n(완료 시 프로젝트가 생성 및 시작됩니다.)')) return;

    try {
      const res = await apiClient.patch(`/recruitments/${recruitmentId}/status`, {
        status: 'COMPLETED'
      });
      if (res.data?.isSuccess) {
        alert(res.data.message || '모집이 완료되었으며, 프로젝트 팀이 생성되었습니다.');
        fetchRecruitments();
      }
    } catch (err) {
      console.error('모집 수동 완료 실패:', err);
      alert(err.message || '모집 완료 처리에 실패했습니다.');
    }
  };

  const totalPages = Math.ceil(recruitments.length / ITEMS_PER_PAGE);
  const currentRecruitments = recruitments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <main className="al-page">
      <h1 className="al-title">지원자 검토</h1>

      {loading && <p style={{ padding: '20px' }}>불러오는 중...</p>}

      <section className="al-list">
        {!loading && recruitments.length === 0 && (
          <div className="al-empty" style={{ padding: '60px 20px', textAlign: 'center', color: '#888' }}>
            등록된 모집글이 없습니다.
          </div>
        )}
        {!loading && currentRecruitments.map((recruitment) => {
          const isClosed = recruitment.status === 'COMPLETED' || recruitment.status === 'CANCELLED';
          const targetId = recruitment.recruitmentId || recruitment.id || recruitment.postId;
          return (
            <ApplicantBox
              key={targetId}
              title={recruitment.title}
              summary={CATEGORY_LABEL[recruitment.category] ?? recruitment.category}
              capacity={recruitment.maxMember}
              showBookmark={false}
              showSecondaryButton={!isClosed}
              secondaryButtonText="모집 수동 완료"
              secondaryButtonColor="#D9D9D9"
              onSecondaryButtonClick={() => handleCompleteRecruitment(targetId)}
              buttonText={isClosed ? '모집 마감' : '지원자 검토'}
              buttonColor={isClosed ? '#D9D9D9' : '#FE9A57'}
              disabled={isClosed}
              onClick={() => navigate(`/readme/${targetId}`, { state: recruitment })}
              onButtonClick={
                isClosed
                  ? undefined
                  : () =>
                      navigate('/applicant/detail', {
                        state: {
                          recruitmentId: targetId,
                          projectTitle: recruitment.title,
                        },
                      })
              }
            />
          );
        })}
      </section>

      {!loading && recruitments.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </main>
  );
};

export default ApplicantList;
