function ProjectDescriptionField({ description, onDescriptionChange }) {
  return (
    <div className="form-field">
      <label className="form-label">프로젝트 설명</label>
      <textarea
        className="textarea-input"
        value={description}
        onChange={(event) => onDescriptionChange(event.target.value)}
        placeholder="프로젝트를 간단하게 소개해 주세요"
      />
    </div>
  );
}

export default ProjectDescriptionField;
