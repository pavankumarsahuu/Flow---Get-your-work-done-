import { Task, Project, AppSettings } from '../types';

const TASKS_KEY = 'flow_tasks_v1';
const PROJECTS_KEY = 'flow_projects_v1';
const SETTINGS_KEY = 'flow_settings_v1';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'work',
    name: 'Work',
    category: 'Work',
    icon: 'work',
    color: '#293ca0',
    description: 'Core product roadmap, strategy, and cross-functional operations.',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    category: 'Work',
    icon: 'campaign',
    color: '#4355b9',
    description: 'Growth experiments, landing page copy, and product launches.',
  },
  {
    id: 'website',
    name: 'Website',
    category: 'Work',
    icon: 'language',
    color: '#384665',
    description: 'Design system tokens, web performance, and DNS infra.',
  },
  {
    id: 'finance',
    name: 'Finance',
    category: 'Work',
    icon: 'account_balance',
    color: '#293ca0',
    description: 'Quarterly reports, investor updates, invoices, and accounting.',
  },
  {
    id: 'personal',
    name: 'Personal',
    category: 'Personal',
    icon: 'person',
    color: '#505e7e',
    description: 'Health, wellness, appointments, home, and family.',
  },
  {
    id: 'infra',
    name: 'Infra',
    category: 'Work',
    icon: 'dns',
    color: '#757684',
    description: 'DevOps, DNS, deployment pipelines, and server reliability.',
  },
];

export const INITIAL_TASKS: Task[] = [
  // 1. Focus Tasks (Today)
  {
    id: 'task-1',
    title: 'Finish landing page copy',
    description: 'Focus on high-converting hero headlines and clear CTA value propositions.',
    status: 'in_progress',
    priority: 'High',
    projectId: 'marketing',
    dueDate: 'Today',
    dueTime: 'Due 12:00 PM',
    reminder: '10m before',
    estimatedDuration: 30,
    tags: ['Launch', 'Copy'],
    isFocusRecommended: true,
    postponedCount: 0,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    subtasks: [
      { id: 'sub-1', title: 'Review competitor value props', completed: true },
      { id: 'sub-2', title: 'Draft 3 hero headline options', completed: false },
      { id: 'sub-3', title: 'Write CTA microcopy', completed: false },
    ],
    aiMetadata: {
      suggestedNextStep: 'Draft headline alternatives for hero section',
      confidence: 0.98,
    },
  },
  {
    id: 'task-2',
    title: 'Reply to investor email',
    description: 'Share Q3 metrics overview and attach updated slide deck.',
    status: 'todo',
    priority: 'Normal',
    projectId: 'work',
    dueDate: 'Today',
    dueTime: '11:00 AM',
    estimatedDuration: 15,
    tags: ['Investor'],
    isFocusRecommended: true,
    postponedCount: 0,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    subtasks: [],
    aiMetadata: {
      suggestedNextStep: 'Draft concise 3-bullet response',
    },
  },
  {
    id: 'task-3',
    title: 'Book dentist appointment',
    description: 'Annual cleaning and checkup before insurance year-end.',
    status: 'todo',
    priority: 'Normal',
    projectId: 'personal',
    dueDate: 'Today',
    dueTime: '11:30 AM',
    freeWindowMatch: '11:30 Free window',
    estimatedDuration: 10,
    tags: ['Health'],
    isFocusRecommended: true,
    postponedCount: 1,
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    subtasks: [],
  },

  // 2. Remaining Today Tasks
  {
    id: 'task-4',
    title: 'Review homepage responsive layout',
    description: 'Verify tablet and mobile breakpoint typography tokens.',
    status: 'todo',
    priority: 'Normal',
    projectId: 'work',
    dueDate: 'Today',
    dueTime: '2:00 PM',
    estimatedDuration: 45,
    tags: ['Design', 'Mobile'],
    postponedCount: 0,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    subtasks: [],
  },
  {
    id: 'task-5',
    title: 'Buy groceries & coffee beans',
    description: 'Oat milk, organic fruit, whole-bean light roast espresso.',
    status: 'todo',
    priority: 'Low',
    projectId: 'personal',
    dueDate: 'Today',
    dueTime: 'Evening',
    estimatedDuration: 20,
    tags: ['Errands'],
    postponedCount: 0,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    subtasks: [],
  },
  {
    id: 'task-6',
    title: 'Check domain DNS configuration',
    description: 'Verify A records and SSL certificate propagation.',
    status: 'todo',
    priority: 'Normal',
    projectId: 'website',
    dueDate: 'Today',
    dueTime: '4:30 PM',
    estimatedDuration: 15,
    tags: ['Infra'],
    postponedCount: 0,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    subtasks: [],
  },
  {
    id: 'task-7',
    title: 'Send weekly standup recap',
    description: 'Summarize sprint velocity and blockers.',
    status: 'completed',
    priority: 'Normal',
    projectId: 'work',
    dueDate: 'Today',
    dueTime: '9:15 AM',
    completedAt: '9:15 AM',
    estimatedDuration: 15,
    tags: ['Team'],
    postponedCount: 0,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    subtasks: [],
  },

  // 3. Overdue & Carry-over Items (Batch 1 for Overwhelm Mode)
  {
    id: 'task-overdue-1',
    title: 'Finish pitch deck outline',
    description: 'Needs 10-slide outline for upcoming funding round.',
    status: 'todo',
    priority: 'High',
    projectId: 'work',
    dueDate: '2 days ago',
    estimatedDuration: 45,
    tags: ['Fundraising'],
    postponedCount: 2,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    subtasks: [],
    aiMetadata: {
      actionProposal: {
        type: 'reschedule',
        text: 'Reschedule to Friday focus block',
        target: 'Friday',
      },
    },
  },
  {
    id: 'task-overdue-2',
    title: 'Update DNS configuration',
    description: 'Nameserver migration postponed multiple times.',
    status: 'todo',
    priority: 'Normal',
    projectId: 'infra',
    dueDate: '5 days ago',
    estimatedDuration: 45,
    tags: ['Infra'],
    postponedCount: 5,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    subtasks: [],
    aiMetadata: {
      stalledCount: 5,
      actionProposal: {
        type: 'breakdown',
        text: 'Break into 3 quick checks (15m)',
      },
    },
  },
  {
    id: 'task-overdue-3',
    title: 'Research standing desks',
    description: 'Compare motorized standing desk converters and cable trays.',
    status: 'todo',
    priority: 'Low',
    projectId: 'personal',
    dueDate: '4 days ago',
    estimatedDuration: 30,
    tags: ['HomeOffice'],
    postponedCount: 3,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    subtasks: [],
    aiMetadata: {
      actionProposal: {
        type: 'archive',
        text: 'Move to Someday / Archive',
      },
    },
  },
  {
    id: 'task-overdue-4',
    title: 'Review Q3 financial report',
    description: 'Examine EBITDA, burn rate, and projected Q4 runway.',
    status: 'todo',
    priority: 'High',
    projectId: 'finance',
    dueDate: 'Yesterday',
    estimatedDuration: 60,
    tags: ['Finance'],
    postponedCount: 1,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    subtasks: [],
    aiMetadata: {
      actionProposal: {
        type: 'slot_calendar',
        text: 'Slot into today 3:30 PM (free 60m window)',
        target: '3:30 PM',
      },
    },
  },
  {
    id: 'task-overdue-5',
    title: 'Clean out cloud storage backups',
    description: 'Purge deprecated staging logs and temp snapshots.',
    status: 'todo',
    priority: 'Low',
    projectId: 'infra',
    dueDate: '3 days ago',
    estimatedDuration: 25,
    tags: ['Maintenance'],
    postponedCount: 2,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    subtasks: [],
    aiMetadata: {
      actionProposal: {
        type: 'reschedule',
        text: 'Reschedule to weekend maintenance',
        target: 'Saturday',
      },
    },
  },

  // 4. Inbox Tasks (7 Unorganized Items)
  {
    id: 'inbox-1',
    title: 'Call dentist',
    description: '',
    status: 'todo',
    priority: 'Normal',
    projectId: 'inbox',
    dueDate: 'Inbox',
    estimatedDuration: 10,
    tags: [],
    postponedCount: 0,
    createdAt: new Date().toISOString(),
    subtasks: [],
    aiMetadata: {
      suggestedDate: 'Today',
      suggestedDuration: 10,
      recommendedAction: 'Move to Personal',
    },
  },
  {
    id: 'inbox-2',
    title: 'Research headphones',
    description: 'Noise canceling for open office focus.',
    status: 'todo',
    priority: 'Low',
    projectId: 'inbox',
    dueDate: 'Inbox',
    estimatedDuration: 20,
    tags: [],
    postponedCount: 0,
    createdAt: new Date().toISOString(),
    subtasks: [],
    aiMetadata: {
      recommendedAction: 'Move to Personal',
    },
  },
  {
    id: 'inbox-3',
    title: 'Ask John about invoice',
    description: 'Verify payment terms on design contract.',
    status: 'todo',
    priority: 'Normal',
    projectId: 'inbox',
    dueDate: 'Inbox',
    estimatedDuration: 15,
    tags: [],
    postponedCount: 0,
    createdAt: new Date().toISOString(),
    subtasks: [],
    aiMetadata: {
      recommendedAction: 'Move to Finance',
    },
  },
  {
    id: 'inbox-4',
    title: 'Website idea: interactive pricing calculator',
    description: 'Let prospective users drag slider to see custom tier pricing.',
    status: 'todo',
    priority: 'Normal',
    projectId: 'inbox',
    dueDate: 'Inbox',
    estimatedDuration: 30,
    tags: [],
    postponedCount: 0,
    createdAt: new Date().toISOString(),
    subtasks: [],
    aiMetadata: {
      recommendedAction: 'Move to Website',
    },
  },
  {
    id: 'inbox-5',
    title: 'Buy groceries',
    description: '',
    status: 'todo',
    priority: 'Low',
    projectId: 'inbox',
    dueDate: 'Inbox',
    estimatedDuration: 20,
    tags: [],
    postponedCount: 0,
    createdAt: new Date().toISOString(),
    subtasks: [],
    aiMetadata: {
      recommendedAction: 'Move to Personal',
    },
  },
  {
    id: 'inbox-6',
    title: 'Schedule annual health checkup',
    description: 'Book blood panel and physical.',
    status: 'todo',
    priority: 'Normal',
    projectId: 'inbox',
    dueDate: 'Inbox',
    estimatedDuration: 15,
    tags: [],
    postponedCount: 0,
    createdAt: new Date().toISOString(),
    subtasks: [],
    aiMetadata: {
      recommendedAction: 'Move to Personal',
    },
  },
  {
    id: 'inbox-7',
    title: 'Draft brief for freelance copywriter',
    description: 'Email sequences for welcome onboarding flow.',
    status: 'todo',
    priority: 'Normal',
    projectId: 'inbox',
    dueDate: 'Inbox',
    estimatedDuration: 25,
    tags: [],
    postponedCount: 0,
    createdAt: new Date().toISOString(),
    subtasks: [],
    aiMetadata: {
      recommendedAction: 'Move to Marketing',
    },
  },
];

export const INITIAL_SETTINGS: AppSettings = {
  theme: 'light',
  notifications: 'balanced',
  autoDetectDates: true,
  autoEstimateDuration: true,
  aiScheduling: true,
  dailyReview: true,
  weeklyReview: true,
  calendarConnected: true,
  isOffline: false,
};

export const StorageService = {
  getTasks(): Task[] {
    try {
      const data = localStorage.getItem(TASKS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read tasks from localStorage', e);
    }
    this.saveTasks(INITIAL_TASKS);
    return INITIAL_TASKS;
  },

  saveTasks(tasks: Task[]) {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  },

  getProjects(): Project[] {
    try {
      const data = localStorage.getItem(PROJECTS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read projects from localStorage', e);
    }
    this.saveProjects(INITIAL_PROJECTS);
    return INITIAL_PROJECTS;
  },

  saveProjects(projects: Project[]) {
    try {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects', e);
    }
  },

  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read settings from localStorage', e);
    }
    this.saveSettings(INITIAL_SETTINGS);
    return INITIAL_SETTINGS;
  },

  saveSettings(settings: AppSettings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  },
};
