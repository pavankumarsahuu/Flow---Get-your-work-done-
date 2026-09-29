import React, { useState } from 'react';

interface SharesheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSharedContentConverted: (text: string) => void;
}

export const SharesheetModal: React.FC<SharesheetModalProps> = ({
  isOpen,
  onClose,
  onSharedContentConverted,
}) => {
  if (!isOpen) return null;

  const [sharedText, setSharedText] = useState(
    'https://android-developers.googleblog.com/2026/compose-architecture-guidelines.html'
  );

  const presets = [
    {
      label: 'Shared Chrome Article',
      text: 'Read article: https://android-developers.googleblog.com/2026/compose.html ~20m',
    },
    {
      label: 'Shared Message from Slack/WhatsApp',
      text: 'Call John about the proposal tomorrow afternoon ~30m',
    },
    {
      label: 'Shared Email Note',
      text: 'Review invoice from contractor before Friday 4pm',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#e5e2e1] p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#293ca0] text-[20px]">
              share
            </span>
            <h2 className="text-[17px] font-semibold text-[#1c1b1b]">
              Android Sharesheet Simulator
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#757684] hover:text-[#1c1b1b] p-1"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="text-[13px] text-[#454652]">
          Flow integrates natively with the Android Sharesheet. Share any link or text from Chrome,
          Gmail, or Slack directly into Flow:
        </p>

        {/* Preset sample shares */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-[#757684] uppercase tracking-wider">
            Sample Incoming Shares
          </span>
          <div className="space-y-1.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSharedText(p.text)}
                className="w-full p-2.5 bg-[#f6f3f2] hover:bg-[#dee0ff] text-left rounded-xl text-[12px] text-[#1c1b1b] font-medium transition-colors"
              >
                <span className="block font-semibold text-[#293ca0] text-[11px] mb-0.5">
                  {p.label}
                </span>
                <span className="truncate block text-[#757684]">{p.text}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <textarea
            value={sharedText}
            onChange={(e) => setSharedText(e.target.value)}
            rows={2}
            className="w-full bg-[#f6f3f2] border border-[#e5e2e1] rounded-xl p-3 text-[13px] text-[#1c1b1b] focus:ring-1 focus:ring-[#4355b9] resize-none"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              onSharedContentConverted(sharedText);
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-[#4355b9] text-white text-[13px] font-semibold hover:bg-[#293ca0] transition-colors"
          >
            Convert to Task in Quick Add
          </button>
        </div>
      </div>
    </div>
  );
};
