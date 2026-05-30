import "./Avatar.css";

function Avatar({
  src,
  alt = "avatar",
  size = "md",
  shape = "circle",
  icon = null,
  className = "",
}) {
  const classes = [
    "avatar",
    `avatar--${size}`,
    `avatar--${shape}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {src ? (
        <img className="avatar__image" src={src} alt={alt} />
      ) : (
        <div className="avatar__placeholder" aria-label={alt} role="img">
          {icon ?? (
            <svg
              className="avatar__placeholder-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="6.5" y="6.5" width="11" height="11" rx="1.5" />
              <path d="M8.5 15.5L11 12.8L12.8 14.7L15.5 11.5" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
}

export default Avatar;
