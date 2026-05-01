import "./Badge.css";

function Badge({
  children,
  selected = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) {
  const classes = ["badge", selected ? "badge--selected" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
}

export default Badge;
