import React from "react";

interface Props {
  onClose: () => void;
}

const ImagePopUp: React.FC<Props> = ({ onClose }) => {
  const handleClick = () => {
    onClose();
  };

  return <div className="backdrop" onClick={handleClick}></div>;
};

export default ImagePopUp;
