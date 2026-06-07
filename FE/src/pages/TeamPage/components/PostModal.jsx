import React from 'react';

function PostModal({
  isOpen,
  isEditMode,
  title,
  setTitle,
  content,
  setContent,
  onClose,
  onSubmit,
  isSubmitting
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="team-post-modal-backdrop" 
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
      <div
        className="team-post-modal"
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2>{isEditMode ? '게시글 수정' : '게시글 쓰기'}</h2>

        <label className="team-post-field">
          <span>제목</span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="제목을 적어주세요."
            disabled={isSubmitting}
          />
        </label>

        <label className="team-post-field">
          <span>내용</span>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="내용을 적어주세요."
            disabled={isSubmitting}
          />
        </label>

        <div className="team-post-modal-actions">
          <button type="button" className="team-post-cancel-button" onClick={onClose} disabled={isSubmitting}>
            취소
          </button>
          <button type="button" className="team-post-create-button" onClick={onSubmit} disabled={!(title || '').trim() || !(content || '').trim() || isSubmitting}>
            {isSubmitting ? '저장 중...' : isEditMode ? '수정 완료' : '게시글 생성'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostModal;