import "./MainButton.css";

function MainButton({
  children,
  onClick,
  disabled = false,
  type = "button",
  size = "md",
}) {
  return (
    <button
      type={type}
      className={`main-btn ${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default MainButton;