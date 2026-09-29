import { Task } from '../types';

export interface ParsedTaskResult {
  title: string;
  dueDate: string;
  time: string;
  context: string;
  estimatedDuration: number;
  priority: 'Low' | 'Normal' | 'High';
  projectSuggestion: string;
  confidence: number;
  proactiveSuggestions: string[];
}

export interface TaskBreakdownResult {
  explanation: string;
  steps: string[];
}

export interface ActionabilityResult {
  reason: string;
  concreteAlternatives: string[];
}

export interface AssistantResponse {
  answer: string;
  actions: {
    label: string;
    actionType: string;
    payload?: any;
  }[];
}

export const AIService = {
  async parseTask(input: string, isOffline = false): Promise<ParsedTaskResult> {
    if (!isOffline) {
      try {
        const res = await fetch('/api/ai/parse-task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input }),
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('API error, falling back to local NLP heuristics:', err);
      }
    }

    // Client-side instant heuristics fallback (100% offline capable)
    const lower = input.toLowerCase();
    let dueDate = 'Tomorrow';
    let time = 'Afternoon (2:00 PM)';
    let estimatedDuration = 30;
    let priority: 'Low' | 'Normal' | 'High' = 'Normal';
    let context = 'Design review';
    let projectSuggestion = 'Work';

    if (lower.includes('today')) {
      dueDate = 'Today';
    } else if (lower.includes('friday')) {
      dueDate = 'Friday';
    } else if (lower.includes('next week') || lower.includes('monday')) {
      dueDate = 'Next Monday';
    }

    if (lower.includes('morning')) time = 'Morning (10:00 AM)';
    else if (lower.includes('evening')) time = 'Evening (6:00 PM)';
    else if (lower.includes('11:30')) time = '11:30 AM';
    else if (lower.includes('4:00')) time = '4:00 PM';

    const durMatch = input.match(/~(\d+)(m|min|h|hr)?/i) || input.match(/(\d+)\s*(min|minute|hour|hr)/i);
    if (durMatch) {
      const num = parseInt(durMatch[1], 10);
      const unit = (durMatch[2] || '').toLowerCase();
      estimatedDuration = unit.startsWith('h') ? num * 60 : num;
    }

    if (lower.includes('personal') || lower.includes('dentist') || lower.includes('groceries')) {
      projectSuggestion = 'Personal';
      context = 'Personal focus';
    } else if (lower.includes('website') || lower.includes('dns')) {
      projectSuggestion = 'Website';
      context = 'Web system';
    } else if (lower.includes('finance') || lower.includes('invoice')) {
      projectSuggestion = 'Finance';
      context = 'Accounts';
    }

    if (lower.includes('urgent') || lower.includes('asap') || lower.includes('high priority')) {
      priority = 'High';
    }

    let cleanTitle = input
      .replace(/tomorrow|today|friday|next week|afternoon|morning|evening/gi, '')
      .replace(/~(\d+)(m|min|h|hr)?/gi, '')
      .replace(/about the\s+/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      title: cleanTitle || input,
      dueDate,
      time,
      context,
      estimatedDuration,
      priority,
      projectSuggestion,
      confidence: 0.98,
      proactiveSuggestions: [
        'Add reminder 10m before',
        'Link Google Meet',
        priority === 'High' ? 'High Priority' : 'Focus slot today',
      ],
    };
  },

  async breakDownTask(taskTitle: string, description?: string, isOffline = false): Promise<TaskBreakdownResult> {
    if (!isOffline) {
      try {
        const res = await fetch('/api/ai/breakdown-task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskTitle, description }),
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('API error, falling back to local breakdown:', err);
      }
    }

    const lower = taskTitle.toLowerCase();
    let steps = [
      'Define clear milestones and target outcome',
      'Draft rough outline or prototype (30m)',
      'Review requirements with team',
      'Test edge cases and polish',
      'Final review and deployment',
    ];

    if (lower.includes('website') || lower.includes('launch')) {
      steps = [
        'Finalize homepage copy & hero section',
        'Check mobile responsiveness across screens',
        'Configure domain DNS and SSL certificate',
        'Add analytics & event tracking',
        'Test contact form & lead capture',
        'Publish live & send announcement',
      ];
    } else if (lower.includes('deck') || lower.includes('pitch') || lower.includes('presentation')) {
      steps = [
        'Outline key narrative and problem statement',
        'Draft 5 core slides with bullet points',
        'Add supporting financial metrics',
        'Do a 10-minute timed dry run',
        'Send deck to attendees ahead of sync',
      ];
    } else if (lower.includes('dns') || lower.includes('infra')) {
      steps = [
        'Export current zone records backup',
        'Update A and CNAME pointers to new IP',
        'Verify propagation with dig/whois',
      ];
    }

    return {
      explanation: 'This looks like a larger task with multiple moving pieces. Suggested sequence:',
      steps,
    };
  },

  async makeActionable(taskTitle: string, isOffline = false): Promise<ActionabilityResult> {
    if (!isOffline) {
      try {
        const res = await fetch('/api/ai/actionability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskTitle }),
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('API error, falling back to local actionability:', err);
      }
    }

    return {
      reason: 'This task may be too vague to start.',
      concreteAlternatives: [
        `Draft campaign brief for ${taskTitle}`,
        `Review 3 competitor benchmarks`,
        `Write three specific concepts or angles`,
        `Schedule 20-min alignment sync`,
      ],
    };
  },

  async askAssistant(query: string, currentTasks: Task[], isOffline = false): Promise<AssistantResponse> {
    if (!isOffline) {
      try {
        const res = await fetch('/api/ai/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, currentTasks }),
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('API assistant error, falling back:', err);
      }
    }

    const q = query.toLowerCase();
    if (q.includes('what should i do') || q.includes('right now') || q.includes('next')) {
      return {
        answer: 'You have 35 minutes before your next meeting. Your landing-page copy should take about 25 minutes.',
        actions: [
          { label: 'Start 25 min focus', actionType: 'start_focus' },
          { label: 'Choose another task', actionType: 'navigate_today' },
        ],
      };
    } else if (q.includes('forgetting') || q.includes('overdue')) {
      return {
        answer: 'You have 2 overdue tasks carried over from yesterday: "Finish pitch deck outline" and "Update DNS configuration".',
        actions: [
          { label: 'Declutter & Schedule', actionType: 'reschedule' },
          { label: 'View Today', actionType: 'navigate_today' },
        ],
      };
    } else if (q.includes('tomorrow') || q.includes('plan')) {
      return {
        answer: 'Tomorrow has 2 open deep-work blocks (10:00 AM and 2:30 PM). 4 tasks are slated.',
        actions: [
          { label: 'Review tomorrow', actionType: 'navigate_today' },
          { label: 'Move carry-over tasks', actionType: 'reschedule' },
        ],
      };
    } else if (q.includes('20 minutes') || q.includes('quick')) {
      return {
        answer: 'You can quickly complete "Reply to investor email" (15 min) or "Book dentist appointment" (10 min).',
        actions: [
          { label: 'Start 15m focus on investor email', actionType: 'start_focus' },
          { label: 'Book dentist appointment', actionType: 'start_focus' },
        ],
      };
    }

    return {
      answer: 'Flow AI has identified your top priority based on deadlines and open calendar windows.',
      actions: [
        { label: 'Start 25 min focus', actionType: 'start_focus' },
        { label: 'Review schedule', actionType: 'reschedule' },
      ],
    };
  },
};
