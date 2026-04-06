// ApplyModal.jsx
import { useEffect } from "react";
import "./ApplyModal.css";
import MainButton from "../MainButton/MainButton";

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
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
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
              직무
            </label>
            <input
              id="apply-job"
              type="text"
              className="apply-modal-input"
              value={job}
              onChange={(e) => setJob(e.target.value)}
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
            />
          </div>

          <div className="apply-modal-button-wrap">
            <MainButton type="submit">
              지원하기
            </MainButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyModal;