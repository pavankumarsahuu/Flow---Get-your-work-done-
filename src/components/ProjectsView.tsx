import React, { useState } from 'react';
import { Project, Task } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  tasks: Task[];
  onOpenTaskDetail: (task: Task) => void;
  onOpenQuickAddWithProject: (projectId: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  tasks,
  onOpenTaskDetail,
  onOpenQuickAddWithProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Work' | 'Personal'>('All');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="flex-1 px-4 pt-3 pb-36 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-[22px] font-semibold text-[#1c1b1b] tracking-tight">Projects</h2>
          <p className="text-[12px] text-[#757684] mt-0.5">
            Calm, focused spaces for your active initiatives
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-[#f0eded] p-1 rounded-xl">
          {(['All', 'Work', 'Personal'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-[#1c1b1b] shadow-xs'
                  : 'text-[#757684] hover:text-[#1c1b1b]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="space-y-3">
        {filteredProjects.map((project) => {
          const projectTasks = tasks.filter(
            (t) => t.projectId === project.id && t.status !== 'archived'
          );
          const completedTasks = projectTasks.filter((t) => t.status === 'completed');
          const remainingTasks = projectTasks.filter((t) => t.status !== 'completed');
          const nextTask = remainingTasks[0];
          const progressPercent =
            projectTasks.length > 0
              ? Math.round((completedTasks.length / projectTasks.length) * 100)
              : 0;
          const isExpanded = activeProjectId === project.id;

          return (
            <article
              key={project.id}
              className="bg-white border border-[#e5e2e1] rounded-2xl p-4 space-y-3 shadow-xs transition-all hover:border-[#c5c5d4]"
            >
              {/* Top Row: Icon, Name, Category */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: project.color }}
                  >
                    <span className="material-symbols-outlined text-[19px]">
                      {project.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#1c1b1b]">
                      {project.name}
                    </h3>
                    <p className="text-[12px] text-[#757684] line-clamp-1">
                      {project.description}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-medium text-[#757684] bg-[#f6f3f2] px-2 py-0.5 rounded-full">
                  {remainingTasks.length} remaining
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-[#757684]">
                  <span>Progress</span>
                  <span className="font-semibold text-[#1c1b1b]">{progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#f0eded] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: project.color,
                    }}
                  />
                </div>
              </div>

              {/* Next Action Highlight */}
              {nextTask ? (
                <div
                  onClick={() => onOpenTaskDetail(nextTask)}
                  className="bg-[#f6f3f2] hover:bg-[#eae7e7] p-2.5 rounded-xl flex items-center justify-between gap-2 cursor-pointer transition-colors"
                >
                  <div className="min-w-0 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4355b9]" />
                    <span className="text-[11px] text-[#757684] uppercase font-semibold">
                      Next:
                    </span>
                    <span className="text-[13px] text-[#1c1b1b] font-medium truncate">
                      {nextTask.title}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[#757684] text-[16px]">
                    arrow_forward
                  </span>
                </div>
              ) : (
                <div className="text-[12px] text-[#757684] italic">
                  All active tasks in this project are complete.
                </div>
              )}

              {/* Project Expand / Quick Add */}
              <div className="flex items-center justify-between pt-1 border-t border-[#f0eded]">
                <button
                  type="button"
                  onClick={() =>
                    setActiveProjectId(isExpanded ? null : project.id)
                  }
                  className="text-[12px] font-semibold text-[#293ca0] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{isExpanded ? 'Hide tasks' : 'View all tasks'}</span>
                  <span className="material-symbols-outlined text-[14px]">
                    {isExpanded ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenQuickAddWithProject(project.id)}
                  className="text-[11px] font-medium text-[#757684] hover:text-[#1c1b1b] flex items-center gap-1 px-2 py-1 rounded-md hover:bg-[#f6f3f2] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  <span>Add to project</span>
                </button>
              </div>

              {/* Expanded Tasks List */}
              {isExpanded && (
                <div className="space-y-1.5 pt-2 border-t border-[#f0eded]">
                  {projectTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onOpenTaskDetail(t)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f6f3f2] cursor-pointer text-[13px]"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center ${
                            t.status === 'completed'
                              ? 'bg-[#4355b9] text-white'
                              : 'border border-[#757684]'
                          }`}
                        >
                          {t.status === 'completed' && (
                            <span className="material-symbols-outlined text-[10px]">
                              check
                            </span>
                          )}
                        </span>
                        <span
                          className={
                            t.status === 'completed' ? 'line-through text-[#757684]' : 'text-[#1c1b1b]'
                          }
                        >
                          {t.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#757684]">{t.dueDate}</span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
