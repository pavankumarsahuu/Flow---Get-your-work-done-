import React from 'react';
import { Task } from '../types';

interface DailyReviewModalProps {
  isOpen: boolean;
  tasks: Task[];
  onClose: () => void;
  onBreakdownTask: (taskTitle: string) => void;
}

export const DailyReviewModal: React.FC<DailyReviewModalProps> = ({
  isOpen,
  tasks,
  onClose,
  onBreakdownTask,
}) => {
  if (!isOpen) return null;

  const completed = tasks.filter((t) => t.status === 'completed').length;
  const overdue = tasks.filter((t) => t.postponedCount > 0 && t.status !== 'completed').length;
  const carriedOver = 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#e5e2e1] p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#293ca0] text-[20px] material-symbols-fill">
              wb_twilight
            </span>
            <h2 className="text-[18px] font-semibold text-[#1c1b1b]">Evening Review</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#757684] hover:text-[#1c1b1b] p-1"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#f6f3f2] p-3 rounded-2xl border border-[#e5e2e1]">
            <span className="text-[20px] font-bold text-[#293ca0] block">{completed}</span>
            <span className="text-[11px] text-[#757684] uppercase font-semibold">Completed</span>
          </div>
          <div className="bg-[#f6f3f2] p-3 rounded-2xl border border-[#e5e2e1]">
            <span className="text-[20px] font-bold text-[#454652] block">{carriedOver}</span>
            <span className="text-[11px] text-[#757684] uppercase font-semibold">Moved</span>
          </div>
          <div className="bg-[#f6f3f2] p-3 rounded-2xl border border-[#e5e2e1]">
            <span className="text-[20px] font-bold text-[#ba1a1a] block">{overdue}</span>
            <span className="text-[11px] text-[#757684] uppercase font-semibold">Overdue</span>
          </div>
        </div>

        {/* AI Non-judgmental Summary */}
        <div className="bg-[#EEF1FC] p-3.5 rounded-2xl border border-[#dee0ff] space-y-2">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#293ca0]">
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            <span>Flow Insight</span>
          </div>
          <p className="text-[13px] text-[#1c1b1b] leading-relaxed">
            You completed most of today&apos;s important work. The &ldquo;Finish pitch deck outline&rdquo;
            has been postponed twice. Want to break it down into smaller steps?
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              onBreakdownTask('Finish pitch deck outline');
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-[#4355b9] text-white text-[13px] font-semibold hover:bg-[#293ca0] transition-colors active:scale-95"
          >
            Break it down
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-xl text-[#757684] hover:bg-[#f6f3f2] text-[13px] font-semibold transition-colors active:scale-95"
          >
            Keep as is
          </button>
        </div>
      </div>
    </div>
  );
};
