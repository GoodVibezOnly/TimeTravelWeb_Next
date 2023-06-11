import React, { useState, useEffect } from "react";

interface Props {
  onClose: () => void;
  image: string;
  year: number;
  showOriginal: boolean;
}

const ImagePopUp: React.FC<Props> = ({ onClose, image, year, showOriginal }) => {
  const [showCloseButton, setShowCloseButton] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleMouseMove = () => {
      setShowCloseButton(true);
      clearTimeout(timeoutId!);
      timeoutId = setTimeout(() => {
        setShowCloseButton(false);
      }, 1000);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeoutId!);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleClick = () => {
    onClose();
  };

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.stopPropagation();
  };

  return (
    <div className="backdrop" onClick={handleClick}>
      <div className="imageContainer">
        <div className="imageContainerWrapper">
          {image && (
            <img
              src={image}
              alt="Full-screen image"
              className="fullscreenImage"
              onClick={handleImageClick}
            />
          )}

          {showOriginal ? (
            <div className="year">Original Image</div>
          ) : (
            <div className="year">{year}</div>
          )}
          {showCloseButton && <div className="topGradient" />}
        </div>

        <div className={`closeButtonContainer ${showCloseButton ? "fadeIn" : ""}`}>
          <button className="closeButton" onClick={handleClick}>
            <span className="closeSymbol">✕</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePopUp;
