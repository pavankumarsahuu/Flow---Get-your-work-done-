import React, { useState, useEffect } from 'react';
import { Task, Subtask } from '../types';

interface FocusModeViewProps {
  task: Task;
  onExit: () => void;
  onCompleteTask: (taskId: string) => void;
  onSubtaskToggle: (taskId: string, subtaskId: string) => void;
}

export const FocusModeView: React.FC<FocusModeViewProps> = ({
  task,
  onExit,
  onCompleteTask,
  onSubtaskToggle,
}) => {
  const totalSeconds = (task.estimatedDuration || 25) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(21 * 60 + 40); // 21:40 as in Image 5
  const [isPaused, setIsPaused] = useState(false);
  const [showAiSuggestion, setShowAiSuggestion] = useState(true);
  const [soundscapeActive, setSoundscapeActive] = useState(false);
  const [scratchpadText, setScratchpadText] = useState('');
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);

  // Active timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  // SVG ring stroke dash
  const radius = 100;
  const circumference = 2 * Math.PI * radius; // ~628
  const progress = totalSeconds > 0 ? (totalSeconds - secondsRemaining) / totalSeconds : 0;
  const strokeDashoffset = circumference - progress * circumference;

  const handleAddFiveMin = () => {
    setSecondsRemaining((prev) => prev + 300);
  };

  const handleComplete = () => {
    onCompleteTask(task.id);
    onExit();
  };

  const defaultSubtasks: Subtask[] =
    task.subtasks.length > 0
      ? task.subtasks
      : [
          { id: 'sub-1', title: 'Review competitor value props', completed: true },
          { id: 'sub-2', title: 'Draft 3 hero headline options', completed: false },
          { id: 'sub-3', title: 'Write CTA microcopy', completed: false },
        ];

  return (
    <main className="w-full max-w-xl mx-auto min-h-screen bg-[#fcf9f8] text-[#1c1b1b] flex flex-col justify-between relative overflow-hidden px-4 pt-4 pb-2 animate-in fade-in duration-200">
      {/* Header: Exit, DND indicator, Soundscape toggle */}
      <header className="w-full flex justify-between items-center text-[#757684] pt-1 pb-2">
        <button
          type="button"
          onClick={onExit}
          aria-label="Exit Focus Session"
          className="w-10 h-10 -ml-1.5 flex items-center justify-center rounded-full text-[#757684] hover:bg-[#eae7e7] transition-colors active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f6f3f2] border border-[#e5e2e1] text-[#757684]">
          <span className="material-symbols-outlined text-[15px] text-[#384665]">
            do_not_disturb_on
          </span>
          <span className="text-[11px] font-medium tracking-tight">Do Not Disturb active</span>
        </div>

        <button
          type="button"
          onClick={() => setSoundscapeActive(!soundscapeActive)}
          aria-label="Soundscape Options"
          title={soundscapeActive ? 'Soundscape Playing' : 'Enable Calm White Noise'}
          className={`w-10 h-10 -mr-1.5 flex items-center justify-center rounded-full transition-colors active:scale-95 cursor-pointer ${
            soundscapeActive
              ? 'bg-[#dee0ff] text-[#293ca0]'
              : 'text-[#757684] hover:bg-[#eae7e7]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {soundscapeActive ? 'volume_up' : 'graphic_eq'}
          </span>
        </button>
      </header>

      {/* Central Focus Canvas */}
      <section className="flex-1 flex flex-col items-center justify-center py-2 w-full">
        {/* Project Tag */}
        <div className="mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f0eded] text-[#454652] text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4355b9]" />
            <span>Work · Marketing</span>
          </span>
        </div>

        {/* Task Title */}
        <h1 className="text-[24px] font-bold text-center text-[#1c1b1b] max-w-[340px] leading-tight tracking-tight mb-6">
          {task.title}
        </h1>

        {/* Minimalist Circular Countdown Timer (Matching Image 5.png) */}
        <div className="relative w-60 h-60 flex items-center justify-center mb-6 breath-animation">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 220 220">
            {/* Background Base Ring */}
            <circle
              className="text-[#e5e2e1]"
              cx="110"
              cy="110"
              fill="transparent"
              r="100"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            {/* Active Remaining Ring */}
            <circle
              className="text-[#4355b9] transition-all duration-1000 ease-linear"
              cx="110"
              cy="110"
              fill="transparent"
              r="100"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="3.5"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: isNaN(strokeDashoffset) ? 84 : strokeDashoffset,
              }}
            />
          </svg>

          {/* Timer Center Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[38px] font-semibold tracking-tighter text-[#1c1b1b]">
              {timeFormatted}
            </span>
            <span className="text-[11px] text-[#757684] mt-0.5">
              of {task.estimatedDuration || 25}:00 session
            </span>
          </div>
        </div>

        {/* AI Assistant Micro-Prompt Pill (Matching Image 5.png) */}
        {showAiSuggestion && (
          <div className="w-full max-w-sm mb-4">
            <div className="bg-[#EEF1FC] border border-[#bac3ff]/70 rounded-xl px-3.5 py-2.5 flex items-start gap-2.5 shadow-xs">
              <span className="material-symbols-outlined text-[#293ca0] text-[18px] mt-0.5 material-symbols-fill">
                auto_awesome
              </span>
              <div className="flex-1">
                <span className="text-[11px] text-[#293ca0] font-semibold block">
                  Suggested next step
                </span>
                <p className="text-[13px] text-[#1c1b1b] mt-0.5">
                  {task.aiMetadata?.suggestedNextStep ||
                    'Draft headline alternatives for hero section'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAiSuggestion(false)}
                aria-label="Dismiss suggestion"
                className="text-[#757684] hover:text-[#1c1b1b] transition-colors p-0.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          </div>
        )}

        {/* Subtasks Micro-List */}
        <div className="w-full max-w-sm bg-[#f6f3f2] border border-[#e5e2e1] rounded-xl p-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#e5e2e1]/60">
            <span className="text-[11px] text-[#757684] tracking-wider uppercase font-semibold">
              Subtasks ({defaultSubtasks.filter((s) => s.completed).length}/
              {defaultSubtasks.length})
            </span>
            <span className="text-[11px] text-[#757684]">Focus queue</span>
          </div>

          <div className="space-y-1.5 mt-2">
            {defaultSubtasks.map((sub, idx) => (
              <label
                key={sub.id}
                className={`flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  sub.completed
                    ? 'hover:bg-[#eae7e7]'
                    : idx === 1
                    ? 'bg-white border border-[#e5e2e1] shadow-xs'
                    : 'hover:bg-[#eae7e7]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={sub.completed}
                  onChange={() => onSubtaskToggle(task.id, sub.id)}
                  className="hidden"
                />
                <div
                  className={`w-[18px] h-[18px] rounded flex items-center justify-center transition-colors ${
                    sub.completed
                      ? 'bg-[#4355b9] text-white'
                      : 'border border-[#757684] text-transparent hover:border-[#4355b9]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>

                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span
                    className={`text-[13px] truncate ${
                      sub.completed
                        ? 'text-[#757684] line-through'
                        : idx === 1
                        ? 'text-[#1c1b1b] font-medium'
                        : 'text-[#454652]'
                    }`}
                  >
                    {sub.title}
                  </span>
                  {!sub.completed && idx === 1 && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#e5e2e1] text-[#454652]">
                      Active
                    </span>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Session Bottom Controls & Scratchpad Dock */}
      <footer className="w-full flex flex-col items-center gap-3">
        {/* Primary Action Buttons Row (Matching Image 5.png) */}
        <div className="flex items-center gap-2.5 w-full max-w-sm justify-between">
          {/* Pause / Resume Pill */}
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className={`flex-1 py-3 px-4 rounded-full border border-[#e5e2e1] flex items-center justify-center gap-2 text-[13px] font-semibold transition-all active:scale-95 cursor-pointer ${
              isPaused
                ? 'bg-[#dee0ff] text-[#293ca0] border-[#bac3ff]'
                : 'bg-[#f0eded] text-[#1c1b1b] hover:bg-[#eae7e7]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isPaused ? 'play_arrow' : 'pause'}
            </span>
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          {/* Quick Time Extension Pill */}
          <button
            type="button"
            onClick={handleAddFiveMin}
            className="flex-1 py-3 px-4 rounded-full bg-[#f0eded] border border-[#e5e2e1] hover:bg-[#eae7e7] text-[#1c1b1b] flex items-center justify-center gap-1.5 text-[13px] font-semibold transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">more_time</span>
            <span>+5 min</span>
          </button>

          {/* Finish / Complete Primary Action Button */}
          <button
            type="button"
            onClick={handleComplete}
            className="flex-[1.4] py-3 px-5 rounded-full bg-[#4355b9] text-white hover:bg-[#293ca0] transition-colors flex items-center justify-center gap-2 text-[13px] font-semibold shadow-xs active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            <span>Complete</span>
          </button>
        </div>

        {/* Quick Scratchpad Pull-Tab Drawer (Matching Image 5.png) */}
        <div className="w-full max-w-sm">
          <div className="bg-white border border-[#e5e2e1] rounded-2xl shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setIsScratchpadOpen(!isScratchpadOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 cursor-pointer select-none"
            >
              <div className="flex items-center gap-2 text-[#454652]">
                <span className="material-symbols-outlined text-[18px]">edit_note</span>
                <span className="text-[13px] text-[#1c1b1b] font-medium">
                  Quick Scratchpad &amp; Notes
                </span>
              </div>
              <span
                className={`material-symbols-outlined text-[18px] text-[#757684] transition-transform duration-200 ${
                  isScratchpadOpen ? 'rotate-180' : ''
                }`}
              >
                expand_less
              </span>
            </button>

            {isScratchpadOpen && (
              <div className="px-4 pb-3 pt-1 border-t border-[#f0eded]">
                <textarea
                  value={scratchpadText}
                  onChange={(e) => setScratchpadText(e.target.value)}
                  placeholder="Dump off-topic thoughts or tangent ideas here to protect focus..."
                  rows={3}
                  className="w-full bg-[#f6f3f2] rounded-xl p-2.5 border-0 focus:ring-1 focus:ring-[#4355b9] text-[13px] text-[#1c1b1b] placeholder:text-[#757684] resize-none"
                />
                <div className="flex items-center justify-between mt-2 text-[11px] text-[#757684]">
                  <span>Stored in daily inbox review</span>
                  <button
                    type="button"
                    onClick={() => setScratchpadText('')}
                    className="text-[#293ca0] font-semibold hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Android Gesture Bar */}
        <div className="w-32 h-1 bg-[#1c1b1b]/20 rounded-full mt-2 mb-1" />
      </footer>
    </main>
  );
};
