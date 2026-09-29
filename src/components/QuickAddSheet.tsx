import React, { useState, useEffect } from 'react';
import { Project, Priority } from '../types';
import { AIService, ParsedTaskResult } from '../services/aiService';

interface QuickAddSheetProps {
  isOpen: boolean;
  initialText?: string;
  projects: Project[];
  isOffline: boolean;
  onClose: () => void;
  onAddTask: (taskData: {
    title: string;
    dueDate: string;
    dueTime?: string;
    projectId: string;
    priority: Priority;
    estimatedDuration: number;
    reminder?: string;
    tags: string[];
    isMeetLinked?: boolean;
  }) => void;
}

export const QuickAddSheet: React.FC<QuickAddSheetProps> = ({
  isOpen,
  initialText = '',
  projects,
  isOffline,
  onClose,
  onAddTask,
}) => {
  const [input, setInput] = useState(
    initialText || 'Call Sarah tomorrow afternoon about the design review ~30m'
  );
  const [parsed, setParsed] = useState<ParsedTaskResult | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('work');
  const [selectedDueDate, setSelectedDueDate] = useState<string>('Tomorrow');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('Normal');
  const [activeSuggestions, setActiveSuggestions] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  // Parse NLP when input changes
  useEffect(() => {
    if (!isOpen) return;
    if (initialText) {
      setInput(initialText);
    }
  }, [isOpen, initialText]);

  useEffect(() => {
    if (!isOpen || !input.trim()) return;

    const timer = setTimeout(async () => {
      setIsParsing(true);
      try {
        const result = await AIService.parseTask(input, isOffline);
        setParsed(result);
        setSelectedDueDate(result.dueDate || 'Today');
        setSelectedPriority(result.priority || 'Normal');
        // Match project
        const found = projects.find(
          (p) => p.name.toLowerCase() === result.projectSuggestion.toLowerCase()
        );
        if (found) {
          setSelectedProjectId(found.id);
        }
      } catch (err) {
        console.error('NLP parse error', err);
      } finally {
        setIsParsing(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [input, isOpen, isOffline, projects]);

  if (!isOpen) return null;

  const handleToggleSuggestion = (sug: string) => {
    if (activeSuggestions.includes(sug)) {
      setActiveSuggestions(activeSuggestions.filter((s) => s !== sug));
      if (sug === 'High Priority') setSelectedPriority('Normal');
    } else {
      setActiveSuggestions([...activeSuggestions, sug]);
      if (sug === 'High Priority') setSelectedPriority('High');
    }
  };

  const handleVoiceCapture = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Speech recognition not natively supported in this browser, provide friendly sample text
      setInput('Remind me to submit the expense report next Monday morning ~15m');
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setInput('Finish presentation before Friday, probably 2 hours');
    }
  };

  const handleSave = () => {
    const title = parsed?.title || input.trim();
    if (!title) return;

    const reminder = activeSuggestions.includes('Add reminder 10m before')
      ? '10m before'
      : undefined;
    const isMeet = activeSuggestions.includes('Link Google Meet');

    onAddTask({
      title,
      dueDate: selectedDueDate,
      dueTime: parsed?.time || '2:00 PM',
      projectId: selectedProjectId,
      priority: selectedPriority,
      estimatedDuration: parsed?.estimatedDuration || 30,
      reminder,
      tags: parsed?.context ? [parsed.context] : [],
      isMeetLinked: isMeet,
    });
    onClose();
  };

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Scrim Shade Layer */}
      <div
        className="absolute inset-0 bg-[#313030]/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* MODAL BOTTOM SHEET */}
      <section className="relative z-10 w-full max-w-xl mx-auto bg-white rounded-t-[28px] border-t border-[#e5e2e1] flex flex-col shadow-2xl max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Drag Handle */}
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-[#e5e2e1] rounded-full" />
        </div>

        {/* Header: Close, Title, Voice Command */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#f6f3f2]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cancel quick add"
            className="text-[#454652] hover:bg-[#f6f3f2] rounded-full p-2 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-[16px] font-semibold text-[#1c1b1b]">Quick Add</span>
            <span className="material-symbols-outlined text-[#293ca0] text-[18px]">
              auto_awesome
            </span>
          </div>

          <button
            type="button"
            onClick={handleVoiceCapture}
            aria-label="Voice input"
            title="Speech input"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors active:scale-95 ${
              isListening
                ? 'bg-rose-100 text-rose-600 animate-pulse'
                : 'bg-[#f6f3f2] text-[#293ca0] hover:bg-[#eae7e7]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">mic</span>
          </button>
        </div>

        {/* Scrollable Sheet Core Body */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Natural Language Input Area */}
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="New task input"
              rows={3}
              placeholder="Add task or thought... e.g. Finish presentation before Friday, probably 2 hours"
              className="w-full resize-none bg-transparent border-0 p-0 text-[16px] text-[#1c1b1b] focus:ring-0 placeholder:text-[#757684] leading-relaxed"
              autoFocus
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#293ca0] flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                {isParsing ? 'Analyzing intent...' : 'Natural language parsed'}
              </span>
              <span className="text-[11px] text-[#757684]">
                {isOffline ? 'Offline NLP active' : 'NLP Active'}
              </span>
            </div>
          </div>

          {/* Live AI Structured Parsing Preview Grid / Chips (Matching Image 1.png) */}
          {parsed && (
            <div className="bg-[#f6f3f2] rounded-xl p-3 border border-[#e5e2e1] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#454652]">Live Extraction</span>
                <span className="text-[11px] font-semibold text-[#293ca0]">
                  {Math.round(parsed.confidence * 100)}% confidence
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {/* Task Entity */}
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-[#e5e2e1]">
                  <span className="material-symbols-outlined text-[#293ca0] text-[15px]">
                    check_circle
                  </span>
                  <span className="text-[13px] font-medium text-[#1c1b1b]">{parsed.title}</span>
                </div>

                {/* Date Entity */}
                <div className="flex items-center gap-1.5 bg-[#dee0ff] px-2.5 py-1 rounded-lg border border-[#bac3ff]">
                  <span className="material-symbols-outlined text-[#00105c] text-[15px]">
                    today
                  </span>
                  <span className="text-[13px] font-semibold text-[#00105c]">
                    {selectedDueDate || parsed.dueDate}
                  </span>
                </div>

                {/* Time Entity */}
                {parsed.time && (
                  <div className="flex items-center gap-1.5 bg-[#dee0ff] px-2.5 py-1 rounded-lg border border-[#bac3ff]">
                    <span className="material-symbols-outlined text-[#00105c] text-[15px]">
                      schedule
                    </span>
                    <span className="text-[13px] font-semibold text-[#00105c]">
                      {parsed.time}
                    </span>
                  </div>
                )}

                {/* Context Entity */}
                {parsed.context && (
                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-[#e5e2e1]">
                    <span className="material-symbols-outlined text-[#384665] text-[15px]">
                      folder
                    </span>
                    <span className="text-[13px] text-[#1c1b1b]">{parsed.context}</span>
                  </div>
                )}

                {/* Duration Entity */}
                {parsed.estimatedDuration > 0 && (
                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-[#e5e2e1]">
                    <span className="material-symbols-outlined text-[#304ed0] text-[15px]">
                      timer
                    </span>
                    <span className="text-[13px] text-[#1c1b1b]">
                      {parsed.estimatedDuration} min
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Smart Proactive AI Suggestions (Matching Image 1.png) */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-[#454652]">Proactive Suggestions</span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => handleToggleSuggestion('Add reminder 10m before')}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-medium transition-all active:scale-95 ${
                  activeSuggestions.includes('Add reminder 10m before')
                    ? 'bg-[#dee0ff] border-[#293ca0] text-[#00105c]'
                    : 'bg-[#f0eded] border-[#e5e2e1] text-[#1c1b1b] hover:bg-[#eae7e7]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-[#293ca0]">
                  notifications
                </span>
                <span>Add reminder 10m before</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleSuggestion('Link Google Meet')}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-medium transition-all active:scale-95 ${
                  activeSuggestions.includes('Link Google Meet')
                    ? 'bg-[#dee0ff] border-[#293ca0] text-[#00105c]'
                    : 'bg-[#f0eded] border-[#e5e2e1] text-[#1c1b1b] hover:bg-[#eae7e7]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-[#304ed0]">
                  video_call
                </span>
                <span>Link Google Meet</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleSuggestion('High Priority')}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-medium transition-all active:scale-95 ${
                  selectedPriority === 'High'
                    ? 'bg-[#ffdad6] border-[#ba1a1a] text-[#93000a]'
                    : 'bg-[#f0eded] border-[#e5e2e1] text-[#1c1b1b] hover:bg-[#eae7e7]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">
                  priority_high
                </span>
                <span>High Priority</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Toggle Toolbar (Above Keyboard / System Nav) */}
        <div className="p-4 border-t border-[#f6f3f2] bg-white/90 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between">
            {/* Left: Meta Pickers */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Project Picker */}
              <div className="relative">
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  aria-label="Select Project"
                  className="appearance-none flex items-center gap-1.5 px-2.5 py-1.5 pr-6 rounded-lg bg-[#f6f3f2] hover:bg-[#eae7e7] text-[#1c1b1b] text-[12px] font-medium border border-[#e5e2e1] transition-colors cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined text-[14px] text-[#757684] absolute right-1.5 top-2 pointer-events-none">
                  expand_more
                </span>
              </div>

              {/* Due Date Picker */}
              <div className="relative">
                <select
                  value={selectedDueDate}
                  onChange={(e) => setSelectedDueDate(e.target.value)}
                  aria-label="Select Due Date"
                  className="appearance-none flex items-center gap-1 px-2.5 py-1.5 pr-6 rounded-lg bg-[#f6f3f2] hover:bg-[#eae7e7] text-[#1c1b1b] text-[12px] font-medium border border-[#e5e2e1] transition-colors cursor-pointer"
                >
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="Friday">Friday</option>
                  <option value="Next week">Next week</option>
                  <option value="Someday">Someday</option>
                </select>
                <span className="material-symbols-outlined text-[14px] text-[#757684] absolute right-1.5 top-2 pointer-events-none">
                  expand_more
                </span>
              </div>

              {/* Priority Selector */}
              <button
                type="button"
                onClick={() => {
                  const next: Priority =
                    selectedPriority === 'Normal'
                      ? 'High'
                      : selectedPriority === 'High'
                      ? 'Low'
                      : 'Normal';
                  setSelectedPriority(next);
                }}
                title={`Priority: ${selectedPriority}`}
                className={`p-1.5 rounded-lg border text-[14px] transition-colors active:scale-95 ${
                  selectedPriority === 'High'
                    ? 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/30'
                    : selectedPriority === 'Low'
                    ? 'bg-slate-100 text-slate-600 border-slate-300'
                    : 'bg-[#f6f3f2] hover:bg-[#eae7e7] text-[#454652] border-[#e5e2e1]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">flag</span>
              </button>
            </div>

            {/* Right: Add Task Primary Action Button */}
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#4355b9] text-white font-medium text-[13px] hover:bg-[#293ca0] transition-all active:scale-95 shadow-xs"
            >
              <span>Add Task</span>
              <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
            </button>
          </div>

          {/* Android Gesture Bar */}
          <div className="w-full flex justify-center pt-1">
            <div className="w-28 h-1 bg-[#c5c5d4]/60 rounded-full" />
          </div>
        </div>
      </section>
    </div>
  );
};
