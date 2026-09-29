import React, { useState } from 'react';
import { Task, Project } from '../types';

interface InboxViewProps {
  tasks: Task[];
  projects: Project[];
  onToggleTask: (taskId: string) => void;
  onOpenTaskDetail: (task: Task) => void;
  onMoveToProject: (taskId: string, projectId: string) => void;
  onDismissSuggestion: (taskId: string) => void;
  onScheduleForToday: (taskId: string) => void;
}

export const InboxView: React.FC<InboxViewProps> = ({
  tasks,
  projects,
  onToggleTask,
  onOpenTaskDetail,
  onMoveToProject,
  onDismissSuggestion,
  onScheduleForToday,
}) => {
  const inboxTasks = tasks.filter((t) => t.dueDate === 'Inbox' && t.status !== 'completed');
  const [showAiSuggestions, setShowAiSuggestions] = useState(true);

  // Suggestions detected by AI
  const suggestedTasks = inboxTasks.filter(
    (t) => t.aiMetadata?.recommendedAction && t.status !== 'completed'
  );

  return (
    <div className="flex-1 px-4 pt-3 pb-36 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-[22px] font-semibold text-[#1c1b1b] tracking-tight">
            Inbox · {inboxTasks.length}
          </h2>
          <p className="text-[12px] text-[#757684] mt-0.5">
            Quickly captured thoughts waiting to be organized
          </p>
        </div>
      </div>

      {/* AI Suggestions Banner */}
      {showAiSuggestions && suggestedTasks.length > 0 && (
        <div className="bg-[#EEF1FC] rounded-2xl p-4 border border-[#dee0ff] space-y-3 shadow-xs">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#293ca0] text-[18px] material-symbols-fill">
                auto_awesome
              </span>
              <h3 className="text-[14px] font-semibold text-[#293ca0]">
                I found {suggestedTasks.length} tasks that belong to existing projects
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAiSuggestions(false)}
              className="text-[#757684] hover:text-[#1c1b1b]"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <p className="text-[12px] text-[#1c1b1b]">
            Review suggestions one by one below. Nothing is moved without your approval.
          </p>

          <div className="space-y-2 pt-1">
            {suggestedTasks.slice(0, 3).map((task) => {
              const rec = task.aiMetadata?.recommendedAction || 'Move to Project';
              // Find matching project
              const targetProject = projects.find((p) =>
                rec.toLowerCase().includes(p.name.toLowerCase())
              );
              return (
                <div
                  key={task.id}
                  className="bg-white rounded-xl p-3 border border-[#dee0ff] flex items-center justify-between gap-2 shadow-xs"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-[#1c1b1b] truncate">{task.title}</p>
                    <span className="text-[11px] text-[#293ca0] font-medium">{rec}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onDismissSuggestion(task.id)}
                      className="text-[11px] px-2.5 py-1 rounded-md text-[#757684] hover:bg-[#eae7e7] transition-colors"
                    >
                      Ignore
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (targetProject) {
                          onMoveToProject(task.id, targetProject.id);
                        }
                      }}
                      className="text-[11px] px-3 py-1 rounded-md bg-[#4355b9] text-white hover:bg-[#293ca0] transition-colors font-semibold"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Inbox List */}
      <div className="bg-white border border-[#e5e2e1] rounded-2xl divide-y divide-[#e5e2e1] overflow-hidden shadow-xs">
        {inboxTasks.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <span className="material-symbols-outlined text-[36px] text-[#c5c5d4]">
              all_inbox
            </span>
            <p className="text-[14px] text-[#1c1b1b] font-medium">Inbox zero</p>
            <p className="text-[12px] text-[#757684]">
              All your captured thoughts have been scheduled or organized.
            </p>
          </div>
        ) : (
          inboxTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onOpenTaskDetail(task)}
              className="group flex items-start gap-3 p-3.5 hover:bg-[#f6f3f2] transition-colors duration-150 cursor-pointer"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleTask(task.id);
                }}
                className="mt-0.5 w-[18px] h-[18px] rounded-md border-[1.5px] border-[#757684] hover:border-[#4355b9] flex items-center justify-center shrink-0"
              >
                <span className="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-30 text-[#4355b9]">
                  check
                </span>
              </button>

              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#1c1b1b] font-medium leading-snug">{task.title}</p>
                {task.description && (
                  <p className="text-[12px] text-[#757684] line-clamp-1 mt-0.5">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-[#757684] bg-[#f6f3f2] px-1.5 py-0.5 rounded">
                    Unorganized
                  </span>
                  {task.estimatedDuration && (
                    <span className="text-[11px] text-[#757684]">
                      ~{task.estimatedDuration}m
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onScheduleForToday(task.id);
                  }}
                  title="Move to Today"
                  className="text-[11px] px-2.5 py-1 rounded-md bg-[#f6f3f2] hover:bg-[#dee0ff] text-[#293ca0] font-semibold transition-colors"
                >
                  Today
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenTaskDetail(task);
                  }}
                  aria-label="Options"
                  className="p-1 text-[#757684] hover:text-[#1c1b1b]"
                >
                  <span className="material-symbols-outlined text-[16px]">more_horiz</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
