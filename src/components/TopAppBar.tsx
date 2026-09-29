import React from 'react';

interface TopAppBarProps {
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onOpenDeclutter: () => void;
  onOpenWidgets: () => void;
  onOpenSharesheet: () => void;
  overdueCount: number;
  calendarSynced: boolean;
  isOffline: boolean;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onOpenSearch,
  onOpenSettings,
  onOpenDeclutter,
  onOpenWidgets,
  onOpenSharesheet,
  overdueCount,
  calendarSynced,
  isOffline,
}) => {
  return (
    <nav className="flex justify-between items-center w-full px-4 py-2.5 bg-[#fcf9f8] border-b border-[#e5e2e1] z-20 transition-colors">
      {/* Leading: Avatar + App Brand */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenSettings}
          title="Open Profile & Settings"
          className="relative cursor-pointer focus:outline-none group active:scale-95 transition-transform"
        >
          <div className="w-8 h-8 rounded-full bg-[#e5e2e1] flex items-center justify-center font-semibold text-[#293ca0] text-sm overflow-hidden border border-[#c5c5d4]">
            <img
              alt="Alex"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
              className="w-full h-full object-cover"
            />
          </div>
          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#fcf9f8] ${
              isOffline ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            title={isOffline ? 'Offline Mode' : 'Cloud & Calendar Synced'}
          />
        </button>

        <div className="flex items-center gap-1.5">
          <h1 className="text-[19px] font-bold text-[#1c1b1b] tracking-tight">Flow</h1>
          {isOffline && (
            <span className="text-[10px] font-medium bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
              Offline
            </span>
          )}
        </div>
      </div>

      {/* Trailing: Google Cal sync pill + Declutter shortcut + Search + Widgets icon */}
      <div className="flex items-center gap-1.5">
        {calendarSynced && !isOffline && (
          <button
            onClick={onOpenDeclutter}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f6f3f2] border border-[#e5e2e1] text-[#454652] hover:bg-[#eae7e7] transition-colors cursor-pointer text-[12px] font-medium"
            title="Google Calendar Synced · Tap to Declutter"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#4355b9]"></span>
            <span>Google Cal synced</span>
          </button>
        )}

        {overdueCount > 0 && (
          <button
            onClick={onOpenDeclutter}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#dee0ff] text-[#293ca0] text-[11px] font-semibold hover:bg-[#bac3ff] transition-all active:scale-95"
            title={`${overdueCount} overdue tasks. Tap to declutter & balance day.`}
          >
            <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
            <span>{overdueCount} overdue</span>
          </button>
        )}

        <button
          onClick={onOpenWidgets}
          aria-label="Android Widgets Preview"
          title="Android Widgets Preview"
          className="p-1.5 rounded-full text-[#454652] hover:bg-[#eae7e7] transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-[19px]">widgets</span>
        </button>

        <button
          onClick={onOpenSharesheet}
          aria-label="Android Sharesheet Simulator"
          title="Share to Flow (Sharesheet)"
          className="p-1.5 rounded-full text-[#454652] hover:bg-[#eae7e7] transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-[19px]">share</span>
        </button>

        <button
          onClick={onOpenSearch}
          aria-label="Search tasks"
          title="Global Search"
          className="p-1.5 rounded-full text-[#1c1b1b] hover:bg-[#eae7e7] transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>
      </div>
    </nav>
  );
};
