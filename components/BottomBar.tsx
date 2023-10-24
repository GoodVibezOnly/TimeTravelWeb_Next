"use client";

import React, { useEffect, useState } from "react";
import TextPopUp from "./TextPopUp";

interface BottomBarProps {
  version: string;
}

const BottomBar: React.FC<BottomBarProps> = ({ version }) => {
  const [creditsPopUpOpen, setCreditsPopUpOpen] = useState<boolean>(false);
  const [PopUpOpen, setPopUpOpen] = useState<boolean>(false);
  function handlesetCreditsPopUpOpen() {
    setCreditsPopUpOpen(true);
  }
  const handleClose = () => {
    setCreditsPopUpOpen(false);
  };

  // if esc key is pressed close TextPopUp
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPopUpOpen(false);
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [PopUpOpen]);

  return (
    <div>
      <div className="bottom-bar absolute right-0 bottom-0 text-white py-2 px-4">
        <span className="text-sm">Version: {version}</span>
      </div>
      <div>
        <button
          onClick={() => setCreditsPopUpOpen(true)}
          className="bottom-bar absolute left-0 bottom-0 text-white py-2 px-4"
        >
          About
        </button>
        {creditsPopUpOpen ? <TextPopUp onClose={handleClose} /> : null}
      </div>
    </div>
  );
};

export default BottomBar;
