import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './AddProjectModal.css';

const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateWithDay = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const formattedMonth = String(month).padStart(2, '0');
  const formattedDay = String(day).padStart(2, '0');
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];
  return `${year} - ${formattedMonth} - ${formattedDay} (${weekday})`;
};

const AddProjectModal = ({ onClose, onAdd }) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(getTodayString());

  const handleClose = () => {
    setProjectName('');
    setDescription('');
    setRole('');
    setStartDate(getTodayString());
    setEndDate(getTodayString());
    onClose();
  };

  const handleAdd = () => {
    if (!projectName.trim()) {
      alert('프로젝트 이름을 입력해주세요.');
      return;
    }
    onAdd({
      title: projectName.trim(),
      description: description.trim(),
      role: role.trim() || null,
      startDate,
      endDate: endDate || null,
    });
    handleClose();
  };

  return ReactDOM.createPortal(
    <div className="add-modal-overlay" onClick={handleClose}>
      <div className="add-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="add-modal-inner">

          <h3 className="add-modal-title">프로젝트 추가</h3>

          <div className="add-modal-field">
            <label className="add-modal-field-label">프로젝트 이름</label>
            <input
              className="add-modal-input"
              placeholder="이름을 적어주세요."
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className="add-modal-field">
            <label className="add-modal-field-label">프로젝트 설명 (50자 제한)</label>
            <textarea
              className="add-modal-textarea"
              placeholder="설명을 간단히 적어주세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={50}
            />
          </div>

          <div className="add-modal-field">
            <label className="add-modal-field-label">참여했던 직무 (선택)</label>
            <input
              className="add-modal-input"
              placeholder="참여했던 직무를 적어주세요."
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div className="add-modal-field">
            <label className="add-modal-field-label">프로젝트 기간</label>
            <div className="add-modal-date-range">
              <div className="add-modal-custom-date">
                <div className="add-modal-date-display">{formatDateWithDay(startDate)}</div>
                <input
                  type="date"
                  className="add-modal-hidden-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <span className="add-modal-date-sep">~</span>
              <div className="add-modal-custom-date">
                <div className="add-modal-date-display">{formatDateWithDay(endDate)}</div>
                <input
                  type="date"
                  className="add-modal-hidden-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="add-modal-actions">
            <button className="add-modal-btn-cancel" onClick={handleClose}>취소</button>
            <button className="add-modal-btn-add" onClick={handleAdd}>프로젝트 추가</button>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddProjectModal;
