import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { Submission } from '../../types';
import { formatExactTimestamp } from '../../utils/date';
import { CheckCircle2, History, PlusCircle, Copy, Check } from 'lucide-react';
import { formatSubmissionAsPlainText } from '../../utils/export';

interface SubmissionSuccessProps {
  submission: Submission;
  onViewHistory: () => void;
  onWriteAnother: () => void;
  onCopyNotice: () => void;
}

export const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({
  submission,
  onViewHistory,
  onWriteAnother,
  onCopyNotice,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#1a73e8', '#34a853', '#fbbc05', '#ea4335'],
      });
    } catch {
      // Ignore
    }
  }, []);

  const handleCopy = () => {
    const text = formatSubmissionAsPlainText(submission);
    navigator.clipboard.writeText(text);
    setCopied(true);
    onCopyNotice();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-8 px-4 max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="w-18 h-18 rounded-full bg-[#c4eed0] dark:bg-[#072711] text-[#0f5223] dark:text-[#6dd58c] flex items-center justify-center mb-5 shadow-xs">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1b20] dark:text-[#e6e0e9] mb-1">
        Check-in Recorded
      </h2>

      <p className="text-xs sm:text-sm text-[#49454f] dark:text-[#cac4d0] mb-6 font-mono">
        {formatExactTimestamp(submission.timestamp)}
      </p>

      {/* Snapshot Preview Box (Android M3 Card) */}
      <div className="w-full text-left bg-[#f7f2fa] dark:bg-[#1d1b20] p-5 sm:p-6 rounded-3xl border border-[#cac4d0]/50 dark:border-[#49454f]/50 shadow-xs mb-6 max-h-72 overflow-y-auto">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#cac4d0]/30 dark:border-[#49454f]/30">
          <span className="text-xs font-semibold text-[#49454f] dark:text-[#cac4d0] uppercase tracking-wider">
            Responses ({submission.answers.length})
          </span>
          <button
            onClick={handleCopy}
            className="text-xs font-medium text-[#1a73e8] dark:text-[#a8c7fa] hover:underline flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {submission.answers.map((ans, idx) => (
            <div key={idx} className="flex flex-col gap-1 p-3 rounded-2xl bg-[#ece6f0]/60 dark:bg-[#2b2930]/60 border border-[#cac4d0]/30 dark:border-[#49454f]/30">
              <span className="text-xs sm:text-sm font-bold text-[#1d1b20] dark:text-[#e6e0e9]">
                {ans.questionText}
              </span>
              <p className="text-sm text-[#49454f] dark:text-[#cac4d0] line-clamp-2">
                {ans.answer || <span className="italic text-[#79747e]">No response</span>}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Android M3 Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <button
          onClick={onViewHistory}
          className="w-full sm:flex-1 h-13 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] dark:bg-[#a8c7fa] dark:text-[#042f74] dark:hover:bg-[#d3e3fd] text-white font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm m3-pressable"
        >
          <History className="w-4 h-4" />
          View in History
        </button>

        <button
          onClick={onWriteAnother}
          className="w-full sm:flex-1 h-13 rounded-full bg-[#dbe2f9] dark:bg-[#004a77] text-[#131c2b] dark:text-[#c2e7ff] hover:bg-[#c2e7ff] dark:hover:bg-[#0842a0] font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer m3-pressable"
        >
          <PlusCircle className="w-4 h-4" />
          Submit Another
        </button>
      </div>
    </div>
  );
};
