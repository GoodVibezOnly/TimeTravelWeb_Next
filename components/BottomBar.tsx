import React from 'react';

interface BottomBarProps {
  version: string;
}

const BottomBar: React.FC<BottomBarProps> = ({ version }) => {
  return (
    <div className="bottom-bar absolute right-0 bottom-0 text-white py-2 px-4">
      <span className="text-sm">Version: {version}</span>
    </div>
  );
};

export default BottomBar;
