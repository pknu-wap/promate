import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import checkIcon from '../../assets/icons/checkIcon.svg';
import './MemberReviewPage.css';
import apiClient from '../../api/apiClient.js';
import Tag from "../../components/Tag/Tag.jsx";

const questions = [
  'OOO 팀원은 프로젝트 진행 과정에서 원활하게 소통했는가?',
  'OOO 팀원은 맡은 업무에 적극적으로 참여했는가?',
  'OOO 팀원은 맡은 역할과 일정에 책임감 있게 임했는가?',
  'OOO 팀원은 문제 발생 시 해결을 위해 노력했는가?',
];

const defaultScores = [5, 5, 5, 5];

function MemberReviewPage() {
  const { projectId: paramProjectId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const projectId = paramProjectId || searchParams.get('projectId') || location.state?.projectId;

  const [reviews, setReviews] = useState({});
  
  const [selectedDomain, setSelectedDomain] = useState("");
  const [domainOptions, setDomainOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const statusResponse = await apiClient.get(`/projects/${projectId}/reviews/status`);
        if (statusResponse.data?.data?.reviewed) {
          setErrorMessage("이미 팀원 평가를 완료한 프로젝트입니다.");
          setIsLoading(false);
          return;
        }

        const response = await apiClient.get(`/projects/${projectId}/reviews/targets`);
        if (response.data && response.data.isSuccess) {
          const dataList = response.data.data.content || response.data.data || [];
          const targets = dataList.map((target, index) => ({
            id: String(target.revieweeId ?? target.memberId ?? target.userId ?? target.id ?? index),
            label: target.name || target.nickname || "알 수 없음"
          }));
          setDomainOptions(targets);

          const initialReviews = {};
          targets.forEach(t => {
            initialReviews[t.id] = { scores: [...defaultScores], comment: '' };
          });
          setReviews(initialReviews);

          if (targets.length > 0) {
            setSelectedDomain(targets[0].id);
          }
        }
      } catch (error) {
        console.error('평가 정보 조회 실패:', error);
        setErrorMessage(error.message || '팀원 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchReviewData();
    } else {
      setErrorMessage("프로젝트 정보를 찾을 수 없습니다.");
      setIsLoading(false);
    }
  }, [projectId]);

  const handleScoreChange = (questionIndex, score) => {
    if (!selectedDomain) return;
    setReviews((prev) => {
      const currentReview = prev[selectedDomain];
      if (!currentReview) return prev;
      return {
        ...prev,
        [selectedDomain]: {
          ...currentReview,
          scores: currentReview.scores.map((s, i) => (i === questionIndex ? score : s))
        }
      };
    });
  };

  const handleDomainChange = (domainId) => {
    setSelectedDomain(domainId);
  };

  const handleSave = async () => {
    const reviewPayload = Object.keys(reviews).map(revieweeId => {
      const review = reviews[revieweeId];
      return {
        revieweeId: parseInt(revieweeId, 10),
        communicationScore: review.scores[0],
        proactivenessScore: review.scores[1],
        responsibilityScore: review.scores[2],
        problemSolvingScore: review.scores[3],
        comment: review.comment.trim() || null
      };
    });

    try {
      const response = await apiClient.post(`/projects/${projectId}/reviews`, { reviews: reviewPayload });
      if (response.data && response.data.isSuccess) {
        alert('팀원 평가가 등록되었습니다.');
        navigate(-1);
      }
    } catch (error) {
      console.error('팀원 평가 등록 실패:', error);
      alert(error.message || '팀원 평가 등록 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return <div className="member-review-page"><div style={{ padding: '40px', textAlign: 'center' }}>데이터를 불러오는 중입니다...</div></div>;
  }

  if (errorMessage) {
    return (
      <div className="member-review-page">
        <div style={{ padding: '40px', textAlign: 'center', color: '#DE0000', fontWeight: 'bold' }}>{errorMessage}</div>
      </div>
    );
  }

  const selectedTargetName = domainOptions.find(opt => opt.id === selectedDomain)?.label || '해당';
  
  const currentScores = reviews[selectedDomain]?.scores || defaultScores;
  const currentComment = reviews[selectedDomain]?.comment || '';

  return (
    <div className="member-review-page">
      <h1 className="member-review-title">상호 평가 </h1>

      <section className="member-review-card" aria-label="상호 평가 작성 폼">
        <div className="form-field">
      
          <div className="domain-tags">
            {domainOptions.map((option) => (
              <Tag
                key={option.id}
                isActive={selectedDomain === option.id}
                onClick={() => handleDomainChange(option.id)}
              >
                {option.label}
              </Tag>
            ))}
          </div>
        </div>

        {domainOptions.length > 0 ? (
          <>
            <div className="member-review-question-list">
              {questions.map((question, questionIndex) => (
                <fieldset className="member-review-question" key={question}>
                  <legend>
                    {questionIndex + 1}. {question.replace('OOO', selectedTargetName)} <span aria-hidden="true">*</span>
                  </legend>

                  <div className="member-review-scale">
                    <span>전혀 그렇지 않다</span>

                    <div className="member-review-options">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <label className="member-review-option" key={score}>
                          <input
                            type="radio"
                            name={`review-score-${questionIndex}`}
                            value={score}
                            checked={currentScores[questionIndex] === score}
                            onChange={() => handleScoreChange(questionIndex, score)}
                          />
                          <span aria-hidden="true">
                            {currentScores[questionIndex] === score && <img src={checkIcon} alt="" />}
                          </span>
                        </label>
                      ))}
                    </div>

                    <span>매우 그렇다</span>
                  </div>
                </fieldset>
              ))}
            </div>

            <div className="member-review-divider" />

            <label className="member-review-comment">
              <span>
                협업 과정에서 느낀 의견을 자유롭게 작성해주세요. <strong></strong>
                
              </span>
              <textarea
                value={currentComment}
                maxLength={150}
                placeholder="자유롭게 작성해주세요."
                onChange={(event) => {
                  if (!selectedDomain) return;
                  const val = event.target.value;
                  setReviews((prev) => {
                    const currentReview = prev[selectedDomain];
                    if (!currentReview) return prev;
                    return {
                      ...prev,
                      [selectedDomain]: {
                        ...currentReview,
                        comment: val
                      }
                    };
                  });
                }}
              />
                <div className="member-review-char-count">
    {currentComment.length}/150
  </div>
            </label>



            <button className="member-review-save" type="button" onClick={handleSave}>
              저장하기
            </button>
          </>
        ) : (
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#909090', width: '100%' }}>
            상호 평가를 진행할 팀원이 없습니다.
          </div>
        )}
      </section>
    </div>
  );
}

export default MemberReviewPage;