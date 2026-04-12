function DomainSelector({ domainOptions, selectedDomain, onDomainChange }) {
  return (
    <div className="form-field">
      <label className="form-label">도메인 설정</label>
      <div className="domain-tags">
        {domainOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`domain-tag ${selectedDomain === option.id ? "active" : "inactive"}`}
            onClick={() => onDomainChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DomainSelector;
