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
            <dl className="team-post-detail-meta" style={{ marginTop: '12px' }}>
              <dt>담당자</dt>
              <dd>{task.managerName} ({task.role || '역할 지정 없음'})</dd>
              <dt>마감일</dt>
              <dd>{task.dueDate}</dd>
              <dt>상태</dt>
              <dd>
                <select value={task.status} onChange={(e) => onStatusChange(task.taskId, task, e.target.value)} style={{ padding: '2px 6px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
              </dd>
            </dl>
            <div style={{ marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
              <p>{task.description || '상세 설명이 없습니다.'}</p>
            </div>
            <div className="team-post-modal-actions" style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" onClick={onDelete} style={{ padding: '8px 16px', border: 'none', background: '#ff4d4f', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>삭제</button>
              <button type="button" className="team-post-cancel-button" onClick={onClose}>닫기</button>
            </div>
          </>
        )}
      </article>
    </div>
  );
}

export default TaskDetailModal;