/**
 * Flow — Production-quality native Android AI-powered To-Do application
 * Inspired by Notion's calm organization and Android Material 3 design principles
 */

import React, { useState, useEffect } from 'react';
import { Task, Project, NavigationTab, AppSettings, Priority } from './types';
import { StorageService } from './services/storage';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { AndroidGestureBar } from './components/AndroidGestureBar';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { FloatingQuickAddBar } from './components/FloatingQuickAddBar';
import { QuickAddSheet } from './components/QuickAddSheet';
import { TodayView } from './components/TodayView';
import { InboxView } from './components/InboxView';
import { ProjectsView } from './components/ProjectsView';
import { AIAssistantView } from './components/AIAssistantView';
import { FocusModeView } from './components/FocusModeView';
import { DeclutterScheduleView } from './components/DeclutterScheduleView';
import { TaskDetailModal } from './components/TaskDetailModal';
import { AIBreakdownModal } from './components/AIBreakdownModal';
import { AIActionabilityModal } from './components/AIActionabilityModal';
import { DailyReviewModal } from './components/DailyReviewModal';
import { WeeklyReviewModal } from './components/WeeklyReviewModal';
import { SearchView } from './components/SearchView';
import { WidgetsPreviewModal } from './components/WidgetsPreviewModal';
import { SharesheetModal } from './components/SharesheetModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<AppSettings>(StorageService.getSettings());
  const [currentTab, setCurrentTab] = useState<NavigationTab>('today');

  // Screen / Modal States
  const [activeScreen, setActiveScreen] = useState<'main' | 'focus' | 'declutter'>('main');
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddInitialText, setQuickAddInitialText] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWidgetsOpen, setIsWidgetsOpen] = useState(false);
  const [isSharesheetOpen, setIsSharesheetOpen] = useState(false);
  const [isDailyReviewOpen, setIsDailyReviewOpen] = useState(false);
  const [isWeeklyReviewOpen, setIsWeeklyReviewOpen] = useState(false);

  // Breakdown & Actionability Modals
  const [breakdownTaskTitle, setBreakdownTaskTitle] = useState<string | null>(null);
  const [actionabilityTaskTitle, setActionabilityTaskTitle] = useState<string | null>(null);

  // Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch {}
    }
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Load Initial Data
  useEffect(() => {
    const loadedTasks = StorageService.getTasks();
    const loadedProjects = StorageService.getProjects();
    setTasks(loadedTasks);
    setProjects(loadedProjects);
  }, []);

  // Sync to Storage on Change
  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    StorageService.saveTasks(newTasks);
  };

  // Task Completion / Toggle
  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const isDone = t.status === 'completed';
        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')} ${
          now.getHours() >= 12 ? 'PM' : 'AM'
        }`;
        return {
          ...t,
          status: (isDone ? 'todo' : 'completed') as Task['status'],
          completedAt: isDone ? undefined : timeStr,
        };
      }
      return t;
    });
    updateTasks(updated);
    showToast('Task updated');
  };

  // Add Task
  const handleAddTask = (taskData: {
    title: string;
    dueDate: string;
    dueTime?: string;
    projectId: string;
    priority: Priority;
    estimatedDuration: number;
    reminder?: string;
    tags: string[];
    isMeetLinked?: boolean;
  }) => {
    // Check if task is large or vague to proactively offer breakdown
    const lower = taskData.title.toLowerCase();
    const isLarge =
      lower.includes('website') ||
      lower.includes('launch') ||
      lower.includes('redesign') ||
      lower.includes('pitch deck');

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      status: 'todo',
      priority: taskData.priority,
      projectId: taskData.projectId,
      dueDate: taskData.dueDate,
      dueTime: taskData.dueTime,
      reminder: taskData.reminder,
      estimatedDuration: taskData.estimatedDuration,
      tags: taskData.tags,
      subtasks: [],
      createdAt: new Date().toISOString(),
      postponedCount: 0,
      source: 'quick_add',
      isFocusRecommended: taskData.dueDate === 'Today' && taskData.priority === 'High',
    };

    updateTasks([newTask, ...tasks]);
    showToast(`Task created: "${newTask.title}"`);

    if (isLarge) {
      setTimeout(() => {
        setBreakdownTaskTitle(newTask.title);
      }, 500);
    }
  };

  // Instant Add from Floating Bar
  const handleInstantAdd = (title: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      status: 'todo',
      priority: 'Normal',
      projectId: 'work',
      dueDate: 'Today',
      estimatedDuration: 25,
      tags: [],
      subtasks: [],
      createdAt: new Date().toISOString(),
      postponedCount: 0,
      source: 'quick_add',
      isFocusRecommended: false,
    };
    updateTasks([newTask, ...tasks]);
    showToast(`Added to Today: "${title}"`);
  };

  // Subtask Toggle inside Focus Mode
  const handleSubtaskToggle = (taskId: string, subtaskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: t.subtasks.map((s) =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
          ),
        };
      }
      return t;
    });
    updateTasks(updated);
  };

  // Overwhelm Mode Batch Changes
  const handleApplyAllSmartChanges = () => {
    const updated = tasks.map((t) => {
      if (t.id === 'task-overdue-1') {
        return { ...t, dueDate: 'Friday', postponedCount: 0 };
      }
      if (t.id === 'task-overdue-2') {
        return {
          ...t,
          subtasks: [
            { id: 'dns-1', title: 'Export zone records', completed: false },
            { id: 'dns-2', title: 'Update A and CNAME pointers', completed: false },
            { id: 'dns-3', title: 'Verify propagation', completed: false },
          ],
        };
      }
      if (t.id === 'task-overdue-3') {
        return { ...t, dueDate: 'Someday', priority: 'Low' as Priority };
      }
      if (t.id === 'task-overdue-4') {
        return { ...t, dueDate: 'Today', dueTime: '3:30 PM' };
      }
      return t;
    });
    updateTasks(updated);
    showToast('Applied 4 smart schedule proposals');
    setActiveScreen('main');
  };

  const handleApplyProposal = (taskId: string, actionType: string) => {
    showToast(`Proposal applied (${actionType})`);
  };

  const handleDismissProposal = (taskId: string) => {
    showToast('Proposal dismissed');
  };

  // Breakdown Apply
  const handleApplyBreakdown = (steps: string[]) => {
    const newSubtasks = steps.map((s, idx) => ({
      id: `break-${Date.now()}-${idx}`,
      title: s,
      completed: false,
    }));

    const updated = tasks.map((t) => {
      if (breakdownTaskTitle && t.title.toLowerCase() === breakdownTaskTitle.toLowerCase()) {
        return { ...t, subtasks: [...t.subtasks, ...newSubtasks] };
      }
      return t;
    });
    updateTasks(updated);
    showToast(`Added ${steps.length} sequential steps`);
    setBreakdownTaskTitle(null);
  };

  // Make Actionable Alternative Select
  const handleSelectAlternative = (newTitle: string) => {
    const updated = tasks.map((t) => {
      if (actionabilityTaskTitle && t.title.toLowerCase() === actionabilityTaskTitle.toLowerCase()) {
        return { ...t, title: newTitle };
      }
      return t;
    });
    updateTasks(updated);
    showToast(`Task refined to: "${newTitle}"`);
    setActionabilityTaskTitle(null);
  };

  // Inbox Suggestions
  const handleMoveToProject = (taskId: string, projectId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          projectId,
          dueDate: 'Today',
          aiMetadata: undefined,
        };
      }
      return t;
    });
    updateTasks(updated);
    showToast('Moved to project & scheduled for Today');
  };

  const handleDismissSuggestion = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, aiMetadata: undefined };
      }
      return t;
    });
    updateTasks(updated);
    showToast('Suggestion dismissed');
  };

  const handleScheduleForToday = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, dueDate: 'Today' };
      }
      return t;
    });
    updateTasks(updated);
    showToast('Scheduled for Today');
  };

  const overdueCount = tasks.filter(
    (t) => t.status !== 'completed' && (t.dueDate.includes('ago') || t.dueDate.includes('Yesterday'))
  ).length;

  const inboxCount = tasks.filter((t) => t.dueDate === 'Inbox' && t.status !== 'completed').length;

  // Render Focus Mode Fullscreen View
  if (activeScreen === 'focus' && focusTask) {
    return (
      <div className="min-h-screen bg-[#F0EDED] flex justify-center items-center p-0 md:p-6">
        <div className="w-full max-w-[420px] min-h-screen md:min-h-[844px] bg-[#fcf9f8] text-[#1c1b1b] relative overflow-hidden flex flex-col shadow-2xl md:rounded-[40px] border border-[#e5e2e1]">
          <AndroidStatusBar />
          <FocusModeView
            task={focusTask}
            onExit={() => setActiveScreen('main')}
            onCompleteTask={(id) => {
              handleToggleTask(id);
              showToast('Focus session completed!');
            }}
            onSubtaskToggle={handleSubtaskToggle}
          />
        </div>
      </div>
    );
  }

  // Render Declutter & Schedule Overwhelm Screen
  if (activeScreen === 'declutter') {
    return (
      <div className="min-h-screen bg-[#F0EDED] flex justify-center items-center p-0 md:p-6">
        <div className="w-full max-w-[440px] min-h-screen md:min-h-[860px] bg-[#fcf9f8] text-[#1c1b1b] relative overflow-y-auto flex flex-col shadow-2xl md:rounded-[40px] border border-[#e5e2e1]">
          <AndroidStatusBar />
          <DeclutterScheduleView
            onBack={() => setActiveScreen('main')}
            onApplyAllSmartChanges={handleApplyAllSmartChanges}
            onApplyProposal={handleApplyProposal}
            onDismissProposal={handleDismissProposal}
            onBreakdownTask={(t) => setBreakdownTaskTitle(t)}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex justify-center items-center p-0 md:p-6 transition-colors ${
        settings.theme === 'dark' ? 'bg-[#191919]' : 'bg-[#F0EDED]'
      }`}
    >
      {/* Device Shell (Simulating native Android viewport with 390px-440px canvas) */}
      <main className="w-full max-w-[420px] h-screen md:h-[844px] bg-[#fcf9f8] text-[#1c1b1b] relative overflow-hidden flex flex-col shadow-2xl md:rounded-[40px] border border-[#e5e2e1]">
        {/* 1. Android Status Bar */}
        <AndroidStatusBar />

        {/* 2. Top App Bar */}
        <TopAppBar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenDeclutter={() => setActiveScreen('declutter')}
          onOpenWidgets={() => setIsWidgetsOpen(true)}
          onOpenSharesheet={() => setIsSharesheetOpen(true)}
          overdueCount={overdueCount}
          calendarSynced={settings.calendarConnected}
          isOffline={settings.isOffline}
        />

        {/* 3. Main Navigation Tab View */}
        <div className="flex-1 overflow-y-auto relative">
          {currentTab === 'today' && (
            <TodayView
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onOpenTaskDetail={(t) => setSelectedTask(t)}
              onStartFocus={(t) => {
                setFocusTask(t);
                setActiveScreen('focus');
              }}
              onPlanMyDay={() => setActiveScreen('declutter')}
              onScheduleFocus={() => {
                const topFocus = tasks.find((t) => t.isFocusRecommended && t.status !== 'completed');
                if (topFocus) {
                  setFocusTask(topFocus);
                  setActiveScreen('focus');
                }
              }}
              onBreakdownTask={(t) => setBreakdownTaskTitle(t)}
              onMakeActionable={(t) => setActionabilityTaskTitle(t)}
            />
          )}

          {currentTab === 'inbox' && (
            <InboxView
              tasks={tasks}
              projects={projects}
              onToggleTask={handleToggleTask}
              onOpenTaskDetail={(t) => setSelectedTask(t)}
              onMoveToProject={handleMoveToProject}
              onDismissSuggestion={handleDismissSuggestion}
              onScheduleForToday={handleScheduleForToday}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsView
              projects={projects}
              tasks={tasks}
              onOpenTaskDetail={(t) => setSelectedTask(t)}
              onOpenQuickAddWithProject={(projectId) => {
                setQuickAddInitialText('');
                setIsQuickAddOpen(true);
              }}
            />
          )}

          {currentTab === 'ai' && (
            <AIAssistantView
              tasks={tasks}
              isOffline={settings.isOffline}
              onStartFocus={(t) => {
                setFocusTask(t);
                setActiveScreen('focus');
              }}
              onOpenDeclutter={() => setActiveScreen('declutter')}
              onOpenDailyReview={() => setIsDailyReviewOpen(true)}
              onOpenWeeklyReview={() => setIsWeeklyReviewOpen(true)}
              onBreakdownTask={(t) => setBreakdownTaskTitle(t)}
            />
          )}
        </div>

        {/* 4. Docked Floating NLP Quick-Add Bar (Visible on Today, Inbox, Projects) */}
        {currentTab !== 'ai' && (
          <FloatingQuickAddBar
            onOpenQuickAdd={(initial) => {
              setQuickAddInitialText(initial || '');
              setIsQuickAddOpen(true);
            }}
            onInstantAdd={handleInstantAdd}
            onVoiceClick={() => {
              setQuickAddInitialText('Remind me to submit the expense report next Monday morning ~15m');
              setIsQuickAddOpen(true);
            }}
          />
        )}

        {/* 5. Material 3 Bottom Navigation Bar */}
        <BottomNavBar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          inboxCount={inboxCount}
        />

        {/* 6. Native Android Gesture Bar */}
        <AndroidGestureBar />

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="absolute top-14 left-1/2 transform -translate-x-1/2 z-50 bg-[#1c1b1b] text-white px-4 py-2 rounded-full text-[12px] font-medium shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
            {toastMessage}
          </div>
        )}

        {/* Quick Add Modal Bottom Sheet */}
        <QuickAddSheet
          isOpen={isQuickAddOpen}
          initialText={quickAddInitialText}
          projects={projects}
          isOffline={settings.isOffline}
          onClose={() => setIsQuickAddOpen(false)}
          onAddTask={handleAddTask}
        />

        {/* Task Detail Modal */}
        <TaskDetailModal
          task={selectedTask}
          projects={projects}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={(updated) => {
            const newTasks = tasks.map((t) => (t.id === updated.id ? updated : t));
            updateTasks(newTasks);
            showToast('Task saved');
          }}
          onDeleteTask={(taskId) => {
            const newTasks = tasks.filter((t) => t.id !== taskId);
            updateTasks(newTasks);
            showToast('Task deleted');
          }}
          onStartFocus={(t) => {
            setFocusTask(t);
            setActiveScreen('focus');
          }}
          onTriggerBreakdown={(t) => setBreakdownTaskTitle(t)}
          onTriggerActionability={(t) => setActionabilityTaskTitle(t)}
        />

        {/* AI Task Breakdown Modal */}
        <AIBreakdownModal
          taskTitle={breakdownTaskTitle || ''}
          isOpen={!!breakdownTaskTitle}
          isOffline={settings.isOffline}
          onClose={() => setBreakdownTaskTitle(null)}
          onApplyBreakdown={handleApplyBreakdown}
        />

        {/* AI Actionability Modal */}
        <AIActionabilityModal
          taskTitle={actionabilityTaskTitle || ''}
          isOpen={!!actionabilityTaskTitle}
          isOffline={settings.isOffline}
          onClose={() => setActionabilityTaskTitle(null)}
          onSelectAlternative={handleSelectAlternative}
        />

        {/* Daily Review Modal */}
        <DailyReviewModal
          isOpen={isDailyReviewOpen}
          tasks={tasks}
          onClose={() => setIsDailyReviewOpen(false)}
          onBreakdownTask={(t) => setBreakdownTaskTitle(t)}
        />

        {/* Weekly Review Modal */}
        <WeeklyReviewModal
          isOpen={isWeeklyReviewOpen}
          tasks={tasks}
          onClose={() => setIsWeeklyReviewOpen(false)}
          onMakeActionable={(t) => setActionabilityTaskTitle(t)}
        />

        {/* Global Search */}
        <SearchView
          isOpen={isSearchOpen}
          tasks={tasks}
          projects={projects}
          onClose={() => setIsSearchOpen(false)}
          onOpenTaskDetail={(t) => setSelectedTask(t)}
        />

        {/* Widgets Preview */}
        <WidgetsPreviewModal
          isOpen={isWidgetsOpen}
          tasks={tasks}
          onClose={() => setIsWidgetsOpen(false)}
          onOpenQuickAdd={() => setIsQuickAddOpen(true)}
          onStartFocus={(t) => {
            setFocusTask(t);
            setActiveScreen('focus');
          }}
        />

        {/* Sharesheet Simulator */}
        <SharesheetModal
          isOpen={isSharesheetOpen}
          onClose={() => setIsSharesheetOpen(false)}
          onSharedContentConverted={(text) => {
            setQuickAddInitialText(text);
            setIsQuickAddOpen(true);
          }}
        />

        {/* Settings & Privacy Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          settings={settings}
          onClose={() => setIsSettingsOpen(false)}
          onUpdateSettings={(newSettings) => {
            setSettings(newSettings);
            StorageService.saveSettings(newSettings);
            showToast('Settings updated');
          }}
        />
      </main>
    </div>
  );
}
