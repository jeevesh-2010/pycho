import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubmissionCard } from './SubmissionCard';
import { HistoryFilters } from './HistoryFilters';
import { EmptyHistory } from './EmptyHistory';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { ChevronDown, FileDown } from 'lucide-react';

export const HistoryDashboard: React.FC = () => {
  const {
    filteredSubmissions,
    submissions,
    searchQuery,
    setSearchQuery,
    dateFilter,
    setDateFilter,
    deleteSubmission,
    exportSubmissions,
    showToast,
  } = useApp();

  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  const hasFilters = searchQuery.trim() !== '' || dateFilter !== 'all';

  const handleClearFilters = () => {
    setSearchQuery('');
    setDateFilter('all');
  };

  const handleConfirmDelete = async () => {
    if (deletingId) {
      await deleteSubmission(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Dashboard Top Header (Android M3 App Bar & Subtitle) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#49454f] dark:text-[#cac4d0] mb-1">
            <span>Reverse Chronological Stream</span>
            <span>•</span>
            <span>Unaggregated Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1b20] dark:text-[#e6e0e9]">
            Submission History
          </h1>
          <p className="text-sm text-[#49454f] dark:text-[#cac4d0] mt-1">
            Each entry is preserved as its own distinct card with its exact timestamp and questions.
          </p>
        </div>

        {/* Android M3 Export Button */}
        {submissions.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="h-10 px-4 rounded-full border border-[#cac4d0] dark:border-[#49454f] bg-[#f7f2fa] dark:bg-[#1d1b20] hover:bg-[#ece6f0] dark:hover:bg-[#2b2930] text-xs font-medium text-[#1d1b20] dark:text-[#e6e0e9] flex items-center gap-2 shadow-2xs transition-colors cursor-pointer m3-pressable"
            >
              <FileDown className="w-4 h-4 text-[#1a73e8] dark:text-[#a8c7fa]" />
              <span>Export History</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#79747e]" />
            </button>

            {exportDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setExportDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#f3edf7] dark:bg-[#211f26] border border-[#cac4d0]/60 dark:border-[#49454f]/60 shadow-xl py-2 z-30 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => {
                      exportSubmissions('markdown');
                      setExportDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-[#1d1b20] dark:text-[#e6e0e9] hover:bg-[#e6e0e9] dark:hover:bg-[#2b2930] flex items-center gap-2 cursor-pointer"
                  >
                    <span>Markdown Journal (.md)</span>
                  </button>
                  <button
                    onClick={() => {
                      exportSubmissions('json');
                      setExportDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-[#1d1b20] dark:text-[#e6e0e9] hover:bg-[#e6e0e9] dark:hover:bg-[#2b2930] flex items-center gap-2 cursor-pointer"
                  >
                    <span>Full JSON Backup (.json)</span>
                  </button>
                  <button
                    onClick={() => {
                      exportSubmissions('csv');
                      setExportDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-[#1d1b20] dark:text-[#e6e0e9] hover:bg-[#e6e0e9] dark:hover:bg-[#2b2930] flex items-center gap-2 cursor-pointer"
                  >
                    <span>Spreadsheet Table (.csv)</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <HistoryFilters layoutMode={layoutMode} setLayoutMode={setLayoutMode} />

      {/* Result Count and Record Status */}
      {submissions.length > 0 && (
        <div className="flex items-center justify-between text-xs text-[#49454f] dark:text-[#cac4d0] mb-4 px-1">
          <span>
            {filteredSubmissions.length} of {submissions.length}{' '}
            {submissions.length === 1 ? 'record' : 'records'}
          </span>
          {hasFilters && (
            <span className="font-semibold text-[#1a73e8] dark:text-[#a8c7fa]">
              Filter active
            </span>
          )}
        </div>
      )}

      {/* Stream of Individual Timestamped Entries */}
      {filteredSubmissions.length === 0 ? (
        <EmptyHistory hasFilters={hasFilters} onClearFilters={handleClearFilters} />
      ) : (
        <div
          className={`grid gap-4.5 ${
            layoutMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 max-w-3xl mx-auto'
          }`}
        >
          {filteredSubmissions.map((submission) => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              onDelete={(id) => setDeletingId(id)}
              onCopySuccess={() => showToast('Copied submission to clipboard', 'info')}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Check-in Record"
        message="Are you sure you want to permanently delete this submission record? This action cannot be undone."
        confirmLabel="Delete"
        isDestructive={true}
      />
    </div>
  );
};
