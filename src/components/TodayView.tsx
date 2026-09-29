import React from 'react';
import { Task } from '../types';

interface TodayViewProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onOpenTaskDetail: (task: Task) => void;
  onStartFocus: (task: Task) => void;
  onPlanMyDay: () => void;
  onScheduleFocus: () => void;
  onBreakdownTask: (taskTitle: string) => void;
  onMakeActionable: (taskTitle: string) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  tasks,
  onToggleTask,
  onOpenTaskDetail,
  onStartFocus,
  onPlanMyDay,
  onScheduleFocus,
  onBreakdownTask,
  onMakeActionable,
}) => {
  const focusTasks = tasks.filter(
    (t) => t.isFocusRecommended && t.status !== 'completed' && t.dueDate === 'Today'
  );
  const remainingTodayTasks = tasks.filter(
    (t) => !t.isFocusRecommended && t.dueDate === 'Today'
  );
  const completedTodayTasks = tasks.filter(
    (t) => t.status === 'completed' && t.dueDate === 'Today'
  );

  const activeCount = tasks.filter((t) => t.dueDate === 'Today' && t.status !== 'completed').length;

  return (
    <div className="flex-1 px-4 pt-3 pb-36 space-y-5">
      {/* 1. Greeting & AI Contextual Summary (Matching Image 7.png) */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between pt-1">
          <div>
            <h2 className="text-[22px] font-semibold text-[#1c1b1b] tracking-tight">
              Good morning, Alex
            </h2>
            <p className="text-[12px] text-[#757684] mt-0.5">
              Wednesday, Oct 24 · Deep focus day
            </p>
          </div>
          <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-[#eae7e7] text-[#454652]">
            Week 43
          </span>
        </div>

        {/* AI Insight Card */}
        <article className="bg-[#f6f3f2] border border-[#e5e2e1] rounded-2xl p-4 transition-all hover:border-[#c5c5d4]">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-[#dee0ff] rounded-xl text-[#293ca0] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px] material-symbols-fill">
                auto_awesome
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] text-[#1c1b1b] leading-snug">
                You have <span className="font-semibold text-[#293ca0]">{activeCount} tasks</span>{' '}
                today. Two are high priority and you have a free{' '}
                <span className="font-semibold">60-min window</span> at 11:30 AM.
              </p>

              {/* Quick Smart Action Pills */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <button
                  type="button"
                  onClick={onPlanMyDay}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e5e2e1] text-[12px] text-[#293ca0] font-medium hover:bg-[#293ca0] hover:text-white transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  <span>Plan my day</span>
                  <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </button>

                <button
                  type="button"
                  onClick={onScheduleFocus}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e5e2e1] text-[12px] text-[#454652] hover:text-[#1c1b1b] hover:bg-[#eae7e7] transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[13px]">schedule</span>
                  <span>Schedule focus</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* 2. Focus Section (Recommended next actions) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4355b9]" />
            <h3 className="text-[15px] font-semibold text-[#1c1b1b]">Focus</h3>
            <span className="text-[12px] text-[#757684]">· Recommended next</span>
          </div>
          <button
            type="button"
            onClick={onPlanMyDay}
            className="text-[12px] text-[#4355b9] hover:underline font-medium cursor-pointer"
          >
            Reorder
          </button>
        </div>

        <div className="bg-white border border-[#e5e2e1] rounded-2xl divide-y divide-[#e5e2e1] overflow-hidden shadow-xs">
          {focusTasks.length === 0 ? (
            <div className="p-4 text-center text-[13px] text-[#757684]">
              No focus tasks assigned. Select any task to focus on it.
            </div>
          ) : (
            focusTasks.map((task) => (
              <div
                key={task.id}
                className="group flex items-start gap-3 p-3.5 hover:bg-[#f6f3f2] transition-colors duration-150 cursor-pointer"
                onClick={() => onOpenTaskDetail(task)}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTask(task.id);
                  }}
                  aria-label="Mark task done"
                  className="mt-0.5 w-[18px] h-[18px] rounded-md border-[1.5px] border-[#757684] hover:border-[#4355b9] flex items-center justify-center shrink-0 transition-colors"
                >
                  <span className="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-30 text-[#4355b9]">
                    check
                  </span>
                </button>

                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-[#1c1b1b] font-medium leading-snug">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[12px] text-[#757684]">
                      {task.projectId === 'work'
                        ? 'Work'
                        : task.projectId === 'marketing'
                        ? 'Work'
                        : 'Personal'}
                    </span>
                    <span className="text-[#757684] text-[10px]">•</span>
                    <span className="text-[12px] text-[#757684]">{task.estimatedDuration} min</span>
                    {task.dueTime && (
                      <>
                        <span className="text-[#757684] text-[10px]">•</span>
                        <span className="text-[12px] text-[#293ca0] font-medium">
                          {task.dueTime}
                        </span>
                      </>
                    )}
                    {task.freeWindowMatch && (
                      <>
                        <span className="text-[#757684] text-[10px]">•</span>
                        <span className="text-[11px] text-[#454652] bg-[#f0eded] px-1.5 py-0.5 rounded">
                          {task.freeWindowMatch}
                        </span>
                      </>
                    )}
                    {task.priority === 'High' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#ffdad6] text-[#ba1a1a] leading-none">
                        High
                      </span>
                    )}
                    {task.title.includes('investor') && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#4355b9] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#304ed0]" />
                        Next up
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartFocus(task);
                    }}
                    title="Start Focus Session"
                    className="p-1 rounded-full text-[#4355b9] hover:bg-[#dee0ff] opacity-80 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-[18px]">play_circle</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTaskDetail(task);
                    }}
                    aria-label="Task options"
                    className="text-[#757684] hover:text-[#1c1b1b] p-1 opacity-40 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-[16px]">more_horiz</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 3. Today Section (All remaining tasks) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[15px] font-semibold text-[#1c1b1b]">Today</h3>
          <span className="text-[12px] text-[#757684]">
            {remainingTodayTasks.filter((t) => t.status !== 'completed').length} remaining
          </span>
        </div>

        <div className="bg-white border border-[#e5e2e1] rounded-2xl divide-y divide-[#e5e2e1] overflow-hidden shadow-xs">
          {remainingTodayTasks.map((task) => {
            const isDone = task.status === 'completed';
            return (
              <div
                key={task.id}
                onClick={() => onOpenTaskDetail(task)}
                className={`group flex items-start gap-3 p-3.5 transition-colors duration-150 cursor-pointer ${
                  isDone ? 'bg-[#f6f3f2]/60' : 'hover:bg-[#f6f3f2]'
                }`}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTask(task.id);
                  }}
                  aria-label={isDone ? 'Mark uncompleted' : 'Mark task done'}
                  className={`mt-0.5 w-[18px] h-[18px] rounded-md flex items-center justify-center shrink-0 transition-colors ${
                    isDone
                      ? 'bg-[#4355b9] text-white'
                      : 'border-[1.5px] border-[#757684] hover:border-[#4355b9]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[13px] ${
                      isDone ? 'opacity-100' : 'opacity-0 group-hover:opacity-30 text-[#4355b9]'
                    }`}
                  >
                    check
                  </span>
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-[14px] leading-snug ${
                      isDone ? 'text-[#757684] line-through' : 'text-[#1c1b1b]'
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[12px] text-[#757684]">
                      {isDone
                        ? `Completed ${task.completedAt || 'today'}`
                        : task.projectId.charAt(0).toUpperCase() + task.projectId.slice(1)}
                    </span>
                    {!isDone && (
                      <>
                        <span className="text-[#757684] text-[10px]">•</span>
                        <span className="text-[12px] text-[#757684]">
                          {task.estimatedDuration} min
                        </span>
                        {task.dueTime && (
                          <>
                            <span className="text-[#757684] text-[10px]">•</span>
                            <span className="text-[12px] text-[#757684]">{task.dueTime}</span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {!isDone && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartFocus(task);
                      }}
                      title="Focus"
                      className="text-[#4355b9] hover:bg-[#dee0ff] p-1 rounded-full opacity-60 group-hover:opacity-100"
                    >
                      <span className="material-symbols-outlined text-[17px]">play_arrow</span>
                    </button>
                  )}
                  <span className="text-[#757684] p-1 opacity-30 group-hover:opacity-100">
                    <span className="material-symbols-outlined text-[16px]">
                      {isDone ? 'done_all' : 'drag_indicator'}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}

          {/* Completed Section Items */}
          {completedTodayTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onOpenTaskDetail(task)}
              className="group flex items-start gap-3 p-3.5 bg-[#f6f3f2]/60 cursor-pointer"
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleTask(task.id);
                }}
                className="mt-0.5 w-[18px] h-[18px] rounded-md bg-[#4355b9] text-white flex items-center justify-center shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[13px]">check</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#757684] line-through leading-snug">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[12px] text-[#757684]/80">
                    Completed {task.completedAt || 'today'}
                  </span>
                  <span className="text-[#757684]/40 text-[10px]">•</span>
                  <span className="text-[12px] text-[#757684]/80">Team</span>
                </div>
              </div>
              <span className="text-[#757684]/50 p-1">
                <span className="material-symbols-outlined text-[16px]">done_all</span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
