import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './AddProjectModal.css';

const timeOptions = [];
for (let i = 0; i < 24; i++) {
  const hour = String(i).padStart(2, '0');
  timeOptions.push(`${hour}:00`);
  timeOptions.push(`${hour}:30`);
}

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
  const [startDate, setStartDate] = useState(getTodayString());
  const [startTime, setStartTime] = useState('12:00');
  const [endDate, setEndDate] = useState(getTodayString());
  const [endTime, setEndTime] = useState('13:00');
  const [isAllDay, setIsAllDay] = useState(true);

  const handleClose = () => {
    setProjectName('');
    setStartDate(getTodayString());
    setEndDate(getTodayString());
    setIsAllDay(true);
    onClose();
  };

  const handleAdd = () => {
    if (!projectName.trim()) {
      alert('프로젝트 이름을 입력해주세요.');
      return;
    }
    
    onAdd({
      title: projectName.trim(),
      startDate,
      startTime: isAllDay ? '00:00' : startTime,
      endDate: endDate || null,
      endTime: isAllDay ? '23:59' : endTime,
      isAllDay,
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
            <label className="add-modal-field-label">참여했던 직무</label>

            <div className="add-modal-date-row">
              <span className="add-modal-row-label">시작</span>
              <div className="add-modal-custom-date">
                <div className="add-modal-date-display">
                  {formatDateWithDay(startDate)}
                </div>
                <input
                  type="date"
                  className="add-modal-hidden-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              {!isAllDay && (
                <select
                  className="add-modal-time-select"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                >
                  {timeOptions.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="add-modal-date-row">
              <span className="add-modal-row-label">종료</span>
              <div className="add-modal-custom-date">
                <div className="add-modal-date-display">
                  {formatDateWithDay(endDate)}
                </div>
                <input
                  type="date"
                  className="add-modal-hidden-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              {!isAllDay && (
                <select
                  className="add-modal-time-select"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                >
                  {timeOptions.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="add-modal-date-row">
              <span className="add-modal-row-label">종일</span>
              <label className="add-modal-switch">
                <input
                  type="checkbox"
                  checked={isAllDay}
                  onChange={(e) => setIsAllDay(e.target.checked)}
                />
                <span className="add-modal-slider" />
              </label>
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
