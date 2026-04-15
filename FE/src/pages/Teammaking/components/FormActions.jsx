function FormActions({ onCancel, onSubmit }) {
  return (
    <div className="bottom-bar">
      <div className="action-buttons">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          취소
        </button>
        <button type="button" className="btn-submit" onClick={onSubmit}>
          생성하기
        </button>
      </div>
    </div>
  );
}

export default FormActions;
