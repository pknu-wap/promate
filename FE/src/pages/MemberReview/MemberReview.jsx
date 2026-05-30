import React, { useState } from 'react';
import checkIcon from '../../assets/icons/checkIcon.svg';
import './MemberReview.css';

const questions = [
  'OOO 팀원은 프로젝트 진행 과정에서 원활하게 소통했는가?',
  'OOO 팀원은 맡은 업무에 적극적으로 참여했는가?',
  'OOO 팀원은 맡은 역할과 일정에 책임감 있게 임했는가?',
  'OOO 팀원은 문제 발생 시 해결을 위해 노력했는가?',
];

const defaultScores = [5, 5, 5, 5];

function MemberReview() {
  const [scores, setScores] = useState(defaultScores);
  const [comment, setComment] = useState('');

  const handleScoreChange = (questionIndex, score) => {
    setScores((prevScores) =>
      prevScores.map((prevScore, index) => (index === questionIndex ? score : prevScore))
    );
  };

  return (
    <div className="member-review-page">
      <h1 className="member-review-title">상호 평가 - 캡스톤 디자인</h1>

      <section className="member-review-card" aria-label="상호 평가 작성 폼">
        <div className="member-review-question-list">
          {questions.map((question, questionIndex) => (
            <fieldset className="member-review-question" key={question}>
              <legend>
                {questionIndex + 1}. {question} <span aria-hidden="true">*</span>
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

export default MemberReview;
