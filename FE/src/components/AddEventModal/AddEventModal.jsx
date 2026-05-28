import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './AddEventModal.css';
import apiClient from '../../api/apiClient';

const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

function AddEventModal({ isOpen, onClose, onAddEvent, projectId }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(getTodayString());

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
    setContent('');
    setStartDate(getTodayString());
    setEndDate(getTodayString());
    onClose();
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (startDate > endDate) {
      alert('종료 날짜가 시작 날짜보다 빠를 수 없습니다.');
      return;
    }

    if (!projectId) {
      alert('프로젝트가 지정되지 않았습니다.');
      return;
    }

    try {
      const response = await apiClient.post(`/projects/${projectId}/schedules`, {
        title: title.trim(),
        content: content.trim(),
        startDate,
        endDate,
      });

      if (response.data.isSuccess) {
        const newSchedule = response.data.data;
        const [startYear, startMonth, startDay] = newSchedule.startDate.split('-').map(Number);
        const [endYear, endMonth, endDay] = newSchedule.endDate.split('-').map(Number);
        
        onAddEvent({
          id: newSchedule.scheduleId,
          text: newSchedule.title,
          content: newSchedule.content,
          start: new Date(startYear, startMonth - 1, startDay),
          end: new Date(endYear, endMonth - 1, endDay),
        });

        handleClose();
      }
    } catch (error) {
      console.error('일정 추가 에러:', error);
      alert(error.message || '일정 추가에 실패했습니다.');
    }
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

          <div className="input-group">
            <label className="input-label">내용</label>
            <input
              type="text"
              className="title-input"
              placeholder="내용을 적어주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
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