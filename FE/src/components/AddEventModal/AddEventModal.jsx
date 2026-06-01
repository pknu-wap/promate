import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './AddEventModal.css';

const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

function AddEventModal({ isOpen, onClose, onAddEvent }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(getTodayString());
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      alert('종료일이 시작일보다 빠를 수 없습니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await onAddEvent({
        title: title.trim(),
        content: content.trim(),
        startDate,
        endDate,
      });

      if (success !== false) {
        handleClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="aem-overlay" onClick={handleClose}>
      <div className="aem-container" onClick={(e) => e.stopPropagation()}>
        <div className="aem-content">
          <h2 className="aem-title">새 일정</h2>

          <div className="aem-input-group">
            <label className="aem-input-label">제목</label>
            <input
              type="text"
              className="aem-input-field"
              placeholder="제목을 적어주세요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="aem-input-group aem-content-group">
            <label className="aem-input-label">내용</label>
            <textarea
              className="aem-input-field aem-content-field"
              placeholder="내용을 적어주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="aem-date-group">
            <label className="aem-input-label">날짜</label>

            <div className="aem-date-row">
              <span className="aem-row-label">시작</span>
              <div className="aem-date-picker">
                <div className="aem-date-display">
                  {formatDateWithDay(startDate)}
                </div>
                <input
                  type="date"
                  className="aem-hidden-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>

            <div className="aem-date-row">
              <span className="aem-row-label">종료</span>
              <div className="aem-date-picker">
                <div className="aem-date-display">
                  {formatDateWithDay(endDate)}
                </div>
                <input
                  type="date"
                  className="aem-hidden-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="aem-actions">
            <button type="button" className="aem-cancel-btn" onClick={handleClose} disabled={isSubmitting}>
              취소
            </button>
            <button type="button" className="aem-submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? '추가 중...' : '일정 추가'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AddEventModal;