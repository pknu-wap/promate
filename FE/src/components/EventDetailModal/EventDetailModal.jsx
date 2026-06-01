import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import './EventDetailModal.css';

function EventDetailModal({ event, onClose }) {
  const navigate = useNavigate();
  const [detailData, setDetailData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!event) {
      setDetailData(null);
      return;
    }

    setDetailData(event);

    const fetchEventDetail = async () => {
      if (!event.projectId || !event.id) return;

      try {
        setIsLoading(true);
        const response = await apiClient.get(`/projects/${event.projectId}/schedules/${event.id}`);
        if (response.data && response.data.isSuccess) {
          const data = response.data.data;
          setDetailData((prev) => ({
            ...prev,
            text: data.title || prev.text,
            content: data.content || prev.content,
          }));
        }
      } catch (error) {
        console.error('일정 상세 정보 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetail();
  }, [event]);

  if (!event || !detailData) return null;

  const formatEventDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    
    return `${year}.${month}.${day} (${weekday})`;
  };

  const dateString = `${formatEventDate(detailData.start)} ~ ${formatEventDate(detailData.end)}`;

  const handleProjectClick = () => {
    if (detailData.projectId) {
      navigate(`/project/${detailData.projectId}`, { state: { projectTitle: detailData.projectTitle } });
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
          <h2 className="edm-title">{detailData.text}</h2>
          
          <div className="edm-info">
            {detailData.projectTitle && (
              <div className="edm-info-row">
                <span className="edm-info-label">프로젝트</span>
                <span 
                  className={`edm-info-value ${detailData.projectId ? 'edm-project-link' : ''}`}
                  onClick={detailData.projectId ? handleProjectClick : undefined}
                >
                  {detailData.projectTitle}
                </span>
              </div>
            )}
            <div className="edm-info-row">
              <span className="edm-info-label">날짜</span>
              <span className="edm-info-value">{dateString}</span>
            </div>
            
            <div className="edm-divider" />
            
            <div className="edm-content-wrapper">
              {isLoading ? (
                <p className="edm-content" style={{ color: '#909090' }}>내용을 불러오는 중입니다...</p>
              ) : (
                <p className="edm-content">{detailData.content || '등록된 내용이 없습니다.'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default EventDetailModal;