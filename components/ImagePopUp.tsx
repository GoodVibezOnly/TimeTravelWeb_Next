import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Props {
  onClose: () => void;
  image: string;
}

const ImagePopUp: React.FC<Props> = ({ onClose, image }) => {
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

  const handleClick = () => {
    onClose();
  };

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.stopPropagation();
  };

  return (
    <div className="backdrop" onClick={handleClick}>
      <div className="imageContainer">
        {/* check if image or if base64 */}
        {image.includes("data:image") ? (
          <div className="imageContainerWrapper">
            <Image
              src={image}
              alt="Full-screen image"
              className="fullscreenImage"
              width={512}
              height={512}
              onClick={handleImageClick}
            />
            {/* if showCloseButton true, show topGradient and black box */}
            {showCloseButton && (
              <>
                <div className="topGradient" />
                <div className="blackBox" />
              </>
            )}
          </div>
        ) : (
          <div className="imageContainerWrapper">
            <Image
              src={image}
              alt="Full-screen image"
              className="fullscreenImage"
              width={512}
              height={512}
              onClick={handleImageClick}
            />
            {/* if showCloseButton true, show topGradient and black box */}
            {showCloseButton && (
              <>
                <div className="topGradient" />
                <div className="blackBox" />
              </>
            )}
          </div>
        )}
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
