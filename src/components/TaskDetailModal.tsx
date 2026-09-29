import React, { useState } from 'react';
import { Task, Project, Priority, Subtask } from '../types';

interface TaskDetailModalProps {
  task: Task | null;
  projects: Project[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (updated: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStartFocus: (task: Task) => void;
  onTriggerBreakdown: (taskTitle: string) => void;
  onTriggerActionability: (taskTitle: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  projects,
  isOpen,
  onClose,
  onUpdateTask,
  onDeleteTask,
  onStartFocus,
  onTriggerBreakdown,
  onTriggerActionability,
}) => {
  if (!isOpen || !task) return null;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [dueTime, setDueTime] = useState(task.dueTime || '');
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [projectId, setProjectId] = useState(task.projectId);
  const [estimatedDuration, setEstimatedDuration] = useState(task.estimatedDuration || 25);
  const [recurrenceRule, setRecurrenceRule] = useState(task.recurrenceRule || 'None');
  const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks || []);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  const handleSave = () => {
    onUpdateTask({
      ...task,
      title: title.trim() || task.title,
      description,
      dueDate,
      dueTime,
      priority,
      projectId,
      estimatedDuration,
      recurrenceRule,
      subtasks,
    });
    onClose();
  };

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    const newSub: Subtask = {
      id: `sub-${Date.now()}`,
      title: newSubtaskText.trim(),
      completed: false,
    };
    setSubtasks([...subtasks, newSub]);
    setNewSubtaskText('');
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#fcf9f8] rounded-3xl border border-[#e5e2e1] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Top App Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e2e1] bg-white">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="p-1.5 -ml-1 text-[#454652] hover:bg-[#f6f3f2] rounded-full"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>

          <span className="text-[13px] font-semibold text-[#757684] uppercase tracking-wider">
            Task Detail
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                onDeleteTask(task.id);
                onClose();
              }}
              aria-label="Delete Task"
              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-full"
            >
              <span className="material-symbols-outlined text-[19px]">delete</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1 bg-[#4355b9] text-white text-[12px] font-semibold rounded-full hover:bg-[#293ca0]"
            >
              Done
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Title Field (Notion-like large clean title) */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full text-[20px] font-semibold text-[#1c1b1b] bg-transparent border-none p-0 focus:ring-0 placeholder:text-[#757684]"
            />
          </div>

          {/* Description / Notes */}
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description, notes, links or thoughts..."
              rows={3}
              className="w-full text-[13px] text-[#1c1b1b] bg-[#f6f3f2] border border-[#e5e2e1] rounded-xl p-3 focus:ring-1 focus:ring-[#4355b9] placeholder:text-[#757684] resize-none"
            />
          </div>

          {/* Properties Grid */}
          <div className="bg-white rounded-2xl border border-[#e5e2e1] p-3 space-y-2.5 shadow-xs">
            {/* Project */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#757684] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">folder</span>
                Project
              </span>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="bg-[#f6f3f2] border border-[#e5e2e1] text-[12px] font-medium rounded-lg px-2 py-1 text-[#1c1b1b]"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date & Time */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#757684] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">event</span>
                Due Date
              </span>
              <div className="flex items-center gap-1.5">
                <select
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-[#f6f3f2] border border-[#e5e2e1] text-[12px] font-medium rounded-lg px-2 py-1 text-[#1c1b1b]"
                >
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="Friday">Friday</option>
                  <option value="Next week">Next week</option>
                  <option value="Inbox">Inbox</option>
                  <option value="Someday">Someday</option>
                </select>
                <input
                  type="text"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  placeholder="e.g. 2:00 PM"
                  className="w-24 bg-[#f6f3f2] border border-[#e5e2e1] text-[12px] rounded-lg px-2 py-1 text-[#1c1b1b]"
                />
              </div>
            </div>

            {/* Priority */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#757684] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">flag</span>
                Priority
              </span>
              <div className="flex items-center gap-1">
                {(['Low', 'Normal', 'High'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors ${
                      priority === p
                        ? p === 'High'
                          ? 'bg-[#ffdad6] text-[#ba1a1a] font-semibold'
                          : 'bg-[#dee0ff] text-[#293ca0] font-semibold'
                        : 'bg-[#f6f3f2] text-[#454652] hover:bg-[#eae7e7]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Duration */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#757684] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">timer</span>
                Duration
              </span>
              <div className="flex items-center gap-1.5">
                {[15, 25, 30, 45, 60].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setEstimatedDuration(d)}
                    className={`px-2 py-0.5 text-[11px] rounded-md ${
                      estimatedDuration === d
                        ? 'bg-[#293ca0] text-white font-semibold'
                        : 'bg-[#f6f3f2] text-[#454652]'
                    }`}
                  >
                    {d}m
                  </button>
                ))}
              </div>
            </div>

            {/* Recurrence Rule */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#757684] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">repeat</span>
                Recurrence
              </span>
              <select
                value={recurrenceRule}
                onChange={(e) => setRecurrenceRule(e.target.value)}
                className="bg-[#f6f3f2] border border-[#e5e2e1] text-[12px] font-medium rounded-lg px-2 py-1 text-[#1c1b1b]"
              >
                <option value="None">None</option>
                <option value="Every day">Every day</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Weekly">Weekly</option>
                <option value="Every 2 weeks">Every 2 weeks</option>
                <option value="Every 7 days after completion">
                  Every 7 days after completion
                </option>
              </select>
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="bg-white rounded-2xl border border-[#e5e2e1] p-3 space-y-2 shadow-xs">
            <span className="text-[12px] font-semibold text-[#757684] uppercase tracking-wider block">
              Subtasks ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
            </span>

            <div className="space-y-1.5">
              {subtasks.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between group p-1">
                  <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => handleToggleSubtask(sub.id)}
                      className="rounded border-[#757684] text-[#4355b9] focus:ring-0"
                    />
                    <span
                      className={`text-[13px] truncate ${
                        sub.completed ? 'line-through text-[#757684]' : 'text-[#1c1b1b]'
                      }`}
                    >
                      {sub.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubtask(sub.id)}
                    className="text-[#757684] hover:text-rose-600 opacity-30 group-hover:opacity-100 p-0.5"
                  >
                    <span className="material-symbols-outlined text-[15px]">close</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Add subtask input */}
            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                placeholder="Add subtask..."
                className="flex-1 bg-[#f6f3f2] border border-[#e5e2e1] rounded-lg px-2.5 py-1 text-[12px] text-[#1c1b1b] focus:ring-1 focus:ring-[#4355b9]"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-2.5 py-1 rounded-lg bg-[#f0eded] hover:bg-[#eae7e7] text-[12px] font-semibold text-[#293ca0]"
              >
                Add
              </button>
            </div>
          </div>

          {/* AI Actions Toolbar */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#757684] uppercase tracking-wider">
              AI Actions
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onTriggerBreakdown(title);
                  onClose();
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#dee0ff] text-[#00105c] hover:bg-[#bac3ff] text-[11px] font-semibold shadow-xs"
              >
                <span className="material-symbols-outlined text-[14px]">checklist</span>
                <span>Break into steps</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onTriggerActionability(title);
                  onClose();
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-[#e5e2e1] text-[#1c1b1b] hover:bg-[#f6f3f2] text-[11px] font-medium shadow-xs"
              >
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                <span>Make actionable</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEstimatedDuration(30);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-[#e5e2e1] text-[#1c1b1b] hover:bg-[#f6f3f2] text-[11px] font-medium shadow-xs"
              >
                <span className="material-symbols-outlined text-[14px]">timer</span>
                <span>Estimate duration</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onStartFocus(task);
                  onClose();
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#4355b9] text-white hover:bg-[#293ca0] text-[11px] font-semibold shadow-xs"
              >
                <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                <span>Start Focus</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
