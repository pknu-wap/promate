function FormActions({ onCancel, onSubmit, isSubmitEnabled }) {
  return (
    <div className="bottom-bar">
      <div className="teammaking-actions">
        <button type="button" className="teammaking-btn-cancel" onClick={onCancel}>
          취소
        </button>
        <button
          type="button"
          className="teammaking-btn-submit"
          onClick={onSubmit}
          disabled={!isSubmitEnabled}
        >
          생성하기
        </button>
      </div>
    </div>
  );
}

export default FormActions;
