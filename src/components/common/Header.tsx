import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { SyncStatusBadge } from '../sync/SyncStatusBadge';
import { Sun, Moon, Sparkles, History, SlidersHorizontal, Edit3, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, submissions, questions, hasSubmittedToday, setIsCloudModalOpen } = useApp();
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#fdfcff]/90 dark:bg-[#141218]/90 backdrop-blur-md transition-colors border-b border-[#cac4d0]/40 dark:border-[#49454f]/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Android M3 App Bar Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('checkin')}
            className="flex items-center gap-3 text-left focus:outline-none cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#d3e3fd] dark:bg-[#0842a0] text-[#041e49] dark:text-[#d3e3fd] flex items-center justify-center font-bold text-base shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-[#1a73e8] dark:text-[#a8c7fa]" />
            </div>
            <div>
              <span className="font-medium text-xl tracking-tight text-[#1d1b20] dark:text-[#e6e0e9]">
                ZenDaily
              </span>
              <span className="hidden sm:inline-block ml-2.5 text-[11px] font-medium text-[#49454f] dark:text-[#cac4d0] px-2 py-0.5 rounded-full bg-[#ece6f0] dark:bg-[#2b2930]">
                Android M3
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Tabs (Android M3 Segmented / Pill Tab Bar) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#f3edf7] dark:bg-[#211f26] p-1.5 rounded-full border border-[#cac4d0]/30 dark:border-[#49454f]/40">
          <button
            onClick={() => setActiveTab('checkin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'checkin'
                ? 'bg-[#d3e3fd] text-[#041e49] dark:bg-[#0842a0] dark:text-[#d3e3fd] shadow-xs'
                : 'text-[#49454f] dark:text-[#cac4d0] hover:text-[#1d1b20] dark:hover:text-[#e6e0e9] hover:bg-[#e6e0e9]/50 dark:hover:bg-[#2b2930]'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Check-in</span>
            {!hasSubmittedToday && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Check-in pending" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#d3e3fd] text-[#041e49] dark:bg-[#0842a0] dark:text-[#d3e3fd] shadow-xs'
                : 'text-[#49454f] dark:text-[#cac4d0] hover:text-[#1d1b20] dark:hover:text-[#e6e0e9] hover:bg-[#e6e0e9]/50 dark:hover:bg-[#2b2930]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>History</span>
            {submissions.length > 0 && (
              <span className="px-2 py-0.2 rounded-full bg-[#e6e0e9] dark:bg-[#36343b] text-[10px] font-semibold text-[#1d1b20] dark:text-[#e6e0e9]">
                {submissions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'questions'
                ? 'bg-[#d3e3fd] text-[#041e49] dark:bg-[#0842a0] dark:text-[#d3e3fd] shadow-xs'
                : 'text-[#49454f] dark:text-[#cac4d0] hover:text-[#1d1b20] dark:hover:text-[#e6e0e9] hover:bg-[#e6e0e9]/50 dark:hover:bg-[#2b2930]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Questions</span>
            <span className="px-2 py-0.2 rounded-full bg-[#e6e0e9] dark:bg-[#36343b] text-[10px] font-semibold text-[#1d1b20] dark:text-[#e6e0e9]">
              {questions.length}
            </span>
          </button>
        </nav>

        {/* Right Action Icons (Android M3 circular icon buttons) */}
        <div className="flex items-center gap-2">
          {/* Cloud Sync Status Badge */}
          <SyncStatusBadge />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#49454f] hover:text-[#1d1b20] dark:text-[#cac4d0] dark:hover:text-[#e6e0e9] hover:bg-[#ece6f0] dark:hover:bg-[#2b2930] transition-colors cursor-pointer"
            title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-5 h-5 text-[#fbd7fc]" />
            ) : (
              <Moon className="w-5 h-5 text-[#49454f]" />
            )}
          </button>

          {/* Android Settings Icon Button */}
          <button
            onClick={() => setIsCloudModalOpen(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#49454f] hover:text-[#1d1b20] dark:text-[#cac4d0] dark:hover:text-[#e6e0e9] hover:bg-[#ece6f0] dark:hover:bg-[#2b2930] transition-colors cursor-pointer"
            title="Cloud & Sync Settings"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
