import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './AddEventModal.css';

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

function AddEventModal({ isOpen, onClose, onAddEvent }) {
  const [title, setTitle] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(getTodayString());
  const [startTime, setStartTime] = useState('12:00');
  const [endTime, setEndTime] = useState('13:00');

  const formatDateWithDay = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];

    return `${year} - ${formattedMonth} - ${formattedDay} (${weekday})`;
  };

  const handleClose = () => {
    setTitle('');
    setIsAllDay(false);
    setStartDate(getTodayString());
    setEndDate(getTodayString());
    setStartTime('12:00');
    setEndTime('13:00');
    onClose();
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    const start = new Date(`${startDate}T${isAllDay ? '00:00' : startTime}`);
    const end = new Date(`${endDate}T${isAllDay ? '23:59' : endTime}`);

    if (start > end) {
      alert('종료 시간이 시작 시간보다 빠를 수 없습니다.');
      return;
    }

    onAddEvent({
      text: title.trim(),
      start,
      end,
      isAllDay,
    });

    handleClose();
  };

  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={handleClose}>
      <div className="add-event-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <h2 className="modal-title">새 일정</h2>

          <div className="input-group">
            <label className="input-label">제목</label>
            <input
              type="text"
              className="title-input"
              placeholder="제목을 적어주세요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="date-group">
            <label className="input-label">날짜</label>

            <div className="date-row">
              <span className="row-label">시작</span>
              <div className="custom-date-picker">
                <div className="date-display">
                  {formatDateWithDay(startDate)}
                </div>
                <input
                  type="date"
                  className="hidden-date-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {!isAllDay && (
                <select
                  className="time-input"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="date-row">
              <span className="row-label">종료</span>
              <div className="custom-date-picker">
                <div className="date-display">
                  {formatDateWithDay(endDate)}
                </div>
                <input
                  type="date"
                  className="hidden-date-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              {!isAllDay && (
                <select
                  className="time-input"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="date-row all-day-row">
              <span className="row-label">종일</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isAllDay}
                  onChange={(e) => setIsAllDay(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={handleClose}>
              취소
            </button>
            <button type="button" className="add-btn" onClick={handleSubmit}>
              일정 추가
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AddEventModal;