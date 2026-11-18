import React from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, SearchX, Edit3 } from 'lucide-react';

interface EmptyHistoryProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export const EmptyHistory: React.FC<EmptyHistoryProps> = ({ hasFilters, onClearFilters }) => {
  const { setActiveTab } = useApp();

  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 rounded-3xl bg-[#f7f2fa] dark:bg-[#1d1b20] border border-[#cac4d0]/50 dark:border-[#49454f]/50">
        <div className="w-14 h-14 rounded-full bg-[#ece6f0] dark:bg-[#2b2930] flex items-center justify-center text-[#79747e] mb-3">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-[#1d1b20] dark:text-[#e6e0e9]">
          No matching entries found
        </h3>
        <p className="text-sm text-[#49454f] dark:text-[#cac4d0] mt-1 mb-5 max-w-xs">
          Try adjusting your search query or reset the date filter.
        </p>
        <button
          onClick={onClearFilters}
          className="px-5 py-2 rounded-full text-xs font-semibold bg-[#1a73e8] dark:bg-[#a8c7fa] text-white dark:text-[#042f74] hover:opacity-90 transition-opacity m3-pressable cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 rounded-3xl bg-[#f7f2fa] dark:bg-[#1d1b20] border border-[#cac4d0]/50 dark:border-[#49454f]/50">
      <div className="w-16 h-16 rounded-full bg-[#d3e3fd] dark:bg-[#0842a0] text-[#1a73e8] dark:text-[#d3e3fd] flex items-center justify-center mb-4 shadow-xs">
        <BookOpen className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-[#1d1b20] dark:text-[#e6e0e9]">
        No check-in entries yet
      </h3>
      <p className="text-sm text-[#49454f] dark:text-[#cac4d0] mt-1.5 mb-6 max-w-sm leading-relaxed">
        Complete your first daily reflection on the Check-in screen. Each submission is saved as an individual timestamped card right here.
      </p>
      <button
        onClick={() => setActiveTab('checkin')}
        className="h-12 px-7 rounded-full text-sm font-semibold bg-[#1a73e8] hover:bg-[#1557b0] text-white dark:bg-[#a8c7fa] dark:text-[#042f74] flex items-center gap-2 shadow-sm transition-colors cursor-pointer m3-pressable"
      >
        <Edit3 className="w-4 h-4" />
        Start Today's Check-in
      </button>
    </div>
  );
};
