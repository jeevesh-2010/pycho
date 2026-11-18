import React from 'react';
import { useApp } from '../../context/AppContext';
import { Edit3, History, SlidersHorizontal, Cloud } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, submissions, hasSubmittedToday, setIsCloudModalOpen } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#f3edf7] dark:bg-[#211f26] border-t border-[#cac4d0]/30 dark:border-[#49454f]/40 pb-[env(safe-area-inset-bottom)] transition-colors shadow-lg">
      <div className="grid grid-cols-4 h-20 items-center px-1">
        {/* Item 1: Check-in */}
        <button
          onClick={() => setActiveTab('checkin')}
          className="flex flex-col items-center justify-center gap-1 group focus:outline-none cursor-pointer py-1"
        >
          <div
            className={`w-16 h-8 rounded-full flex items-center justify-center transition-all ${
              activeTab === 'checkin'
                ? 'bg-[#d3e3fd] text-[#041e49] dark:bg-[#004a77] dark:text-[#c2e7ff]'
                : 'text-[#49454f] dark:text-[#cac4d0] group-hover:bg-[#ece6f0] dark:group-hover:bg-[#2b2930]'
            }`}
          >
            <div className="relative">
              <Edit3 className="w-5 h-5" />
              {!hasSubmittedToday && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-[#f3edf7] dark:ring-[#211f26]" />
              )}
            </div>
          </div>
          <span
            className={`text-xs tracking-tight ${
              activeTab === 'checkin'
                ? 'font-bold text-[#1d1b20] dark:text-[#e6e0e9]'
                : 'font-medium text-[#49454f] dark:text-[#cac4d0]'
            }`}
          >
            Check-in
          </span>
        </button>

        {/* Item 2: History */}
        <button
          onClick={() => setActiveTab('history')}
          className="flex flex-col items-center justify-center gap-1 group focus:outline-none cursor-pointer py-1"
        >
          <div
            className={`w-16 h-8 rounded-full flex items-center justify-center transition-all ${
              activeTab === 'history'
                ? 'bg-[#d3e3fd] text-[#041e49] dark:bg-[#004a77] dark:text-[#c2e7ff]'
                : 'text-[#49454f] dark:text-[#cac4d0] group-hover:bg-[#ece6f0] dark:group-hover:bg-[#2b2930]'
            }`}
          >
            <div className="relative">
              <History className="w-5 h-5" />
              {submissions.length > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full bg-[#1a73e8] text-white dark:bg-[#a8c7fa] dark:text-[#042f74] text-[9px] font-bold">
                  {submissions.length}
                </span>
              )}
            </div>
          </div>
          <span
            className={`text-xs tracking-tight ${
              activeTab === 'history'
                ? 'font-bold text-[#1d1b20] dark:text-[#e6e0e9]'
                : 'font-medium text-[#49454f] dark:text-[#cac4d0]'
            }`}
          >
            History
          </span>
        </button>

        {/* Item 3: Questions */}
        <button
          onClick={() => setActiveTab('questions')}
          className="flex flex-col items-center justify-center gap-1 group focus:outline-none cursor-pointer py-1"
        >
          <div
            className={`w-16 h-8 rounded-full flex items-center justify-center transition-all ${
              activeTab === 'questions'
                ? 'bg-[#d3e3fd] text-[#041e49] dark:bg-[#004a77] dark:text-[#c2e7ff]'
                : 'text-[#49454f] dark:text-[#cac4d0] group-hover:bg-[#ece6f0] dark:group-hover:bg-[#2b2930]'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <span
            className={`text-xs tracking-tight ${
              activeTab === 'questions'
                ? 'font-bold text-[#1d1b20] dark:text-[#e6e0e9]'
                : 'font-medium text-[#49454f] dark:text-[#cac4d0]'
            }`}
          >
            Questions
          </span>
        </button>

        {/* Item 4: Cloud Sync */}
        <button
          onClick={() => setIsCloudModalOpen(true)}
          className="flex flex-col items-center justify-center gap-1 group focus:outline-none cursor-pointer py-1"
        >
          <div className="w-16 h-8 rounded-full flex items-center justify-center text-[#49454f] dark:text-[#cac4d0] group-hover:bg-[#ece6f0] dark:group-hover:bg-[#2b2930] transition-all">
            <Cloud className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-[#49454f] dark:text-[#cac4d0] tracking-tight">
            Sync
          </span>
        </button>
      </div>
    </nav>
  );
};
