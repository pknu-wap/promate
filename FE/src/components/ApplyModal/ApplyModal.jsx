import { useEffect, useState } from "react";
import "./ApplyModal.css";
import { getApplicationForm, postApplication } from "../../api/Recruits/recruitmentApi";

function ApplyModal({
  isOpen,
  onClose,
  onSubmit,
  projectName,
  recruitmentId,
  job,
  motivation,
  setJob,
  setMotivation,
}) {
  const [fetchedTitle, setFetchedTitle] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = "hidden";

      if (recruitmentId) {
        const fetchApplyData = async () => {
          try {
            const response = await getApplicationForm(recruitmentId);
            if (response.isSuccess) {
              setFetchedTitle(response.data.RecruitmentTitle);
            }
          } catch (error) {
            console.error("지원서 작성용 데이터 로드 실패:", error);
          }
        };
        fetchApplyData();
      }
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, recruitmentId]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const applicationData = {
        objective: job,
        prContent: motivation,
        selectedProjectIds: []
      };

      const response = await postApplication(recruitmentId, applicationData);
      
      if (response.isSuccess) {
        alert(response.message);
        onSubmit?.();
        onClose?.();
      }
    } catch (error) {
      console.error("지원서 제출 실패:", error);
      alert(error.response?.data?.message || "지원서 제출 중 오류가 발생했습니다.");
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div className="apply-modal-overlay" onClick={handleOverlayClick}>
      <div className="apply-modal">
        <h2 className="apply-modal-title">{fetchedTitle || projectName}</h2>

        <form className="apply-modal-form" onSubmit={handleSubmit}>
          <div className="apply-modal-group">
            <label htmlFor="apply-job" className="apply-modal-label">
              기여하고 싶은 분야 (선택)
            </label>
            <input
              id="apply-job"
              type="text"
              className="apply-modal-input"
              value={job}
              onChange={(e) => setJob(e.target.value)}
              maxLength={50}
              placeholder="기여하고 싶은 분야를 적어주세요."
            />
          </div>

          <div className="apply-modal-group">
            <label
              htmlFor="apply-motivation"
              className="apply-modal-label"
            >
              지원 동기 및 자기 PR
            </label>
            <textarea
              id="apply-motivation"
              className="apply-modal-textarea"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              required
              maxLength={500}
              placeholder="지원 동기 및 자기 PR을 적어주세요."
            />
          </div>

          <div className="apply-modal-button-wrap">
            <button type="button" className="apply-modal-cancel-btn" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="apply-modal-submit-btn">
              지원하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyModal;
