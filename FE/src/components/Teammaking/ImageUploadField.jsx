import { useRef } from "react";

const ImageIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#aaaaaa"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

function ImageUploadField({ imageSrc, onImageChange }) {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = ({ target }) => {
      onImageChange(target?.result ?? null);
    };
    fileReader.readAsDataURL(file);
  };

  return (
    <div className="image-upload-wrapper">
      <div
        className="image-upload-circle"
        onClick={handleImageClick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleImageClick();
          }
        }}
        role="button"
        tabIndex={0}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="프로젝트 이미지"
            className="image-preview"
          />
        ) : (
          <ImageIcon />
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}

export default ImageUploadField;
