function ProjectNameField({ projectName, onProjectNameChange }) {
  return (
    <div className="form-field">
      <label className="form-label">프로젝트 이름</label>
      <input
        type="text"
        className="text-input"
        value={projectName}
        onChange={(event) => onProjectNameChange(event.target.value)}
        placeholder="프로젝트 이름을 입력하세요"
      />
    </div>
  );
}

export default ProjectNameField;
