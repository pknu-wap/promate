import React, { useState, useEffect } from 'react';
import './NewTaskModal.css';

const mockTeammates = [
  { id: 1, name: '홍길동' },
  { id: 2, name: '김철수' },
  { id: 3, name: '이영희' },
  { id: 4, name: '박민수' },
];

function TaskModal({ isOpen, onClose, onSubmit, projectId }) {
  const [title, setTitle] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  const [teammates, setTeammates] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setTeammates(mockTeammates);
    } else {
      setTitle('');
      setAssigneeId('');
      setDescription('');
      setDueDate('');
    }
  }, [isOpen, projectId]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const newTask = {
      title,
      assigneeId,
      description,
      dueDate,
    };
    
    if (onSubmit) onSubmit(newTask);
    onClose();
  };

  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div className="task-modal-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="task-modal-header">새 태스크 추가</h2>

        <div className="task-modal-form">
          <div className="task-modal-field">
            <label className="task-modal-label">태스크 제목</label>
            <input
              type="text"
              className="task-modal-input"
              placeholder="태스크 제목을 입력해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="task-modal-field">
            <label className="task-modal-label">담당자</label>
            <select
              className="task-modal-select"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
            >
              <option value="" disabled>담당자를 선택해주세요</option>
              {teammates.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div className="task-modal-field">
            <label className="task-modal-label">태스크 설명 (50자 제한)</label>
            <textarea
              className="task-modal-textarea"
              placeholder="설명을 간단히 적어주세요."
              maxLength={50}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="task-modal-field">
            <label className="task-modal-label">마감 기한</label>
            <input
              type="date"
              className="task-modal-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="task-modal-actions">
          <button className="task-btn-cancel" onClick={onClose}>취소</button>
          <button className="task-btn-submit" onClick={handleSubmit}>태스크 추가</button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;