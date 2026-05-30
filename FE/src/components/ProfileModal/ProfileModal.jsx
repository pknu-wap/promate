import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ProfileModal.css";
import closeIcon from "../../assets/icons/closeIcon.svg";
import ProfileAvatar from "../ProfileAvatar/ProfileAvatar";

function ProfileModal({ isOpen, onClose, user, position }) {
  const [modalPos, setModalPos] = useState({ top: 0, left: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragPos = useRef({ startX: 0, startY: 0, initialTop: 0, initialLeft: 0 });

  useEffect(() => {
    if (position) {
      setModalPos({
        top: position.top + 225,
        left: position.left + 100,
      });
    }
  }, [position]);

  const handleMouseMove = useCallback((e) => {
    const deltaX = e.clientX - dragPos.current.startX;
    const deltaY = e.clientY - dragPos.current.startY;
    
    setModalPos({
      top: dragPos.current.initialTop + deltaY,
      left: dragPos.current.initialLeft + deltaX,
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = (e) => {
    if (e.target.closest("button") || e.target.closest(".profile-project-list")) return;

    setIsDragging(true);
    dragPos.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialTop: modalPos.top,
      initialLeft: modalPos.left,
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

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

  const popoverStyle = position ? {
    position: "fixed",
    top: `${modalPos.top}px`,
    left: `${modalPos.left}px`,
    transform: "translate(0, -100%)",
    margin: 0,
    cursor: isDragging ? "grabbing" : "grab",
    userSelect: isDragging ? "none" : "auto",
  } : {};

  return (
    <>
      <div className="profile-popover-backdrop" onClick={onClose} />

      <div 
        className="profile-popover" 
        onClick={(e) => e.stopPropagation()} 
        onMouseDown={handleMouseDown}
        style={popoverStyle}
      >
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