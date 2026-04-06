import "./ProgressBar.css";

function ProgressBar({ percent = 0, ...props }) {
  const safePercent = Math.min(Math.max(percent, 0), 100);

  return (
    <div className="progress-bar" {...props}>
      <div
        className="progress-fill"
        style={{ width: `${safePercent}%` }}
      />
    </div>
  );
}

export default ProgressBar;