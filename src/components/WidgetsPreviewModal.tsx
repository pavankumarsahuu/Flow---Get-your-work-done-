import React from 'react';
import { Task } from '../types';

interface WidgetsPreviewModalProps {
  isOpen: boolean;
  tasks: Task[];
  onClose: () => void;
  onOpenQuickAdd: () => void;
  onStartFocus: (task: Task) => void;
}

export const WidgetsPreviewModal: React.FC<WidgetsPreviewModalProps> = ({
  isOpen,
  tasks,
  onClose,
  onOpenQuickAdd,
  onStartFocus,
}) => {
  if (!isOpen) return null;

  const focusTasks = tasks.filter(
    (t) => t.isFocusRecommended && t.status !== 'completed'
  );
  const nextTask = focusTasks[0] || tasks[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#f0eded] rounded-3xl border border-[#e5e2e1] p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#293ca0] text-[22px]">
              widgets
            </span>
            <h2 className="text-[18px] font-semibold text-[#1c1b1b]">
              Android Home Screen Widgets
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#757684] hover:text-[#1c1b1b] p-1"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="text-[12px] text-[#454652]">
          Flow provides 3 glanceable Material 3 widgets designed to keep you focused without opening the app:
        </p>

        {/* 1. Small Widget (2x2) */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-[#757684] uppercase tracking-wider">
            1. Small Widget (2x2) · Next Task
          </span>
          <div className="w-48 h-36 bg-white rounded-3xl p-3.5 border border-[#e5e2e1] shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#293ca0] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4355b9]" />
                Next Task
              </span>
              <span className="text-[10px] text-[#757684]">
                {nextTask?.estimatedDuration || 25}m
              </span>
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#1c1b1b] line-clamp-2 leading-snug">
                {nextTask?.title || 'Finish landing page copy'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (nextTask) onStartFocus(nextTask);
                onClose();
              }}
              className="w-full py-1.5 rounded-xl bg-[#4355b9] text-white text-[11px] font-semibold flex items-center justify-center gap-1 hover:bg-[#293ca0]"
            >
              <span className="material-symbols-outlined text-[13px]">play_arrow</span>
              <span>Focus</span>
            </button>
          </div>
        </div>

        {/* 2. Medium Widget (4x2) */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[11px] font-semibold text-[#757684] uppercase tracking-wider">
            2. Medium Widget (4x2) · Today Agenda
          </span>
          <div className="w-full bg-white rounded-3xl p-3.5 border border-[#e5e2e1] shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#293ca0] text-[16px]">
                  today
                </span>
                <span className="text-[12px] font-bold text-[#1c1b1b]">Flow · Today</span>
              </div>
              <span className="text-[10px] text-[#757684]">
                {focusTasks.length} focus items
              </span>
            </div>
            <div className="space-y-1">
              {focusTasks.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between text-[12px] p-1.5 rounded-lg bg-[#f6f3f2]"
                >
                  <span className="truncate text-[#1c1b1b] font-medium flex-1">
                    ○ {t.title}
                  </span>
                  <span className="text-[10px] text-[#757684] ml-2 shrink-0">
                    {t.estimatedDuration}m
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Large Widget (4x4) */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[11px] font-semibold text-[#757684] uppercase tracking-wider">
            3. Large Widget (4x4) · Today&apos;s Focus + Quick Add
          </span>
          <div className="w-full bg-white rounded-3xl p-4 border border-[#e5e2e1] shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#4355b9] text-[18px]">
                  auto_awesome
                </span>
                <span className="text-[13px] font-bold text-[#1c1b1b]">
                  Today&apos;s Focus
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenQuickAdd();
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#dee0ff] text-[#293ca0] text-[11px] font-semibold hover:bg-[#bac3ff]"
              >
                <span className="material-symbols-outlined text-[13px]">add</span>
                <span>Add task</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {focusTasks.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="p-2 rounded-xl border border-[#e5e2e1] flex items-center justify-between"
                >
                  <div>
                    <p className="text-[12px] font-medium text-[#1c1b1b]">{t.title}</p>
                    <span className="text-[10px] text-[#757684]">
                      {t.projectId} • {t.estimatedDuration}m
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#293ca0] bg-[#dee0ff] px-1.5 py-0.5 rounded">
                    Recommended
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
