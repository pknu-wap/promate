import React, { useState } from 'react';

function PostDetailModal({
  isOpen,
  post,
  isLoading,
  error,
  onClose,
  onEdit,
  onDelete
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isOpen || !post) return null;

  return (
    <div 
      className="team-detail-overlay" 
      role="presentation" 
      onMouseDown={onClose}
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1000
      }}
    >
      <article
        className="team-detail-container"
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="team-detail-header">
          <div className="team-detail-more-container">
            <button
              type="button"
              className="team-detail-more-btn"
              aria-label="게시글 메뉴"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <span className="team-detail-more-icon"></span>
            </button>
            {isMenuOpen && (
              <div className="team-detail-dropdown-menu">
                <button type="button" className="team-detail-dropdown-item" onClick={() => { setIsMenuOpen(false); onEdit(); }}>
                  수정
                </button>
                <button type="button" className="team-detail-dropdown-item delete" onClick={() => { setIsMenuOpen(false); onDelete(); }}>
                  삭제
                </button>
              </div>
            )}
          </div>
          <button type="button" className="team-detail-close-btn" onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </div>

        <div className="team-detail-body">
          {isLoading && <p className="team-member-status">처리 중...</p>}
          {error && <p className="team-member-status" style={{ color: 'red' }}>{error}</p>}

          {!isLoading && !error && post.title && (
            <>
              <h2 className="team-detail-title">{post.title}</h2>
              
              <div className="team-detail-info">
                <div className="team-detail-info-row">
                  <span className="team-detail-info-label">작성자</span>
                  <span className="team-detail-info-value">{post.writerName}</span>
                </div>
              </div>
              
              <div className="team-detail-divider" />
              
              <div className="team-detail-content-wrapper">
                <p className="team-detail-content">{post.content}</p>
              </div>
            </>
          )}
        </div>
      </article>
    </div>
  );
}

export default PostDetailModal;