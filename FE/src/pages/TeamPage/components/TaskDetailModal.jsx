import React, { useState } from 'react';

function TaskDetailModal({
  isOpen,
  task,
  isLoading,
  error,
  onClose,
  onStatusChange,
  onDelete
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isOpen || !task) return null;

  return (
    <div className="team-detail-overlay" role="presentation" onMouseDown={onClose}>
      <article className="team-detail-container" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        <div className="team-detail-header">
          <div className="team-detail-more-container">
            <button
              type="button"
              className="team-detail-more-btn"
              aria-label="태스크 메뉴"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <span className="team-detail-more-icon"></span>
            </button>
            {isMenuOpen && (
              <div className="team-detail-dropdown-menu">
                <button type="button" className="team-detail-dropdown-item delete" onClick={() => { setIsMenuOpen(false); onDelete(); }}>
                  삭제
                </button>
              </div>
            )}
          </div>
          <button type="button" className="team-detail-close-btn" onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </div>

        <div className="team-detail-body">
          {isLoading && <p className="team-member-status">태스크 정보 불러오는 중...</p>}
          {error && <p className="team-member-status" style={{ color: 'red' }}>{error}</p>}
          
          {!isLoading && !error && task.title && (
            <>
              <h2 className="team-detail-title">{task.title}</h2>
              
              <div className="team-detail-info">
                <div className="team-detail-info-row">
                  <span className="team-detail-info-label">담당자</span>
                  <span className="team-detail-info-value" style={{ color: '#1a1a1a' }}>
                    {task.managerName} ({task.role || '역할 지정 없음'})
                  </span>
                </div>
                <div className="team-detail-info-row">
                  <span className="team-detail-info-label">마감일</span>
                  <span className="team-detail-info-value" style={{ color: '#1a1a1a' }}>{task.dueDate}</span>
                </div>
                <div className="team-detail-info-row">
                  <span className="team-detail-info-label">상태</span>
                  <select
                    className="team-detail-select"
                    value={task.status}
                    onChange={(e) => onStatusChange(task.taskId, task, e.target.value)}
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>
              </div>
              
              <div className="team-detail-divider" />
              
              <div className="team-detail-content-wrapper">
                <p className="team-detail-content">{task.description || '상세 설명이 없습니다.'}</p>
              </div>
            </>
          )}
        </div>
      </article>
    </div>
  );
}

export default TaskDetailModal;