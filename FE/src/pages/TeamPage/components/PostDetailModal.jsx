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
    <div className="team-post-detail-backdrop" role="presentation" onMouseDown={onClose}>
      <article
        className="team-post-detail-modal"
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="team-post-detail-menu-container" style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <button
            type="button"
            className="team-post-detail-menu"
            aria-label="게시글 메뉴"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            ...
          </button>
          {isMenuOpen && (
            <div className="team-post-dropdown" style={{ position: 'absolute', right: 0, background: '#fff', border: '1px solid #ccc', borderRadius: '4px', zIndex: 10 }}>
              <button type="button" onClick={() => { setIsMenuOpen(false); onEdit(); }} style={{ display: 'block', width: '100%', padding: '8px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}>수정</button>
              <button type="button" onClick={() => { setIsMenuOpen(false); onDelete(); }} style={{ display: 'block', width: '100%', padding: '8px 16px', border: 'none', background: 'none', textAlign: 'left', color: 'red', cursor: 'pointer' }}>삭제</button>
            </div>
          )}
        </div>

        {isLoading && <div className="team-member-status">처리 중...</div>}
        {error && <div className="team-member-status" style={{ color: 'red' }}>{error}</div>}

        {!isLoading && !error && post.title && (
          <>
            <h2 id="team-post-detail-title">{post.title}</h2>
            <dl className="team-post-detail-meta">
              <dt>작성자</dt>
              <dd>{post.writerName}</dd>
            </dl>
            <p>{post.content}</p>
          </>
        )}
      </article>
    </div>
  );
}

export default PostDetailModal;