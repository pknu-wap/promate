import "./MainButton.css";

function MainButton({
  children,
  onClick,
  disabled = false,
  type = "button",
  size = "md",
  fullWidth = false,
  ...props
}) {
  return (
    <button
      type={type}
      className={`main-btn ${size} ${fullWidth ? "full-width" : ""}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default MainButton;