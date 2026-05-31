import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useSearchParams } from 'react-router-dom';
import checkIcon from '../../assets/icons/checkIcon.svg';
import './MemberReview.css';
import Badge from "../../components/Badge/Badge.jsx";
import apiClient from '../../api/apiClient';

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
  
  const projectId = paramProjectId || searchParams.get('projectId') || location.state?.projectId;

  const [scores, setScores] = useState(defaultScores);
  const [comment, setComment] = useState('');
  
  const [selectedDomain, setSelectedDomain] = useState("");
  const [domainOptions, setDomainOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchReviewTargets = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await apiClient.get(`/projects/${projectId}/reviews/targets`);
        if (response.data && response.data.isSuccess) {
          const targets = response.data.data.map(target => ({
            id: String(target.revieweeId),
            label: target.name || target.nickname || "알 수 없음"
          }));
          setDomainOptions(targets);
          if (targets.length > 0) {
            setSelectedDomain(targets[0].id);
          }
        }
      } catch (error) {
        console.error('평가 대상자 조회 실패:', error);
        setErrorMessage(error.message || '팀원 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchReviewTargets();
    } else {
      setErrorMessage("프로젝트 정보를 찾을 수 없습니다.");
      setIsLoading(false);
    }
  }, [projectId]);

  const handleScoreChange = (questionIndex, score) => {
    setScores((prevScores) =>
      prevScores.map((prevScore, index) => (index === questionIndex ? score : prevScore))
    );
  };

  
  const handleDomainChange = (domainId) => {
    setSelectedDomain(domainId);
    
    
    setScores(defaultScores);
    setComment('');
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

  return (
    <div className="member-review-page">
      <h1 className="member-review-title">상호 평가 - 캡스톤 디자인</h1>

      <section className="member-review-card" aria-label="상호 평가 작성 폼">
        <div className="form-field">
      
          <div className="domain-tags">
            {domainOptions.length > 0 ? (
              domainOptions.map((option) => (
                <Badge
                  key={option.id}
                  selected={selectedDomain === option.id}
                  onClick={() => handleDomainChange(option.id)}
                >
                  {option.label}
                </Badge>
              ))
            ) : (
              <span style={{ fontSize: '13px', color: '#909090', padding: '4px 0' }}>평가할 팀원이 없습니다.</span>
            )}
          </div>
        </div>

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
                        checked={scores[questionIndex] === score}
                        onChange={() => handleScoreChange(questionIndex, score)}
                      />
                      <span aria-hidden="true">
                        {scores[questionIndex] === score && <img src={checkIcon} alt="" />}
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
            협업 과정에서 느낀 의견을 자유롭게 작성해주세요. <strong>*</strong>
            <em>(150자 제한)</em>
          </span>
          <textarea
            value={comment}
            maxLength={150}
            placeholder="자유롭게 작성해주세요."
            onChange={(event) => setComment(event.target.value)}
          />
        </label>

        <button className="member-review-save" type="button">
          저장하기
        </button>
      </section>
    </div>
  );
}

export default MemberReviewPage;