import React, { useState, useEffect } from 'react';
import { AIService, ActionabilityResult } from '../services/aiService';

interface AIActionabilityModalProps {
  taskTitle: string;
  isOpen: boolean;
  isOffline: boolean;
  onClose: () => void;
  onSelectAlternative: (newTitle: string) => void;
}

export const AIActionabilityModal: React.FC<AIActionabilityModalProps> = ({
  taskTitle,
  isOpen,
  isOffline,
  onClose,
  onSelectAlternative,
}) => {
  const [data, setData] = useState<ActionabilityResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !taskTitle) return;
    setIsLoading(true);
    AIService.makeActionable(taskTitle, isOffline)
      .then((res) => setData(res))
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [isOpen, taskTitle, isOffline]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-xl mx-auto bg-white rounded-t-[28px] border-t border-[#e5e2e1] p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
        <div className="w-full flex justify-center pb-1">
          <div className="w-10 h-1 bg-[#e5e2e1] rounded-full" />
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#293ca0] text-[20px] material-symbols-fill">
              psychology
            </span>
            <h2 className="text-[17px] font-semibold text-[#1c1b1b]">
              This task may be too vague to start
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
          Vague intentions cause postponement. Select a concrete, observable next action for{' '}
          <span className="font-semibold text-[#1c1b1b]">&ldquo;{taskTitle}&rdquo;</span>:
        </p>

        {isLoading ? (
          <div className="p-6 text-center text-[13px] text-[#757684] flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[#293ca0] animate-spin text-[18px]">
              progress_activity
            </span>
            <span>Synthesizing concrete next actions...</span>
          </div>
        ) : (
          <div className="space-y-2">
            {data?.concreteAlternatives.map((alt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSelectAlternative(alt);
                  onClose();
                }}
                className="w-full p-3 bg-[#f6f3f2] hover:bg-[#dee0ff] text-left rounded-xl border border-[#e5e2e1] hover:border-[#293ca0] transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#4355b9]" />
                  <span className="text-[13px] text-[#1c1b1b] font-medium group-hover:text-[#00105c]">
                    {alt}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#757684] group-hover:text-[#00105c]">
                  arrow_forward
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-center text-[#757684] hover:bg-[#f6f3f2] rounded-xl text-[12px] font-semibold"
          >
            Keep &ldquo;{taskTitle}&rdquo; as is
          </button>
        </div>
      </div>
    </div>
  );
};
