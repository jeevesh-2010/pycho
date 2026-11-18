import React, { useState } from 'react';
import type { Submission } from '../../types';
import { formatCardTimestamp, formatExactTimestamp } from '../../utils/date';
import { formatSubmissionAsMarkdown } from '../../utils/export';
import { Copy, Check, Trash2, Calendar, Clock } from 'lucide-react';

interface SubmissionCardProps {
  submission: Submission;
  onDelete: (id: string) => void;
  onCopySuccess: () => void;
}

export const SubmissionCard: React.FC<SubmissionCardProps> = ({
  submission,
  onDelete,
  onCopySuccess,
}) => {
  const [copied, setCopied] = useState(false);

  const { primary, secondary } = formatCardTimestamp(submission.timestamp);
  const exactFullTime = formatExactTimestamp(submission.timestamp);

  const handleCopyMarkdown = () => {
    const md = formatSubmissionAsMarkdown(submission);
    navigator.clipboard.writeText(md);
    setCopied(true);
    onCopySuccess();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <article className="flex flex-col rounded-3xl bg-[#f7f2fa] dark:bg-[#1d1b20] border border-[#cac4d0]/50 dark:border-[#49454f]/50 shadow-2xs hover:shadow-md transition-all overflow-hidden group">
      {/* 1. Android M3 Card Header with exact Date & Timestamp */}
      <div className="px-5 py-4 border-b border-[#cac4d0]/30 dark:border-[#49454f]/30 bg-[#ece6f0]/70 dark:bg-[#2b2930]/70 flex items-center justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 text-[#1d1b20] dark:text-[#e6e0e9] font-semibold text-sm sm:text-base flex-wrap">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#1a73e8] dark:text-[#a8c7fa] shrink-0" />
              <span className="truncate">{primary}</span>
            </div>
            {submission.templateTitle && (
              <span className="px-2 py-0.5 rounded-full bg-[#dbe2f9] text-[#131c2b] dark:bg-[#004a77] dark:text-[#c2e7ff] text-[10px] font-semibold shrink-0">
                {submission.templateTitle}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-[#49454f] dark:text-[#cac4d0] mt-0.5">
            <Clock className="w-3 h-3 shrink-0" />
            <span title={exactFullTime}>{secondary || exactFullTime}</span>
          </div>
        </div>

        {/* Action buttons (Android M3 icon buttons) */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleCopyMarkdown}
            title="Copy as Markdown"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#49454f] hover:text-[#1d1b20] dark:text-[#cac4d0] dark:hover:text-[#e6e0e9] hover:bg-[#e6e0e9] dark:hover:bg-[#36343b] transition-colors cursor-pointer"
            aria-label="Copy markdown"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => onDelete(submission.id)}
            title="Delete this entry"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#49454f] hover:text-[#ba1a1a] dark:text-[#cac4d0] dark:hover:text-[#ffb4ab] hover:bg-[#ffdad6]/60 dark:hover:bg-[#93000a]/40 transition-colors cursor-pointer"
            aria-label="Delete entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Card Body: Each Question and its Answer */}
      <div className="p-5 sm:p-6 flex flex-col gap-4">
        {submission.answers.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <span className="text-xs font-semibold tracking-wide uppercase text-[#49454f] dark:text-[#cac4d0] select-none">
              {item.questionText}
            </span>
            <div className="text-sm sm:text-base text-[#1d1b20] dark:text-[#e6e0e9] leading-relaxed whitespace-pre-wrap break-words">
              {item.answer ? (
                item.answer
              ) : (
                <span className="text-[#79747e] dark:text-[#938f99] italic">No answer provided</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};
