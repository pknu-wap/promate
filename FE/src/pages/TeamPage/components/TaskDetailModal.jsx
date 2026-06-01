import React from 'react';

function TaskDetailModal({
  isOpen,
  task,
  isLoading,
  error,
  onClose,
  onStatusChange,
  onDelete
}) {
  if (!isOpen || !task) return null;

  return (
    <div className="team-post-detail-backdrop" role="presentation" onMouseDown={onClose}>
      <article className="team-post-detail-modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        {isLoading && <div className="team-member-status">태스크 정보 불러오는 중...</div>}
        {error && <div className="team-member-status" style={{ color: 'red' }}>{error}</div>}
        
        {!isLoading && !error && task.title && (
          <>
            <h2>{task.title}</h2>
            <div className="task-detail-meta" style={{ marginTop: '12px' }}>
              <dl className="meta-left">
                <div className="meta-row">
                  <dt>담당자</dt>
                  <dd>{task.managerName} ({task.role || '역할 지정 없음'})</dd>
                </div>
                <div className="meta-row">
                  <dt>마감일</dt>
                  <dd>{task.dueDate}</dd>
                </div>
              </dl>
              <div className="meta-right">
                <select value={task.status} onChange={(e) => onStatusChange(task.taskId, task, e.target.value)} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'Pretendard', fontSize: '12px', fontWeight: '600', color: '#333' }}>
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <p>{task.description || '상세 설명이 없습니다.'}</p>
            </div>
            <div className="team-post-modal-actions">
              <button type="button" className="team-post-delete-button" onClick={onDelete}>삭제</button>
              <button type="button" className="team-post-cancel-button" onClick={onClose}>닫기</button>
            </div>
          </>
        )}
      </article>
    </div>
  );
}

export default TaskDetailModal;