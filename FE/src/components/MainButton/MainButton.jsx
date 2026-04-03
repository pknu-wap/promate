import "./MainButton.css";

function MainButton({
  children,
  onClick,
  disabled = false,
  type = "button",
  size = "md",
  fullWidth = false,
}) {
  return (
    <button
      type={type}
      className={`main-btn ${size} ${fullWidth ? "full-width" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default MainButton;