import React from "react";
import "./ProfileModal.css";
import closeIcon from "../../assets/icons/closeIcon.svg";
import ProfileAvatar from "../ProfileAvatar/ProfileAvatar";

function ProfileModal({ isOpen, onClose, user }) {
  if (!isOpen) return null;

  const projects = user?.projects ?? [
    {
      title: "동아리 프로젝트",
      period: "2025 - 03 - 20 ~",
      status: "진행중",
      score: null,
    },
    {
      title: "WAP 해커톤",
      period: "2025 - 03 - 20 ~ 2025 - 07 - 20",
      status: "완료",
      score: "4.7",
    },
    {
      title: "WAP 해커톤",
      period: "2025 - 03 - 20 ~ 2025 - 07 - 20",
      status: "완료",
      score: "4.7",
    },
    {
      title: "WAP 해커톤",
      period: "2025 - 03 - 20 ~ 2025 - 07 - 20",
      status: "완료",
      score: "4.7",
    },
    {
      title: "WAP 해커톤",
      period: "2025 - 03 - 20 ~ 2025 - 07 - 20",
      status: "완료",
      score: "4.7",
    },
  ];

  return (
    <>
      <div className="profile-popover-backdrop" onClick={onClose} />

      <div className="profile-popover" onClick={(e) => e.stopPropagation()}>
        <button className="profile-close-x-btn" onClick={onClose} aria-label="닫기">
            <img src={closeIcon} alt="닫기 아이콘" />
        </button>

        <div className="profile-popover-header">
          <div className="profile-user-info">
            <ProfileAvatar src={user?.profileImage} alt="프로필 이미지" />

            <strong className="profile-name">{user?.name || "김아무개"}</strong>
          </div>

          <div className="profile-task-count">
            <span className="completed-task">{user?.completedTaskCount ?? 3}</span>
            <span className="total-task">/{user?.totalTaskCount ?? 4}</span>
          </div>
        </div>

        <div className="profile-project-section">
          <h3 className="profile-section-title">프로젝트 경험</h3>

          <div className="profile-project-list">
            {projects.map((project, index) => (
              <div className="profile-project-item" key={index}>
                <div className="project-main-info">
                  <span className="project-title">{project.title}</span>
                  <span className="project-period">{project.period}</span>
                </div>

                <div className="project-sub-info">
                  <span
                    className={`project-status ${
                      project.status === "진행중" ? "active" : "done"
                    }`}
                  >
                    {project.status}
                  </span>

                  <div className="project-score">
                    {project.score ? (
                      <>
                        <span className="score-number">{project.score}</span>
                        <span className="score-text">점</span>
                      </>
                    ) : (
                      <span className="empty-score"></span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileModal;