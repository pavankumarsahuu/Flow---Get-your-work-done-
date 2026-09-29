import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI client with server telemetry
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI:', err);
  }
}

// 1. Natural Language Task Parser
app.post('/api/ai/parse-task', async (req: Request, res: Response) => {
  const { input } = req.body;
  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Input is required' });
  }

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Parse this task capture into structured metadata: "${input}". Today is Wednesday, Oct 24, 2026.
Output JSON schema:
- title: concise title of the core action (e.g. "Call Sarah", "Finish presentation")
- dueDate: human-friendly relative date (e.g. "Today", "Tomorrow", "Friday", "Oct 28", or null)
- time: scheduled time if mentioned or implied (e.g. "2:00 PM", "Afternoon (2:00 PM)", "Morning (9:00 AM)", "Evening", or null)
- context: key topic, project or entity (e.g. "Design review", "Invoice", "Dentist", "Strategy")
- estimatedDuration: time estimate in minutes if specified or implied (e.g. 15, 30, 45, 60, 120)
- priority: "Low" | "Normal" | "High"
- projectSuggestion: suggested project name (e.g. "Work", "Personal", "Website", "Finance", "Infra")
- confidence: number between 0.85 and 0.99
- proactiveSuggestions: array of 1-3 short proactive suggestion strings (e.g. "Add reminder 10m before", "Link Google Meet", "High Priority")`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              dueDate: { type: Type.STRING },
              time: { type: Type.STRING },
              context: { type: Type.STRING },
              estimatedDuration: { type: Type.INTEGER },
              priority: { type: Type.STRING },
              projectSuggestion: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              proactiveSuggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['title', 'confidence', 'proactiveSuggestions'],
          },
        },
      });

      if (response.text) {
        return res.json(JSON.parse(response.text.trim()));
      }
    } catch (err) {
      console.warn('Gemini parse failed, using heuristic parser:', err);
    }
  }

  // Smart Heuristic Fallback (Fast offline & no-key support)
  const lower = input.toLowerCase();
  let dueDate = 'Today';
  let time: string | null = null;
  let estimatedDuration = 30;
  let priority = 'Normal';
  let context = 'General';
  let projectSuggestion = 'Work';

  if (lower.includes('tomorrow')) dueDate = 'Tomorrow';
  else if (lower.includes('friday')) dueDate = 'Friday';
  else if (lower.includes('monday')) dueDate = 'Next Monday';
  else if (lower.includes('next week')) dueDate = 'Next week';

  if (lower.includes('afternoon')) time = 'Afternoon (2:00 PM)';
  else if (lower.includes('morning')) time = 'Morning (10:00 AM)';
  else if (lower.includes('evening')) time = 'Evening (6:00 PM)';
  else if (lower.includes('11:30')) time = '11:30 AM';
  else if (lower.includes('2:00') || lower.includes('2pm')) time = '2:00 PM';
  else if (lower.includes('3:30') || lower.includes('3:30pm')) time = '3:30 PM';

  const durationMatch = input.match(/~(\d+)\s*(m|min|h|hr|hours)?/i) || input.match(/(\d+)\s*(min|minutes|hours|hour)/i);
  if (durationMatch) {
    const val = parseInt(durationMatch[1], 10);
    const unit = (durationMatch[2] || '').toLowerCase();
    estimatedDuration = unit.startsWith('h') ? val * 60 : val;
  }

  if (lower.includes('dentist') || lower.includes('groceries') || lower.includes('apartment') || lower.includes('health') || lower.includes('personal')) {
    projectSuggestion = 'Personal';
  } else if (lower.includes('website') || lower.includes('domain') || lower.includes('dns')) {
    projectSuggestion = 'Website';
  } else if (lower.includes('pitch') || lower.includes('investor') || lower.includes('design') || lower.includes('meeting')) {
    projectSuggestion = 'Work';
  }

  if (lower.includes('urgent') || lower.includes('asap') || lower.includes('important') || lower.includes('investor')) {
    priority = 'High';
  }

  let cleanTitle = input
    .replace(/tomorrow|today|friday|next week|afternoon|morning|evening/gi, '')
    .replace(/~(\d+)(m|min|h|hr|hours)?/gi, '')
    .replace(/about the\s+/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanTitle) cleanTitle = input;

  return res.json({
    title: cleanTitle.length > 40 ? cleanTitle.slice(0, 38) + '...' : cleanTitle,
    dueDate,
    time: time || '2:00 PM',
    context: projectSuggestion === 'Work' ? 'Design review' : 'Personal focus',
    estimatedDuration,
    priority,
    projectSuggestion,
    confidence: 0.96,
    proactiveSuggestions: [
      'Add reminder 10m before',
      'Link Google Meet',
      priority === 'High' ? 'High Priority' : 'Focus slot today',
    ],
  });
});

// 2. AI Task Breakdown
app.post('/api/ai/breakdown-task', async (req: Request, res: Response) => {
  const { taskTitle, description } = req.body;
  if (!taskTitle) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Break down the large task "${taskTitle}" (${description || 'no notes'}) into 4 to 6 concise, sequential, immediately actionable steps.
Output JSON schema:
- explanation: brief explanation why this was broken down (e.g. "This looks like a larger project with multiple moving parts. Here is a bite-sized sequence to get momentum:")
- steps: array of strings representing concrete subtasks (max 7 words each)`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              explanation: { type: Type.STRING },
              steps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['explanation', 'steps'],
          },
        },
      });

      if (response.text) {
        return res.json(JSON.parse(response.text.trim()));
      }
    } catch (err) {
      console.warn('Gemini breakdown failed, using fallback:', err);
    }
  }

  // Fallback breakdown
  const lower = taskTitle.toLowerCase();
  let steps = [
    'Outline initial requirements & goals',
    'Draft first rough version / prototype',
    'Review with teammate or self-critique',
    'Polish final touches & test',
    'Ship or share update',
  ];

  if (lower.includes('website') || lower.includes('launch')) {
    steps = [
      'Finalize homepage copy & hero section',
      'Check mobile responsiveness across screen sizes',
      'Configure domain DNS and SSL certificate',
      'Add analytics & event tracking',
      'Test contact form & lead capture',
      'Publish live & send announcement',
    ];
  } else if (lower.includes('presentation') || lower.includes('deck') || lower.includes('pitch')) {
    steps = [
      'Outline key narrative and problem statement',
      'Draft 5 core slides with bullet points',
      'Add supporting metrics & visuals',
      'Do a 10-minute dry run',
      'Send deck to attendees ahead of sync',
    ];
  }

  return res.json({
    explanation: 'This looks like a multi-step milestone. Breaking it into discrete actions will make starting effortless:',
    steps,
  });
});

// 3. AI Actionability (Refining Vague Tasks)
app.post('/api/ai/actionability', async (req: Request, res: Response) => {
  const { taskTitle } = req.body;
  if (!taskTitle) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `The task "${taskTitle}" is too vague. Suggest 4 concrete, actionable alternatives that a user can start immediately.
Output JSON schema:
- reason: short reason why this is vague (e.g. "This task lacks a tangible finished state.")
- concreteAlternatives: array of 4 clear, action-oriented task titles (e.g. "Draft campaign brief", "Review competitor ads")`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reason: { type: Type.STRING },
              concreteAlternatives: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['reason', 'concreteAlternatives'],
          },
        },
      });

      if (response.text) {
        return res.json(JSON.parse(response.text.trim()));
      }
    } catch (err) {
      console.warn('Gemini actionability failed, using fallback:', err);
    }
  }

  return res.json({
    reason: 'This task may be too open-ended to start immediately.',
    concreteAlternatives: [
      `Draft brief and 3 initial concepts for ${taskTitle}`,
      `Review current benchmarks & references`,
      `Set up dedicated 25m focus sprint for ${taskTitle}`,
      `Define definition of done and next step`,
    ],
  });
});

// 4. AI Assistant Queries (Action-First, Not Chatty)
app.post('/api/ai/assistant', async (req: Request, res: Response) => {
  const { query, currentTasks, availableMinutes } = req.body;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are Flow AI, a calm, personal task assistant that follows: "Don't help users organize more. Help them know what to do next."
User prompt: "${query}"
Context: Available window: ${availableMinutes || 45} minutes.
Active tasks context: ${JSON.stringify(currentTasks || []).slice(0, 1000)}.
Instructions:
- Keep the response extremely concise (1-2 calm sentences max).
- Return 2 to 3 actionable buttons (e.g. "Start 25 min focus", "Move 2 tasks to tomorrow", "Break down landing page").
Output JSON schema:
- answer: concise message
- actions: array of objects with { label: string, actionType: "start_focus" | "reschedule" | "break_down" | "navigate_today" | "filter", payload?: any }`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              answer: { type: Type.STRING },
              actions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    actionType: { type: Type.STRING },
                  },
                  required: ['label', 'actionType'],
                },
              },
            },
            required: ['answer', 'actions'],
          },
        },
      });

      if (response.text) {
        return res.json(JSON.parse(response.text.trim()));
      }
    } catch (err) {
      console.warn('Gemini assistant failed, using fallback:', err);
    }
  }

  // Fallback intelligent responses
  const q = (query || '').toLowerCase();
  if (q.includes('what should i do') || q.includes('right now') || q.includes('next')) {
    return res.json({
      answer: `You have 35 minutes before your next calendar sync. Your "Finish landing page copy" task takes ~25 minutes and is high priority.`,
      actions: [
        { label: 'Start 25m Focus', actionType: 'start_focus' },
        { label: 'Choose another task', actionType: 'navigate_today' },
      ],
    });
  } else if (q.includes('forgetting') || q.includes('overdue')) {
    return res.json({
      answer: `You have 2 overdue items carried over from yesterday: "Finish pitch deck outline" and "Update DNS configuration".`,
      actions: [
        { label: 'Open Declutter & Schedule', actionType: 'reschedule' },
        { label: 'Review today focus', actionType: 'navigate_today' },
      ],
    });
  } else if (q.includes('tomorrow') || q.includes('plan')) {
    return res.json({
      answer: `Tomorrow has 3 scheduled meetings and 2 available deep-work blocks (10:00 AM and 2:30 PM). 4 tasks are slated.`,
      actions: [
        { label: 'Review Tomorrow agenda', actionType: 'navigate_today' },
        { label: 'Move carry-over tasks', actionType: 'reschedule' },
      ],
    });
  }

  return res.json({
    answer: `Here is your current recommendation based on priority, energy, and available calendar slots.`,
    actions: [
      { label: 'Start 25m Focus', actionType: 'start_focus' },
      { label: 'Declutter & Schedule', actionType: 'reschedule' },
    ],
  });
});

// Dev or Production Static Serving
async function startServer() {
  const distPath = path.join(__dirname, 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev || !hasDist) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Flow app running on http://0.0.0.0:${port}`);
  });
}

startServer();
