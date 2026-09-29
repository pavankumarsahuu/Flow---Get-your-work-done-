import React, { useState } from 'react';
import { Task } from '../types';
import { AIService, AssistantResponse } from '../services/aiService';

interface AIAssistantViewProps {
  tasks: Task[];
  isOffline: boolean;
  onStartFocus: (task: Task) => void;
  onOpenDeclutter: () => void;
  onOpenDailyReview: () => void;
  onOpenWeeklyReview: () => void;
  onBreakdownTask: (taskTitle: string) => void;
}

const PRESET_QUERIES = [
  'What should I do right now?',
  'What am I forgetting?',
  'What can I finish in 20 minutes?',
  'Plan tomorrow',
  'What tasks am I repeatedly postponing?',
  'Break down my website project',
];

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  tasks,
  isOffline,
  onStartFocus,
  onOpenDeclutter,
  onOpenDailyReview,
  onOpenWeeklyReview,
  onBreakdownTask,
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<
    { query: string; response: AssistantResponse }[]
  >([
    {
      query: 'What should I do right now?',
      response: {
        answer:
          'You have 35 minutes before your next meeting. Your "Finish landing page copy" task takes ~25 minutes and is high priority.',
        actions: [
          { label: 'Start 25 min focus', actionType: 'start_focus' },
          { label: 'Declutter & Schedule', actionType: 'reschedule' },
        ],
      },
    },
  ]);

  const handleAsk = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    setQuery('');

    try {
      const res = await AIService.askAssistant(text, tasks, isOffline);
      setHistory((prev) => [...prev, { query: text, response: res }]);
    } catch (err) {
      console.error('AI assistant error', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: { label: string; actionType: string }) => {
    if (action.actionType === 'start_focus') {
      const topTask = tasks.find((t) => t.isFocusRecommended && t.status !== 'completed') || tasks[0];
      if (topTask) onStartFocus(topTask);
    } else if (action.actionType === 'reschedule') {
      onOpenDeclutter();
    } else if (action.actionType === 'break_down') {
      onBreakdownTask('Launch my website');
    }
  };

  return (
    <div className="flex-1 px-4 pt-3 pb-36 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-[22px] font-semibold text-[#1c1b1b] tracking-tight">
            Flow AI
          </h2>
          <p className="text-[12px] text-[#757684] mt-0.5">
            Calm, action-oriented executive guidance
          </p>
        </div>

        {/* Review shortcuts */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenDailyReview}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#f6f3f2] hover:bg-[#eae7e7] text-[#293ca0] border border-[#e5e2e1]"
          >
            Daily Review
          </button>
          <button
            type="button"
            onClick={onOpenWeeklyReview}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#f6f3f2] hover:bg-[#eae7e7] text-[#454652] border border-[#e5e2e1]"
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Philosophy banner */}
      <div className="bg-[#f6f3f2] border border-[#e5e2e1] rounded-2xl p-3.5 flex items-center gap-2.5">
        <span className="material-symbols-outlined text-[#293ca0] text-[20px] material-symbols-fill">
          psychology
        </span>
        <p className="text-[12px] text-[#454652] italic leading-snug">
          &ldquo;Don&apos;t help users organize more. Help them know what to do next.&rdquo;
        </p>
      </div>

      {/* Preset Actionable Queries */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-[#757684] uppercase tracking-wider">
          Suggested Action Queries
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => handleAsk(q)}
              className="text-[12px] font-medium px-3 py-1.5 rounded-full bg-white border border-[#e5e2e1] text-[#1c1b1b] hover:bg-[#f6f3f2] hover:border-[#293ca0] transition-all active:scale-95 shadow-xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Cards List (Non-chatty, action-focused) */}
      <div className="space-y-3 pt-2">
        {history.map((item, idx) => (
          <article
            key={idx}
            className="bg-white border border-[#e5e2e1] rounded-2xl p-4 space-y-3 shadow-xs"
          >
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[#757684]">
              <span className="material-symbols-outlined text-[15px]">help_outline</span>
              <span>{item.query}</span>
            </div>

            <div className="bg-[#fcf9f8] p-3 rounded-xl border border-[#e5e2e1]/70">
              <p className="text-[14px] text-[#1c1b1b] leading-relaxed">
                {item.response.answer}
              </p>
            </div>

            {/* Action Buttons */}
            {item.response.actions && item.response.actions.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-1">
                {item.response.actions.map((act, aIdx) => (
                  <button
                    key={aIdx}
                    type="button"
                    onClick={() => handleActionClick(act)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#dee0ff] text-[#00105c] hover:bg-[#bac3ff] text-[12px] font-semibold transition-all active:scale-95 shadow-xs cursor-pointer"
                  >
                    <span>{act.label}</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                ))}
              </div>
            )}
          </article>
        ))}

        {isLoading && (
          <div className="p-4 bg-white border border-[#e5e2e1] rounded-2xl flex items-center justify-center gap-2 text-[13px] text-[#757684]">
            <span className="material-symbols-outlined text-[#293ca0] animate-spin text-[18px]">
              progress_activity
            </span>
            <span>Flow AI is finding your optimal next step...</span>
          </div>
        )}
      </div>

      {/* Query Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(query);
        }}
        className="sticky bottom-20 left-0 w-full bg-white border border-[#e5e2e1] rounded-full p-1.5 pl-4 flex items-center justify-between shadow-lg"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask Flow AI what to tackle next..."
          className="w-full bg-transparent border-none text-[13px] text-[#1c1b1b] placeholder:text-[#757684] focus:ring-0"
        />
        <button
          type="submit"
          className="w-8 h-8 rounded-full bg-[#293ca0] text-white flex items-center justify-center hover:bg-[#4355b9] transition-transform active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined text-[17px]">arrow_upward</span>
        </button>
      </form>
    </div>
  );
};
