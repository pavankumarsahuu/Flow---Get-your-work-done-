import React from 'react';
import { NavigationTab } from '../types';

interface BottomNavBarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  inboxCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
  inboxCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 h-16 max-w-xl mx-auto bg-[#fcf9f8]/95 backdrop-blur-md border-t border-[#e5e2e1]">
      {/* 1. Today */}
      <button
        onClick={() => onSelectTab('today')}
        aria-label="Today"
        title="Today view"
        className={`flex items-center justify-center rounded-full px-5 py-1.5 transition-all duration-150 active:scale-95 ${
          currentTab === 'today'
            ? 'bg-[#e5e2e1] text-[#293ca0]'
            : 'text-[#454652] hover:bg-[#f6f3f2]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[21px] ${
            currentTab === 'today' ? 'material-symbols-fill' : ''
          }`}
        >
          today
        </span>
      </button>

      {/* 2. Inbox */}
      <button
        onClick={() => onSelectTab('inbox')}
        aria-label="Inbox"
        title="Inbox"
        className={`relative flex items-center justify-center rounded-full px-5 py-1.5 transition-all duration-150 active:scale-95 ${
          currentTab === 'inbox'
            ? 'bg-[#e5e2e1] text-[#293ca0]'
            : 'text-[#454652] hover:bg-[#f6f3f2]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[21px] ${
            currentTab === 'inbox' ? 'material-symbols-fill' : ''
          }`}
        >
          inbox
        </span>
        {inboxCount > 0 && (
          <span className="absolute top-1 right-3 text-[10px] font-bold bg-[#293ca0] text-white px-1 min-w-[15px] h-[15px] flex items-center justify-center rounded-full leading-none shadow-xs">
            {inboxCount}
          </span>
        )}
      </button>

      {/* 3. Projects */}
      <button
        onClick={() => onSelectTab('projects')}
        aria-label="Projects"
        title="Projects"
        className={`flex items-center justify-center rounded-full px-5 py-1.5 transition-all duration-150 active:scale-95 ${
          currentTab === 'projects'
            ? 'bg-[#e5e2e1] text-[#293ca0]'
            : 'text-[#454652] hover:bg-[#f6f3f2]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[21px] ${
            currentTab === 'projects' ? 'material-symbols-fill' : ''
          }`}
        >
          folder
        </span>
      </button>

      {/* 4. AI / Flow AI */}
      <button
        onClick={() => onSelectTab('ai')}
        aria-label="Flow AI Assistant"
        title="Flow AI"
        className={`flex items-center justify-center rounded-full px-5 py-1.5 transition-all duration-150 active:scale-95 ${
          currentTab === 'ai'
            ? 'bg-[#dee0ff] text-[#293ca0]'
            : 'text-[#454652] hover:bg-[#f6f3f2]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[21px] ${
            currentTab === 'ai' ? 'material-symbols-fill text-[#293ca0]' : ''
          }`}
        >
          auto_awesome
        </span>
      </button>
    </nav>
  );
};
