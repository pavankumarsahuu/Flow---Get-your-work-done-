import React from 'react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  settings: AppSettings;
  onClose: () => void;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#fcf9f8] rounded-3xl border border-[#e5e2e1] p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#293ca0] text-[22px]">
              settings
            </span>
            <h2 className="text-[18px] font-semibold text-[#1c1b1b]">Settings &amp; Privacy</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#757684] hover:text-[#1c1b1b] p-1"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Offline Simulation Toggle */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#e5e2e1] space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[13px] font-semibold text-[#1c1b1b] block">
                Simulate Offline Mode
              </span>
              <span className="text-[11px] text-[#757684]">
                Tests local-first Room DB and instant heuristic task parsing.
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                onUpdateSettings({ ...settings, isOffline: !settings.isOffline })
              }
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.isOffline ? 'bg-amber-500' : 'bg-[#e5e2e1]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.isOffline ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#e5e2e1] space-y-2 shadow-xs">
          <span className="text-[11px] font-semibold text-[#757684] uppercase tracking-wider block">
            Appearance
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {(['system', 'light', 'dark'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onUpdateSettings({ ...settings, theme: mode })}
                className={`py-1.5 rounded-xl text-[12px] font-semibold capitalize border transition-all ${
                  settings.theme === mode
                    ? 'bg-[#dee0ff] border-[#293ca0] text-[#00105c]'
                    : 'bg-[#f6f3f2] border-[#e5e2e1] text-[#454652]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#e5e2e1] space-y-2 shadow-xs">
          <span className="text-[11px] font-semibold text-[#757684] uppercase tracking-wider block">
            Notifications (Contextual Channels)
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {(['minimal', 'balanced', 'frequent'] as const).map((pref) => (
              <button
                key={pref}
                type="button"
                onClick={() => onUpdateSettings({ ...settings, notifications: pref })}
                className={`py-1.5 rounded-xl text-[12px] font-semibold capitalize border transition-all ${
                  settings.notifications === pref
                    ? 'bg-[#dee0ff] border-[#293ca0] text-[#00105c]'
                    : 'bg-[#f6f3f2] border-[#e5e2e1] text-[#454652]'
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        {/* AI Capabilities Toggles */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#e5e2e1] space-y-3 shadow-xs">
          <span className="text-[11px] font-semibold text-[#757684] uppercase tracking-wider block">
            Flow AI Engine
          </span>
          <div className="space-y-2 text-[13px]">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[#1c1b1b]">Natural Language Auto-Extraction</span>
              <input
                type="checkbox"
                checked={settings.autoDetectDates}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, autoDetectDates: e.target.checked })
                }
                className="rounded text-[#4355b9] focus:ring-0"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[#1c1b1b]">Smart Capacity Scheduling</span>
              <input
                type="checkbox"
                checked={settings.aiScheduling}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, aiScheduling: e.target.checked })
                }
                className="rounded text-[#4355b9] focus:ring-0"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[#1c1b1b]">Evening Daily Review</span>
              <input
                type="checkbox"
                checked={settings.dailyReview}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, dailyReview: e.target.checked })
                }
                className="rounded text-[#4355b9] focus:ring-0"
              />
            </label>
          </div>
        </div>

        {/* Privacy & Local-First Philosophy (Required Feature 37) */}
        <div className="bg-[#f0eded] p-3.5 rounded-2xl border border-[#e5e2e1] space-y-1.5">
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#1c1b1b]">
            <span className="material-symbols-outlined text-[16px] text-[#293ca0]">
              verified_user
            </span>
            <span>Privacy &amp; Data Transparency</span>
          </div>
          <p className="text-[11px] text-[#454652] leading-relaxed">
            • <strong>Local-first:</strong> All tasks, subtasks, notes, and habits are stored on-device.
            <br />
            • <strong>Transient AI:</strong> Text is passed to Gemini solely to extract dates, tags, and steps. Never used for model training.
            <br />
            • <strong>Calendar Sandboxing:</strong> Android Calendar events are read locally to compute free windows without saving external meeting contents.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#293ca0] text-white text-[13px] font-semibold hover:bg-[#4355b9]"
        >
          Save &amp; Close
        </button>
      </div>
    </div>
  );
};
