import "./ProgressBar.css";

function ProgressBar({ percent = 0 }) {
  return (
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export default ProgressBar;