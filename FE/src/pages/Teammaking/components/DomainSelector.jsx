import Badge from "../../../components/Badge/Badge.jsx";

function DomainSelector({ domainOptions, selectedDomain, onDomainChange }) {
  return (
    <div className="form-field">
      <label className="form-label">분야 설정</label>
      <div className="domain-tags">
        {domainOptions.map((option) => (
          <Badge
            key={option.id}
            selected={selectedDomain === option.id}
            onClick={() => onDomainChange(option.id)}
          >
            {option.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default DomainSelector;
