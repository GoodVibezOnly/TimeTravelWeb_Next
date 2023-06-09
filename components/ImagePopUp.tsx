import React from "react";
import Image from "next/image";

interface Props {
  onClose: () => void;
  image: string;
}

const ImagePopUp: React.FC<Props> = ({ onClose, image }) => {
  const handleClick = () => {
    onClose();
  };

  return (
    <div className="backdrop" onClick={handleClick}>
      <div className="imageContainer">
        <Image src={image} alt="Full-screen image" className="fullscreenImage" width={512} height={512}/>
        <div className="closeButtonContainer">
          <button className="closeButton" onClick={handleClick}>
            <span className="closeSymbol">✕</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePopUp;
