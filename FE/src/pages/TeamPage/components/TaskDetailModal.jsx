import React, { useState, useEffect } from 'react';

function TaskDetailModal({
  isOpen,
  task,
  isLoading,
  error,
  members = [],
  onClose,
  onStatusChange,
  onDelete,
  onUpdate
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editTitle, setEditTitle] = useState('');
  const [editManagerId, setEditManagerId] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    if (task) {
      setEditTitle(task.title || '');
      
      const currentManager = members.find(m => m.name === task.managerName) || members.find(m => m.userId === task.managerId);
      setEditManagerId(currentManager ? currentManager.userId : task.managerId || '');
      
      setEditDueDate(task.dueDate ? task.dueDate.replace(/\./g, '-') : '');
      setEditStatus(task.status || 'TODO');
      setEditDescription(task.description || '');
      
      setIsEditing(false);
      setIsMenuOpen(false);
    }
  }, [task, members]);

  if (!isOpen || !task) return null;

  const handleUpdateSubmit = () => {
    if (!editTitle.trim()) {
      alert('태스크 제목을 입력해주세요.');
      return;
    }
    if (!editDueDate) {
      alert('마감일을 선택해주세요.');
      return;
    }
    if (!editManagerId) {
      alert('담당자를 선택해주세요.');
      return;
    }

    const updatedData = {
      title: editTitle,
      role: editTitle,
      managerId: Number(editManagerId),
      description: editDescription,
      dueDate: editDueDate,
      status: editStatus
    };

    if (onUpdate) {
      onUpdate(task.taskId, updatedData);
    }
  };

  return (
    <div className="team-detail-overlay" role="presentation" onMouseDown={onClose}>
      <article className="team-detail-container" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        <div className="team-detail-header">
          {isEditing ? (
            <div className="team-detail-header-actions">
              <button type="button" className="team-detail-btn team-detail-cancel-btn" onClick={() => setIsEditing(false)}>취소</button>
              <button type="button" className="team-detail-btn team-detail-save-btn" onClick={handleUpdateSubmit}>저장</button>
            </div>
          ) : (
            <>
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
                    <button type="button" className="team-detail-dropdown-item" onClick={() => { setIsMenuOpen(false); setIsEditing(true); }}>
                      수정
                    </button>
                    <button type="button" className="team-detail-dropdown-item delete" onClick={() => { setIsMenuOpen(false); onDelete(); }}>
                      삭제
                    </button>
                  </div>
                )}
              </div>
              <button type="button" className="team-detail-close-btn" onClick={onClose} aria-label="닫기">
                ✕
              </button>
            </>
          )}
        </div>

        <div className="team-detail-body">
          {isLoading && <p className="team-member-status">태스크 정보 불러오는 중...</p>}
          {error && <p className="team-member-status" style={{ color: 'red' }}>{error}</p>}
          
          {!isLoading && !error && task.title && (
            isEditing ? (
              <>
                <input
                  type="text"
                  className="team-detail-edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="태스크 제목 (역할)"
                />
                
                <div className="team-detail-info">
                  <div className="team-detail-info-row">
                    <span className="team-detail-info-label">담당자</span>
                    <select
                      className="team-detail-edit-input"
                      value={editManagerId}
                      onChange={(e) => setEditManagerId(e.target.value)}
                    >
                      <option value="">담당자 선택</option>
                      {members.map(member => (
                        <option key={member.userId} value={member.userId}>{member.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="team-detail-info-row" style={{ width: '100%', gap: '16px' }}>
                    <span className="team-detail-info-label">마감일</span>
                    <input
                      type="date"
                      className="team-detail-edit-input"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                    />
                    <span className="team-detail-info-label" style={{ minWidth: 'auto' }}>상태</span>
                    <select
                      className="team-detail-edit-input"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      <option value="TODO">TODO</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="DONE">DONE</option>
                    </select>
                  </div>
                </div>
                
                <div className="team-detail-divider" />
                
                <div className="team-detail-content-wrapper">
                  <textarea
                    className="team-detail-edit-content"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="상세 설명을 입력하세요."
                  />
                </div>
              </>
            ) : (
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
            )
          )}
        </div>
      </article>
    </div>
  );
}

export default TaskDetailModal;