import React from 'react';
import { Task } from '../types';

interface WeeklyReviewModalProps {
  isOpen: boolean;
  tasks: Task[];
  onClose: () => void;
  onMakeActionable: (taskTitle: string) => void;
}

export const WeeklyReviewModal: React.FC<WeeklyReviewModalProps> = ({
  isOpen,
  tasks,
  onClose,
  onMakeActionable,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#e5e2e1] p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#293ca0] text-[20px] material-symbols-fill">
              calendar_view_week
            </span>
            <h2 className="text-[18px] font-semibold text-[#1c1b1b]">Weekly Review</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#757684] hover:text-[#1c1b1b] p-1"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="text-[13px] text-[#454652]">
          Patterns detected over the past 7 days to help optimize next week:
        </p>

        <div className="space-y-2.5">
          <div className="bg-[#f6f3f2] p-3 rounded-2xl border border-[#e5e2e1] space-y-1">
            <div className="flex items-center justify-between text-[12px] font-semibold">
              <span className="text-[#1c1b1b]">Tasks Completed</span>
              <span className="text-[#293ca0]">18 tasks</span>
            </div>
            <p className="text-[11px] text-[#757684]">
              High completion rate on morning focus blocks (10:00 - 12:00 PM).
            </p>
          </div>

          <div className="bg-[#fff4e5] p-3.5 rounded-2xl border border-[#ffd8a8] space-y-2">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#d9480f]">
              <span className="material-symbols-outlined text-[16px]">sync_problem</span>
              <span>Repeated Postponement</span>
            </div>
            <p className="text-[13px] text-[#1c1b1b]">
              You postponed &ldquo;Update DNS configuration&rdquo; 5 times. It may be too large or
              unclear to start.
            </p>
            <button
              type="button"
              onClick={() => {
                onMakeActionable('Update DNS configuration');
                onClose();
              }}
              className="text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-white border border-[#ffd8a8] text-[#d9480f] hover:bg-[#ffe8cc] transition-colors"
            >
              Make Actionable
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#f6f3f2] hover:bg-[#eae7e7] text-[13px] font-semibold text-[#1c1b1b]"
        >
          Close Review
        </button>
      </div>
    </div>
  );
};
