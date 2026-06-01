import React from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import './EventDetailModal.css';

function EventDetailModal({ event, onClose }) {
  const navigate = useNavigate();

  if (!event) return null;

  const formatEventDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    
    return `${year}.${month}.${day} (${weekday})`;
  };

  const dateString = `${formatEventDate(event.start)} ~ ${formatEventDate(event.end)}`;

  const handleProjectClick = () => {
    if (event.projectId) {
      navigate(`/project/${event.projectId}`, { state: { projectTitle: event.projectTitle } });
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div className="edm-overlay" onClick={onClose}>
      <div className="edm-container" onClick={(e) => e.stopPropagation()}>
        <div className="edm-header">
          <button type="button" className="edm-close-btn" onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </div>
        
        <div className="edm-body">
          <h2 className="edm-title">{event.text}</h2>
          
          <div className="edm-info">
            {event.projectTitle && (
              <div className="edm-info-row">
                <span className="edm-info-label">프로젝트</span>
                <span 
                  className={`edm-info-value ${event.projectId ? 'edm-project-link' : ''}`}
                  onClick={event.projectId ? handleProjectClick : undefined}
                >
                  {event.projectTitle}
                </span>
              </div>
            )}
            <div className="edm-info-row">
              <span className="edm-info-label">날짜</span>
              <span className="edm-info-value">{dateString}</span>
            </div>
            
            <div className="edm-divider" />
            
            <div className="edm-content-wrapper">
              <p className="edm-content">{event.content || '등록된 내용이 없습니다.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default EventDetailModal;