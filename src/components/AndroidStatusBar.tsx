import React, { useState, useEffect } from 'react';

interface AndroidStatusBarProps {
  dark?: boolean;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({ dark = false }) => {
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={`w-full pt-3 px-6 pb-1.5 flex justify-between items-center z-30 select-none ${
      dark ? 'text-white/80' : 'text-[#1c1b1b]'
    }`}>
      <span className="text-[13px] font-semibold tracking-tight">
        {time}
      </span>
      <div className="flex items-center space-x-1.5 opacity-90">
        <span className="material-symbols-outlined text-[15px]">wifi</span>
        <span className="material-symbols-outlined text-[15px]">signal_cellular_alt</span>
        <span className="material-symbols-outlined text-[16px]">battery_full</span>
      </div>
    </header>
  );
};
