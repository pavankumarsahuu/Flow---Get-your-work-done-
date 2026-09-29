import React, { useState } from 'react';
import { Task, Project } from '../types';

interface SearchViewProps {
  isOpen: boolean;
  tasks: Task[];
  projects: Project[];
  onClose: () => void;
  onOpenTaskDetail: (task: Task) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  isOpen,
  tasks,
  projects,
  onClose,
  onOpenTaskDetail,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredTasks = tasks.filter((task) => {
    if (!q) return true;
    if (q.includes('website')) {
      return (
        task.title.toLowerCase().includes('website') ||
        task.projectId === 'website' ||
        task.tags.some((t) => t.toLowerCase().includes('website'))
      );
    }
    if (q.includes('sarah')) {
      return task.title.toLowerCase().includes('sarah') || task.description?.toLowerCase().includes('sarah');
    }
    if (q.includes('overdue')) {
      return task.postponedCount > 0 || task.dueDate.includes('ago') || task.dueDate.includes('Yesterday');
    }
    if (q.includes('completed')) {
      return task.status === 'completed';
    }

    return (
      task.title.toLowerCase().includes(q) ||
      task.description?.toLowerCase().includes(q) ||
      task.tags.some((t) => t.toLowerCase().includes(q)) ||
      task.projectId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#fcf9f8] animate-in fade-in duration-150">
      {/* Search Header */}
      <div className="p-4 border-b border-[#e5e2e1] bg-white flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 -ml-1 text-[#454652] hover:bg-[#f6f3f2] rounded-full"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <div className="flex-1 flex items-center gap-2 bg-[#f6f3f2] px-3 py-2 rounded-xl border border-[#e5e2e1]">
          <span className="material-symbols-outlined text-[#757684] text-[18px]">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, tags, notes, or ask in natural language..."
            className="w-full bg-transparent border-none p-0 text-[13px] text-[#1c1b1b] placeholder:text-[#757684] focus:ring-0"
            autoFocus
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="text-[#757684]">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Suggested Quick Filters */}
      <div className="px-4 py-2 bg-white border-b border-[#f0eded] flex items-center gap-2 overflow-x-auto scrollbar-none">
        {['Things related to website', 'Tasks about Sarah', 'Overdue tasks', 'Completed tasks'].map(
          (filter) => (
            <button
              key={filter}
              onClick={() => setQuery(filter)}
              className="whitespace-nowrap px-3 py-1 rounded-full bg-[#f6f3f2] text-[11px] font-medium text-[#454652] hover:bg-[#eae7e7] transition-colors"
            >
              {filter}
            </button>
          )
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <span className="text-[11px] font-semibold text-[#757684] uppercase tracking-wider block">
          Found ({filteredTasks.length})
        </span>

        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-[#757684] text-[13px]">
            No matching tasks found for &ldquo;{query}&rdquo;.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => {
                onOpenTaskDetail(task);
                onClose();
              }}
              className="bg-white p-3 rounded-xl border border-[#e5e2e1] hover:border-[#4355b9] cursor-pointer flex items-center justify-between"
            >
              <div>
                <p
                  className={`text-[13px] font-medium ${
                    task.status === 'completed' ? 'line-through text-[#757684]' : 'text-[#1c1b1b]'
                  }`}
                >
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#757684]">
                  <span>{task.dueDate}</span>
                  <span>•</span>
                  <span>{task.projectId}</span>
                  {task.priority === 'High' && (
                    <span className="text-rose-600 font-semibold">• High</span>
                  )}
                </div>
              </div>
              <span className="material-symbols-outlined text-[16px] text-[#757684]">
                arrow_forward
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
