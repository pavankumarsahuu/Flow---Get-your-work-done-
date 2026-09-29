import React, { useState } from 'react';
import { Task } from '../types';

interface DeclutterScheduleViewProps {
  onBack: () => void;
  onApplyAllSmartChanges: () => void;
  onApplyProposal: (taskId: string, actionType: string) => void;
  onDismissProposal: (taskId: string) => void;
  onBreakdownTask: (taskTitle: string) => void;
}

export const DeclutterScheduleView: React.FC<DeclutterScheduleViewProps> = ({
  onBack,
  onApplyAllSmartChanges,
  onApplyProposal,
  onDismissProposal,
  onBreakdownTask,
}) => {
  const [proposals, setProposals] = useState<Record<string, 'pending' | 'applied' | 'dismissed'>>({
    'deck': 'pending',
    'dns': 'pending',
    'desks': 'pending',
    'q3': 'pending',
  });

  const handleApply = (id: string, type: string) => {
    setProposals((prev) => ({ ...prev, [id]: 'applied' }));
    onApplyProposal(id, type);
  };

  const handleDismiss = (id: string) => {
    setProposals((prev) => ({ ...prev, [id]: 'dismissed' }));
    onDismissProposal(id);
  };

  const pendingCount = Object.values(proposals).filter((v) => v === 'pending').length;

  return (
    <div className="w-full max-w-xl mx-auto min-h-screen flex flex-col justify-between relative bg-[#fcf9f8] text-[#1c1b1b]">
      {/* Top App Bar (Task-Focused with Dismiss/Back) */}
      <header className="sticky top-0 z-30 bg-[#fcf9f8]/90 backdrop-blur-md pt-3 pb-2 px-4 flex flex-col border-b border-[#e5e2e1]/60">
        {/* Action & Header Bar */}
        <div className="flex items-center justify-between py-1">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="p-2 -ml-2 rounded-full text-[#1c1b1b] hover:bg-[#eae7e7] transition-colors active:scale-95 duration-100 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>

          <div className="flex items-center gap-1.5 bg-[#f6f3f2] px-2.5 py-1 rounded-full editorial-border">
            <span className="material-symbols-outlined text-[#293ca0] text-[14px]">
              auto_awesome
            </span>
            <span className="text-[11px] text-[#293ca0] font-semibold">Batch 1 of 5</span>
          </div>

          <button
            type="button"
            aria-label="Settings"
            className="p-2 -mr-2 rounded-full text-[#454652] hover:bg-[#eae7e7] transition-colors active:scale-95 duration-100 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </div>

        {/* Title & Overdue Subtitle */}
        <div className="mt-2 mb-1">
          <h1 className="text-[26px] font-bold text-[#1c1b1b] tracking-tight">
            Declutter &amp; Schedule
          </h1>
          <p className="text-[12px] text-[#757684] mt-0.5">27 overdue &amp; carry-over items</p>
        </div>
      </header>

      {/* Main Scrollable Canvas Content */}
      <main className="flex-1 px-4 space-y-4 pb-28 pt-3">
        {/* Gentle AI Insight Banner */}
        <div className="bg-[#EEF1FC] rounded-xl p-3.5 border border-[#dee0ff] flex gap-3 items-start">
          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <span className="material-symbols-outlined text-[#4355b9] text-[16px] material-symbols-fill">
              auto_awesome
            </span>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#293ca0] font-semibold">Capacity Rebalance</span>
              <span className="text-[11px] text-[#757684]">Calm pacing</span>
            </div>
            <p className="text-[13px] text-[#1c1b1b] leading-snug">
              Let&apos;s clean this up. You have planned work exceeding available time today (
              <span className="font-semibold text-[#293ca0]">4h 20m planned</span> vs{' '}
              <span className="font-semibold text-[#384665]">2h 45m free</span>). Reviewing 5
              prioritized items at a time.
            </p>
          </div>
        </div>

        {/* Schedule Capacity Visualizer (Asymmetric Material Bar) */}
        <section className="bg-white p-3.5 rounded-xl border border-[#e8e8e6] space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#757684] text-[16px]">
                calendar_today
              </span>
              <h2 className="text-[13px] text-[#1c1b1b] font-semibold">Today&apos;s Bandwidth</h2>
            </div>
            <span className="text-[11px] text-[#293ca0] font-semibold">2h 45m free window</span>
          </div>

          {/* Segmented Day Bar */}
          <div className="w-full h-3 rounded-full bg-[#e5e2e1] overflow-hidden flex gap-0.5 p-0.5">
            <div
              className="h-full bg-[#c5c5d4] rounded-xs w-[30%]"
              title="9:00-11:30 Meetings"
            />
            <div
              className="h-full bg-[#4355b9] rounded-xs w-[20%]"
              title="11:30-1:00 Free Focus Block"
            />
            <div
              className="h-full bg-[#c5c5d4] rounded-xs w-[20%]"
              title="2:00-3:30 Syncs"
            />
            <div
              className="h-full bg-[#bac3ff] rounded-xs w-[15%]"
              title="3:30-4:30 Open Slot"
            />
            <div
              className="h-full bg-[#eae7e7] rounded-xs w-[15%]"
              title="Evening Buffer"
            />
          </div>

          {/* Timeline Legend Breakdown */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#f0eded] text-[12px] text-[#757684]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#c5c5d4] shrink-0" />
              <span className="truncate">9:00–11:30 • Team Meetings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4355b9] shrink-0" />
              <span className="truncate text-[#1c1b1b] font-medium">11:30–1:00 • Focus Block</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#c5c5d4] shrink-0" />
              <span className="truncate">2:00–3:30 • 1:1 Syncs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#bac3ff] shrink-0" />
              <span className="truncate text-[#1c1b1b] font-medium">3:30–4:30 • Open Slot</span>
            </div>
          </div>
        </section>

        {/* Batch Review Cards Section */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] text-[#757684] font-medium">Recommended actions</span>
            <span className="text-[11px] text-[#757684]">
              {pendingCount} proposals pending
            </span>
          </div>

          {/* Card 1: Finish pitch deck outline */}
          <article className="bg-white rounded-xl border border-[#e8e8e6] p-3.5 space-y-3 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 w-4 h-4 rounded-md border-[1.5px] border-[#757684] shrink-0" />
                <div>
                  <h3 className="text-[15px] font-semibold text-[#1c1b1b]">
                    Finish pitch deck outline
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-[12px] text-[#757684]">
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">schedule</span>
                      45m
                    </span>
                    <span>•</span>
                    <span className="text-[#384665] font-medium">Overdue 2 days</span>
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#c5c5d4] text-[18px]">
                drag_indicator
              </span>
            </div>

            {/* AI Proposal Box */}
            <div className="bg-[#f6f3f2] rounded-lg p-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[#293ca0] text-[16px] shrink-0">
                  forward
                </span>
                <p className="text-[12px] text-[#1c1b1b] truncate font-medium">
                  {proposals.deck === 'applied'
                    ? '✓ Rescheduled to Friday focus block'
                    : proposals.deck === 'dismissed'
                    ? 'Dismissed'
                    : 'Reschedule to Friday focus block'}
                </p>
              </div>
              {proposals.deck === 'pending' && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDismiss('deck')}
                    className="text-[11px] px-2.5 py-1 rounded-md text-[#757684] hover:bg-[#eae7e7] transition-colors active:scale-95"
                  >
                    Dismiss
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApply('deck', 'reschedule')}
                    className="text-[11px] px-3 py-1 rounded-md bg-[#4355b9] text-white hover:bg-[#293ca0] transition-colors active:scale-95 font-semibold"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </article>

          {/* Card 2: Update DNS configuration */}
          <article className="bg-white rounded-xl border border-[#e8e8e6] p-3.5 space-y-3 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 w-4 h-4 rounded-md border-[1.5px] border-[#757684] shrink-0" />
                <div>
                  <h3 className="text-[15px] font-semibold text-[#1c1b1b]">
                    Update DNS configuration
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-[12px] text-[#757684]">
                    <span className="inline-flex items-center gap-1 text-amber-800">
                      <span className="material-symbols-outlined text-[13px]">sync_problem</span>
                      Stalled 5 times
                    </span>
                    <span>•</span>
                    <span>Infra</span>
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#c5c5d4] text-[18px]">
                drag_indicator
              </span>
            </div>

            {/* AI Proposal Box */}
            <div className="bg-[#f6f3f2] rounded-lg p-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[#293ca0] text-[16px] shrink-0">
                  checklist
                </span>
                <p className="text-[12px] text-[#1c1b1b] truncate font-medium">
                  {proposals.dns === 'applied'
                    ? '✓ Broken into 3 checks'
                    : 'Break into 3 quick checks (15m)'}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    handleApply('dns', 'breakdown');
                    onBreakdownTask('Update DNS configuration');
                  }}
                  className="text-[11px] px-3 py-1 rounded-md bg-[#e5e2e1] text-[#293ca0] hover:bg-[#dee0ff] transition-colors active:scale-95 font-semibold"
                >
                  Break down
                </button>
              </div>
            </div>
          </article>

          {/* Card 3: Research standing desks */}
          <article className="bg-white rounded-xl border border-[#e8e8e6] p-3.5 space-y-3 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 w-4 h-4 rounded-md border-[1.5px] border-[#757684] shrink-0" />
                <div>
                  <h3 className="text-[15px] font-semibold text-[#1c1b1b]">
                    Research standing desks
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-[12px] text-[#757684]">
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">person</span>
                      Personal
                    </span>
                    <span>•</span>
                    <span>Low priority</span>
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#c5c5d4] text-[18px]">
                drag_indicator
              </span>
            </div>

            {/* AI Proposal Box */}
            <div className="bg-[#f6f3f2] rounded-lg p-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[#293ca0] text-[16px] shrink-0">
                  inventory_2
                </span>
                <p className="text-[12px] text-[#1c1b1b] truncate font-medium">
                  {proposals.desks === 'applied' ? '✓ Moved to Archive' : 'Move to Someday / Archive'}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleApply('desks', 'archive')}
                  className="text-[11px] px-3 py-1 rounded-md bg-[#e5e2e1] text-[#1c1b1b] hover:bg-[#dee0ff] transition-colors active:scale-95 font-semibold"
                >
                  Move
                </button>
              </div>
            </div>
          </article>

          {/* Card 4: Review Q3 financial report */}
          <article className="bg-white rounded-xl border border-[#e8e8e6] p-3.5 space-y-3 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 w-4 h-4 rounded-md border-[1.5px] border-[#757684] shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-semibold text-[#1c1b1b]">
                      Review Q3 financial report
                    </h3>
                    <span className="text-[10px] font-semibold text-[#293ca0] bg-[#dee0ff] px-1.5 py-0.5 rounded">
                      High priority
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[12px] text-[#757684]">
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">timer</span>
                      60m required
                    </span>
                    <span>•</span>
                    <span>Finance</span>
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#c5c5d4] text-[18px]">
                drag_indicator
              </span>
            </div>

            {/* AI Proposal Box */}
            <div className="bg-[#f6f3f2] rounded-lg p-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[#293ca0] text-[16px] shrink-0">
                  event_upcoming
                </span>
                <p className="text-[12px] text-[#1c1b1b] truncate font-medium">
                  {proposals.q3 === 'applied'
                    ? '✓ Slotted into 3:30 PM'
                    : 'Slot into today 3:30 PM (free 60m window)'}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleApply('q3', 'slot_calendar')}
                  className="text-[11px] px-3 py-1 rounded-md bg-[#4355b9] text-white hover:bg-[#293ca0] transition-colors active:scale-95 font-semibold"
                >
                  Schedule
                </button>
              </div>
            </div>
          </article>

          {/* Batch indicator */}
          <div className="text-center py-2">
            <p className="text-[12px] text-[#757684]">
              Remaining 22 items will be batched once this round is resolved.
            </p>
          </div>
        </section>
      </main>

      {/* Bottom Action Bar & Native Android Gesture Indicator */}
      <footer className="fixed bottom-0 left-0 w-full z-40 bg-[#fcf9f8]/95 backdrop-blur-md pb-2 pt-2 px-4 border-t border-[#e5e2e1]">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-2">
          {/* Action Buttons */}
          <div className="w-full flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setProposals({
                  deck: 'applied',
                  dns: 'applied',
                  desks: 'applied',
                  q3: 'applied',
                });
                onApplyAllSmartChanges();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-[#4355b9] text-white text-[15px] font-semibold hover:bg-[#293ca0] transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span>Apply 4 Smart Changes</span>
            </button>

            <button
              type="button"
              onClick={onBack}
              className="py-3 px-4 rounded-xl text-[#757684] hover:bg-[#eae7e7] text-[15px] font-semibold transition-colors active:scale-95 cursor-pointer"
            >
              Keep as is
            </button>
          </div>

          {/* Android Gesture Bar */}
          <div className="w-32 h-1 bg-[#1c1b1b]/20 rounded-full mt-1.5 mb-1" />
        </div>
      </footer>
    </div>
  );
};
