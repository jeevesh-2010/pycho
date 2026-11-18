import React from 'react';
import { useApp } from '../../context/AppContext';
import type { DateFilterType } from '../../types';
import { Search, X, Calendar, LayoutGrid, Rows, Check } from 'lucide-react';

interface HistoryFiltersProps {
  layoutMode: 'grid' | 'list';
  setLayoutMode: (mode: 'grid' | 'list') => void;
}

export const HistoryFilters: React.FC<HistoryFiltersProps> = ({ layoutMode, setLayoutMode }) => {
  const {
    searchQuery,
    setSearchQuery,
    dateFilter,
    setDateFilter,
    customDate,
    setCustomDate,
  } = useApp();

  const filterTabs: { id: DateFilterType; label: string }[] = [
    { id: 'all', label: 'All Entries' },
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'week', label: 'Past 7 Days' },
    { id: 'month', label: 'Past 30 Days' },
    { id: 'custom', label: 'Custom Date' },
  ];

  const hasActiveFilters = searchQuery.trim() !== '' || dateFilter !== 'all';

  const clearAllFilters = () => {
    setSearchQuery('');
    setDateFilter('all');
  };

  return (
    <div className="flex flex-col gap-3.5 mb-6">
      {/* Android M3 Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-[#49454f] dark:text-[#cac4d0] absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search check-ins..."
            className="w-full h-12 pl-12 pr-11 text-sm sm:text-base rounded-full border-none bg-[#ece6f0] dark:bg-[#2b2930] text-[#1d1b20] dark:text-[#e6e0e9] placeholder:text-[#79747e] dark:placeholder:text-[#938f99] focus:outline-none focus:ring-2 focus:ring-[#1a73e8] dark:focus:ring-[#a8c7fa] transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#49454f] hover:text-[#1d1b20] dark:text-[#cac4d0] dark:hover:text-[#e6e0e9] absolute right-2 top-2"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Layout toggle (desktop only) */}
        <div className="hidden md:flex items-center rounded-full bg-[#ece6f0] dark:bg-[#2b2930] p-1 shadow-2xs">
          <button
            onClick={() => setLayoutMode('grid')}
            title="2-Column Card Grid"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              layoutMode === 'grid'
                ? 'bg-[#ffffff] dark:bg-[#36343b] text-[#1a73e8] dark:text-[#a8c7fa] shadow-2xs'
                : 'text-[#49454f] dark:text-[#cac4d0]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLayoutMode('list')}
            title="1-Column Focused View"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              layoutMode === 'list'
                ? 'bg-[#ffffff] dark:bg-[#36343b] text-[#1a73e8] dark:text-[#a8c7fa] shadow-2xs'
                : 'text-[#49454f] dark:text-[#cac4d0]'
            }`}
          >
            <Rows className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Android M3 Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {filterTabs.map((tab) => {
          const isSelected = dateFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setDateFilter(tab.id)}
              className={`h-8 inline-flex items-center gap-1.5 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer m3-pressable ${
                isSelected
                  ? 'bg-[#dbe2f9] text-[#131c2b] dark:bg-[#004a77] dark:text-[#c2e7ff] border-[#1a73e8]/30 dark:border-[#a8c7fa]/30 font-semibold shadow-2xs'
                  : 'bg-transparent text-[#49454f] dark:text-[#cac4d0] border-[#cac4d0]/70 dark:border-[#49454f]/70 hover:bg-[#ece6f0] dark:hover:bg-[#2b2930]'
              }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
            </button>
          );
        })}

        {/* Custom date picker input */}
        {dateFilter === 'custom' && (
          <div className="h-8 inline-flex items-center gap-1.5 px-3 rounded-lg border border-[#cac4d0] dark:border-[#49454f] bg-transparent">
            <Calendar className="w-3.5 h-3.5 text-[#49454f] dark:text-[#cac4d0]" />
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="bg-transparent text-xs text-[#1d1b20] dark:text-[#e6e0e9] focus:outline-none"
            />
          </div>
        )}

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="ml-auto text-xs font-medium text-[#1a73e8] dark:text-[#a8c7fa] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" /> Reset
          </button>
        )}
      </div>
    </div>
  );
};
