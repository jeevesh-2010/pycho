import React, { useRef, useEffect } from 'react';
import type { Question } from '../../types';

interface QuestionInputItemProps {
  question: Question;
  index: number;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export const QuestionInputItem: React.FC<QuestionInputItemProps> = ({
  question,
  index,
  value,
  onChange,
  error,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(96, textareaRef.current.scrollHeight)}px`;
    }
  }, [value]);

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col gap-3 p-5 sm:p-6 rounded-3xl bg-[#f7f2fa] dark:bg-[#1d1b20] border border-[#cac4d0]/50 dark:border-[#49454f]/50 shadow-2xs hover:border-[#79747e]/60 dark:hover:border-[#938f99]/60 transition-all">
      {/* Question Header */}
      <div className="flex items-start justify-between gap-3">
        <label
          htmlFor={`question-${question.id}`}
          className="text-base sm:text-lg font-medium text-[#1d1b20] dark:text-[#e6e0e9] leading-snug cursor-text"
        >
          <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-[#dbe2f9] dark:bg-[#004a77] text-[#131c2b] dark:text-[#c2e7ff] text-xs font-bold mr-2.5 align-middle">
            {index + 1}
          </span>
          <span className="align-middle">{question.text}</span>
          {question.required && (
            <span className="text-[#ba1a1a] dark:text-[#ffb4ab] ml-1.5 text-sm select-none" title="Required">
              *
            </span>
          )}
        </label>

        {wordCount > 0 && (
          <span className="text-[11px] font-medium text-[#49454f] dark:text-[#cac4d0] bg-[#ece6f0] dark:bg-[#2b2930] px-2.5 py-0.5 rounded-full shrink-0 select-none">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>
        )}
      </div>

      {/* Material 3 Outlined Textarea */}
      <div className="relative">
        <textarea
          id={`question-${question.id}`}
          ref={textareaRef}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder || 'Type your reflection here...'}
          className={`w-full p-4 text-base rounded-2xl border bg-[#fdfcff] dark:bg-[#141218] text-[#1d1b20] dark:text-[#e6e0e9] placeholder:text-[#79747e] dark:placeholder:text-[#938f99] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/25 dark:focus:ring-[#a8c7fa]/25 focus:border-[#1a73e8] dark:focus:border-[#a8c7fa] transition-all resize-none leading-relaxed shadow-2xs ${
            error
              ? 'border-[#ba1a1a] dark:border-[#ffb4ab] focus:border-[#ba1a1a]'
              : 'border-[#cac4d0] dark:border-[#49454f]'
          }`}
        />
      </div>

      {error && (
        <p className="text-xs text-[#ba1a1a] dark:text-[#ffb4ab] font-medium flex items-center gap-1 pl-1">
          <span>•</span> {error}
        </p>
      )}
    </div>
  );
};
