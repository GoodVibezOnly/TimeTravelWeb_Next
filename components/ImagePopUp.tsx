import React from "react";

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
          <img src={image} alt="Full-screen image" className="fullscreenImage"/>
      </div>
    );
  };

export default ImagePopUp;
