import './ProjectCard.css';

const ProjectCard = ({ name, role, status, score }) => {
  const isOngoing = status === '진행중';

  return (
    <div className="project-card-row">
      <div className="project-card-left">
        <span className="project-card-name">{name}</span>
        {role && <span className="project-card-role">{role}</span>}
      </div>

      <div className="project-card-right">
        <span className={`project-card-badge project-card-badge--${isOngoing ? 'active' : 'done'}`}>
          {status}
        </span>

        {score != null ? (
          <div className="project-card-score">
            <span className="project-card-score-num">{score.toFixed(1)}</span>
            <span className="project-card-score-label">점</span>
          </div>
        ) : (
          <div className="project-card-score-placeholder" />
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
