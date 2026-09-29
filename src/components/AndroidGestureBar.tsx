import React from 'react';

interface AndroidGestureBarProps {
  dark?: boolean;
}

export const AndroidGestureBar: React.FC<AndroidGestureBarProps> = ({ dark = false }) => {
  return (
    <div className="w-full flex justify-center py-2 pointer-events-none z-50">
      <div
        className={`w-32 h-1 rounded-full ${
          dark ? 'bg-white/30' : 'bg-[#1c1b1b]/20'
        }`}
      />
    </div>
  );
};
