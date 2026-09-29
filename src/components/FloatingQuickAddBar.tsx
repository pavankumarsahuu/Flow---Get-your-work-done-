import React, { useState } from 'react';

interface FloatingQuickAddBarProps {
  onOpenQuickAdd: (initialText?: string) => void;
  onInstantAdd: (text: string) => void;
  onVoiceClick: () => void;
}

export const FloatingQuickAddBar: React.FC<FloatingQuickAddBarProps> = ({
  onOpenQuickAdd,
  onInstantAdd,
  onVoiceClick,
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      onOpenQuickAdd();
      return;
    }
    // If long sentence with natural language tokens, open the full QuickAdd sheet with extraction
    if (text.length > 20 || text.includes('tomorrow') || text.includes('~') || text.includes('min') || text.includes('afternoon')) {
      onOpenQuickAdd(text);
      setText('');
    } else {
      onInstantAdd(text.trim());
      setText('');
    }
  };

  return (
    <div className="fixed bottom-20 left-0 w-full px-4 z-30 max-w-xl mx-auto right-0 pointer-events-none">
      <form
        onSubmit={handleSubmit}
        className="pointer-events-auto w-full bg-[#ffffff] border border-[#e5e2e1] rounded-full py-1.5 pl-4 pr-1.5 flex items-center justify-between shadow-[0px_8px_24px_-4px_rgba(25,25,25,0.08)] hover:border-[#c5c5d4] transition-all"
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="material-symbols-outlined text-[#4355b9] text-[18px]">
            auto_awesome
          </span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => {
              // Open quick add if empty or user wants full sheet
            }}
            placeholder="Add task or thought... (NLP active)"
            className="w-full bg-transparent border-none p-0 text-[14px] text-[#1c1b1b] placeholder:text-[#757684] focus:ring-0 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onVoiceClick}
            aria-label="Voice input"
            title="Voice Capture"
            className="p-1.5 text-[#757684] hover:text-[#1c1b1b] rounded-full hover:bg-[#f6f3f2] transition-colors active:scale-90"
          >
            <span className="material-symbols-outlined text-[19px]">mic</span>
          </button>

          <button
            type="submit"
            aria-label="Add task"
            title="Create Task"
            className="w-8 h-8 rounded-full bg-[#293ca0] text-white flex items-center justify-center hover:bg-[#4355b9] transition-transform active:scale-95 shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
          </button>
        </div>
      </form>
    </div>
  );
};
