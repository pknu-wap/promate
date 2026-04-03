import "./ProgressBar.css";

function ProgressBar({ percent = 0 }) {
  const safePercent = Math.min(Math.max(percent, 0), 100);

  return (
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${safePercent}%` }}
      />
    </div>
  );
}

export default ProgressBar;