import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import './EventDetailModal.css';

function EventDetailModal({ event, onClose, onDeleteEvent, onUpdateEvent }) {
  const navigate = useNavigate();
  const [detailData, setDetailData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');

  useEffect(() => {
    if (!event) {
      setDetailData(null);
      setIsEditing(false);
      setIsMenuOpen(false);
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

  const toDateString = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const startEdit = () => {
    setEditTitle(detailData.text || '');
    setEditContent(detailData.content || '');
    setEditStartDate(toDateString(detailData.start));
    setEditEndDate(toDateString(detailData.end));
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const handleProjectClick = () => {
    if (detailData.projectId) {
      navigate(`/project/${detailData.projectId}`, { state: { projectTitle: detailData.projectTitle } });
      onClose();
    }
  };

  const handleUpdate = async () => {
    if (!detailData.projectId || !detailData.id) return;
    if (!editTitle.trim()) return alert('제목을 입력해주세요.');
    if (!editStartDate || !editEndDate) return alert('날짜를 선택해주세요.');

    if (new Date(editStartDate) > new Date(editEndDate)) {
      return alert('종료일은 시작일보다 빠를 수 없습니다.');
    }

    try {
      setIsLoading(true);
      const payload = {
        title: editTitle,
        content: editContent,
        startDate: editStartDate,
        endDate: editEndDate,
      };

      const response = await apiClient.put(
        `/projects/${detailData.projectId}/schedules/${detailData.id}`,
        payload
      );
      
      if (response.data && response.data.isSuccess) {
        alert(response.data.message || '일정 수정이 완료되었습니다.');
        
        const [startYear, startMonth, startDay] = editStartDate.split('-').map(Number);
        const updatedStart = new Date(startYear, startMonth - 1, startDay);
        const [endYear, endMonth, endDay] = editEndDate.split('-').map(Number);
        const updatedEnd = new Date(endYear, endMonth - 1, endDay);

        setDetailData(prev => ({
          ...prev,
          text: editTitle,
          content: editContent,
          start: updatedStart,
          end: updatedEnd,
        }));

        if (onUpdateEvent) {
          onUpdateEvent({ id: detailData.id, text: editTitle, content: editContent, start: updatedStart, end: updatedEnd });
        }
        setIsEditing(false);
      }
    } catch (error) {
      console.error('일정 수정 실패:', error);
      alert(error.message || '일정 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!detailData.projectId || !detailData.id) return;

    const isConfirm = window.confirm('정말 이 일정을 삭제하시겠습니까?');
    if (!isConfirm) return;

    try {
      setIsLoading(true);
      const response = await apiClient.delete(
        `/projects/${detailData.projectId}/schedules/${detailData.id}`
      );
      
      if (response.data && response.data.isSuccess) {
        alert(response.data.message || '일정 삭제가 완료되었습니다.');
        if (onDeleteEvent) {
          onDeleteEvent(detailData.id);
        }
        onClose();
      }
    } catch (error) {
      console.error('일정 삭제 실패:', error);
      alert(error.message || '일정 삭제에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="edm-overlay" onClick={onClose}>
      <div className="edm-container" onClick={(e) => e.stopPropagation()}>
        <div className="edm-header">
          {isEditing ? (
            <div className="edm-header-actions">
              <button type="button" className="edm-btn edm-cancel-btn" onClick={() => setIsEditing(false)} disabled={isLoading}>
                취소
              </button>
              <button type="button" className="edm-btn edm-save-btn" onClick={handleUpdate} disabled={isLoading}>
                저장
              </button>
            </div>
          ) : (
            <>
              {detailData.projectId && (
                <div className="edm-more-container">
                  <button type="button" className="edm-more-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <span className="edm-more-icon"></span>
                  </button>

                  {isMenuOpen && (
                    <div className="edm-dropdown-menu">
                      <button type="button" className="edm-dropdown-item" onClick={startEdit}>
                        수정
                      </button>
                      <button type="button" className="edm-dropdown-item delete" onClick={handleDelete} disabled={isLoading}>
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              )}
              <button type="button" className="edm-close-btn" onClick={onClose} aria-label="닫기">
                ✕
              </button>
            </>
          )}
        </div>
        
        <div className="edm-body">
          {isEditing ? (
            <>
              <input className="edm-edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="일정 제목" />
              <div className="edm-info">
                {detailData.projectTitle && (
                  <div className="edm-info-row">
                    <span className="edm-info-label">프로젝트</span>
                    <span className="edm-info-value">{detailData.projectTitle}</span>
                  </div>
                )}
                <div className="edm-info-row">
                  <span className="edm-info-label">날짜</span>
                  <div className="edm-edit-date-group">
                    <input type="date" className="edm-edit-date" value={editStartDate} onChange={(e) => setEditStartDate(e.target.value)} />
                    <span>~</span>
                    <input type="date" className="edm-edit-date" value={editEndDate} onChange={(e) => setEditEndDate(e.target.value)} />
                  </div>
                </div>
                <div className="edm-divider" />
                <div className="edm-content-wrapper">
                  <textarea className="edm-edit-content" value={editContent} onChange={(e) => setEditContent(e.target.value)} placeholder="일정 내용" />
                </div>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default EventDetailModal;