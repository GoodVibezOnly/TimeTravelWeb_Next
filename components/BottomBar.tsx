import React, { useEffect } from "react";
import TextPopUp from './TextPopUp';

interface BottomBarProps {
    onClose: () => void;
  version: string;
}

const BottomBar: React.FC<BottomBarProps> = ({ onClose, version }) => {

  return (
    <div>
        <TextPopUp></TextPopUp>
      <div className="bottom-bar absolute right-0 bottom-0 text-white py-2 px-4">
        <span className="text-sm">Version: {version}</span>
      te</div>
      <div className="bottom-bar absolute left-0 bottom-0 text-white py-2 px-4">
        <button className="text-sm">About</button>
      </div>
    </div>
  );
};

export default BottomBar;
