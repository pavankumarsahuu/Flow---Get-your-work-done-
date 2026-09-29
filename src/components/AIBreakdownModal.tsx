import React, { useState, useEffect } from 'react';
import { AIService, TaskBreakdownResult } from '../services/aiService';

interface AIBreakdownModalProps {
  taskTitle: string;
  isOpen: boolean;
  isOffline: boolean;
  onClose: () => void;
  onApplyBreakdown: (steps: string[]) => void;
}

export const AIBreakdownModal: React.FC<AIBreakdownModalProps> = ({
  taskTitle,
  isOpen,
  isOffline,
  onClose,
  onApplyBreakdown,
}) => {
  const [data, setData] = useState<TaskBreakdownResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSteps, setSelectedSteps] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen || !taskTitle) return;
    setIsLoading(true);
    AIService.breakDownTask(taskTitle, undefined, isOffline)
      .then((res) => {
        setData(res);
        setSelectedSteps(res.steps);
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [isOpen, taskTitle, isOffline]);

  if (!isOpen) return null;

  const toggleStep = (step: string) => {
    if (selectedSteps.includes(step)) {
      setSelectedSteps(selectedSteps.filter((s) => s !== step));
    } else {
      setSelectedSteps([...selectedSteps, step]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-xl mx-auto bg-white rounded-t-[28px] border-t border-[#e5e2e1] p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Drag handle */}
        <div className="w-full flex justify-center pb-1">
          <div className="w-10 h-1 bg-[#e5e2e1] rounded-full" />
        </div>

        {/* Title */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#293ca0] text-[20px] material-symbols-fill">
              auto_awesome
            </span>
            <h2 className="text-[17px] font-semibold text-[#1c1b1b]">
              This looks like a larger task
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

        <p className="text-[13px] text-[#454652]">
          &ldquo;{taskTitle}&rdquo; has multiple moving steps. Breaking it down removes resistance
          and helps you start effortlessly:
        </p>

        {isLoading ? (
          <div className="p-6 text-center text-[13px] text-[#757684] flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[#293ca0] animate-spin text-[18px]">
              progress_activity
            </span>
            <span>Generating sequential next steps...</span>
          </div>
        ) : (
          <div className="space-y-2 bg-[#f6f3f2] p-3.5 rounded-2xl border border-[#e5e2e1]">
            <span className="text-[11px] font-semibold text-[#757684] uppercase tracking-wider block">
              Suggested Steps ({selectedSteps.length})
            </span>
            {data?.steps.map((step, idx) => (
              <label
                key={idx}
                className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-[#e5e2e1] cursor-pointer hover:border-[#4355b9] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedSteps.includes(step)}
                  onChange={() => toggleStep(step)}
                  className="rounded text-[#4355b9] focus:ring-0"
                />
                <span className="text-[13px] text-[#1c1b1b] font-medium flex-1">
                  {step}
                </span>
              </label>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              onApplyBreakdown(selectedSteps);
              onClose();
            }}
            disabled={selectedSteps.length === 0}
            className="flex-1 py-3 px-4 rounded-xl bg-[#4355b9] text-white text-[13px] font-semibold hover:bg-[#293ca0] transition-colors active:scale-95 disabled:opacity-50"
          >
            Break down into {selectedSteps.length} tasks
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-xl text-[#757684] hover:bg-[#f6f3f2] text-[13px] font-semibold transition-colors active:scale-95"
          >
            Keep as one task
          </button>
        </div>
      </div>
    </div>
  );
};
