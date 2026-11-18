import React, { useState } from 'react';
import type { Question } from '../../types';
import { ChevronUp, ChevronDown, Edit2, Trash2, Check, Archive, RotateCcw } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onUpdate: (id: string, partial: Partial<Question>) => void;
  onDelete: (id: string) => void;
  onToggleArchive: (id: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onUpdate,
  onDelete,
  onToggleArchive,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [textInput, setTextInput] = useState(question.text);
  const [placeholderInput, setPlaceholderInput] = useState(question.placeholder || '');
  const [requiredInput, setRequiredInput] = useState(Boolean(question.required));

  const handleSave = () => {
    if (!textInput.trim()) return;
    onUpdate(question.id, {
      text: textInput.trim(),
      placeholder: placeholderInput.trim(),
      required: requiredInput,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTextInput(question.text);
    setPlaceholderInput(question.placeholder || '');
    setRequiredInput(Boolean(question.required));
    setIsEditing(false);
  };

  return (
    <div
      className={`flex flex-col rounded-3xl border transition-all ${
        question.archived
          ? 'bg-[#ece6f0]/40 dark:bg-[#1d1b20]/40 border-[#cac4d0]/30 dark:border-[#49454f]/30 opacity-60'
          : 'bg-[#f7f2fa] dark:bg-[#1d1b20] border-[#cac4d0]/50 dark:border-[#49454f]/50 shadow-2xs hover:shadow-xs'
      }`}
    >
      {isEditing ? (
        /* Edit Mode (Android M3 Form) */
        <div className="p-5 flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#1d1b20] dark:text-[#e6e0e9]">
              Question Title
            </label>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="e.g. How was your day?"
              className="w-full px-4 py-2.5 text-sm sm:text-base rounded-2xl border border-[#cac4d0] dark:border-[#49454f] bg-[#fdfcff] dark:bg-[#141218] text-[#1d1b20] dark:text-[#e6e0e9] focus:outline-none focus:ring-2 focus:ring-[#1a73e8] dark:focus:ring-[#a8c7fa]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#1d1b20] dark:text-[#e6e0e9]">
              Prompt Helper Hint (optional)
            </label>
            <input
              type="text"
              value={placeholderInput}
              onChange={(e) => setPlaceholderInput(e.target.value)}
              placeholder="e.g. A quick pulse check on your mood..."
              className="w-full px-4 py-2.5 text-sm sm:text-base rounded-2xl border border-[#cac4d0] dark:border-[#49454f] bg-[#fdfcff] dark:bg-[#141218] text-[#1d1b20] dark:text-[#e6e0e9] focus:outline-none focus:ring-2 focus:ring-[#1a73e8] dark:focus:ring-[#a8c7fa]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id={`edit-req-${question.id}`}
              checked={requiredInput}
              onChange={(e) => setRequiredInput(e.target.checked)}
              className="w-4 h-4 rounded text-[#1a73e8] focus:ring-[#1a73e8] cursor-pointer"
            />
            <label
              htmlFor={`edit-req-${question.id}`}
              className="text-xs text-[#1d1b20] dark:text-[#e6e0e9] font-medium cursor-pointer"
            >
              Require an answer before daily submission
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#cac4d0]/30 dark:border-[#49454f]/30">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-xs font-semibold text-[#49454f] dark:text-[#cac4d0] hover:bg-[#ece6f0] dark:hover:bg-[#2b2930] rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!textInput.trim()}
              className="px-5 py-2 text-xs font-semibold bg-[#1a73e8] dark:bg-[#a8c7fa] text-white dark:text-[#042f74] rounded-full transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer m3-pressable shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        </div>
      ) : (
        /* Normal View */
        <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
          {/* Left: Reorder controls */}
          <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
            <button
              onClick={onMoveUp}
              disabled={index === 0}
              title="Move Up"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#79747e] hover:text-[#1d1b20] dark:hover:text-[#e6e0e9] hover:bg-[#ece6f0] dark:hover:bg-[#2b2930] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              aria-label="Move up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-[#49454f] dark:text-[#cac4d0] select-none">
              {index + 1}
            </span>
            <button
              onClick={onMoveDown}
              disabled={index === total - 1}
              title="Move Down"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#79747e] hover:text-[#1d1b20] dark:hover:text-[#e6e0e9] hover:bg-[#ece6f0] dark:hover:bg-[#2b2930] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              aria-label="Move down"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Middle: Text & Badges */}
          <div className="flex-1 min-w-0 flex flex-col gap-1.5 pt-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-[#1d1b20] dark:text-[#e6e0e9]">
                {question.text}
              </h3>
              {question.required && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad6] dark:bg-[#93000a]/50 text-[#410002] dark:text-[#ffdad6] text-[10px] font-bold">
                  Required
                </span>
              )}
              {question.archived && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#ece6f0] dark:bg-[#2b2930] text-[#49454f] dark:text-[#cac4d0] text-[10px] font-medium">
                  Archived
                </span>
              )}
            </div>

            {question.placeholder && (
              <p className="text-xs text-[#79747e] dark:text-[#938f99] italic truncate">
                Hint: "{question.placeholder}"
              </p>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              title="Edit Question"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#49454f] hover:text-[#1d1b20] dark:text-[#cac4d0] dark:hover:text-[#e6e0e9] hover:bg-[#ece6f0] dark:hover:bg-[#2b2930] transition-colors cursor-pointer"
              aria-label="Edit question"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleArchive(question.id)}
              title={question.archived ? 'Restore to Check-in' : 'Archive (Hide from Check-in)'}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#49454f] hover:text-[#1d1b20] dark:text-[#cac4d0] dark:hover:text-[#e6e0e9] hover:bg-[#ece6f0] dark:hover:bg-[#2b2930] transition-colors cursor-pointer"
              aria-label="Archive or restore"
            >
              {question.archived ? (
                <RotateCcw className="w-4 h-4 text-emerald-500" />
              ) : (
                <Archive className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => onDelete(question.id)}
              title="Delete Question"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#49454f] hover:text-[#ba1a1a] dark:text-[#cac4d0] dark:hover:text-[#ffb4ab] hover:bg-[#ffdad6]/60 dark:hover:bg-[#93000a]/40 transition-colors cursor-pointer"
              aria-label="Delete question"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
