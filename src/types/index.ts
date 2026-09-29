export type Priority = 'Low' | 'Normal' | 'High';

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'archived';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface AIMetadata {
  detectedIntent?: string;
  suggestedDate?: string;
  suggestedTime?: string;
  suggestedDuration?: number;
  confidence?: number;
  suggestedNextStep?: string;
  stalledCount?: number;
  recommendedAction?: string;
  actionProposal?: {
    type: 'reschedule' | 'breakdown' | 'archive' | 'slot_calendar';
    text: string;
    target?: string;
  };
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  projectId: string;
  parentTaskId?: string;
  dueDate: string; // 'Today', 'Tomorrow', 'Friday', 'Next week', or YYYY-MM-DD
  dueTime?: string; // '12:00 PM', '2:00 PM', 'Evening', etc.
  reminder?: string;
  recurrenceRule?: string; // 'None' | 'Every day' | 'Weekdays' | 'Weekly' | 'Every 7 days after completion'
  estimatedDuration: number; // in minutes
  actualDuration?: number;
  tags: string[];
  subtasks: Subtask[];
  createdAt: string;
  completedAt?: string;
  postponedCount: number;
  lastPostponedAt?: string;
  source?: 'quick_add' | 'voice' | 'sharesheet' | 'ai_breakdown' | 'inbox';
  isFocusRecommended?: boolean;
  freeWindowMatch?: string; // e.g. '11:30 Free window'
  aiMetadata?: AIMetadata;
}

export interface Project {
  id: string;
  name: string;
  category: 'Work' | 'Personal';
  icon: string;
  color: string;
  description: string;
}

export type NavigationTab = 'today' | 'inbox' | 'projects' | 'ai';

export interface CalendarSlot {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  isFree: boolean;
  category: 'meeting' | 'sync' | 'focus' | 'open';
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: 'minimal' | 'balanced' | 'frequent';
  autoDetectDates: boolean;
  autoEstimateDuration: boolean;
  aiScheduling: boolean;
  dailyReview: boolean;
  weeklyReview: boolean;
  calendarConnected: boolean;
  isOffline: boolean;
}
