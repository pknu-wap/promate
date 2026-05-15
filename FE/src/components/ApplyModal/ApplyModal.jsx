// ApplyModal.jsx
import { useEffect } from "react";
import "./ApplyModal.css";

function ApplyModal({
  isOpen,
  onClose,
  onSubmit,
  projectName,
  job,
  motivation,
  setJob,
  setMotivation,
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div className="apply-modal-overlay" onClick={handleOverlayClick}>
      <div className="apply-modal">
        <h2 className="apply-modal-title">{projectName}</h2>

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
