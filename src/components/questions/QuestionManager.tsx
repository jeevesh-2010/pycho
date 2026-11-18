import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuestionCard } from './QuestionCard';
import { QuestionTemplates } from './QuestionTemplates';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Plus, RotateCcw, Sparkles, SlidersHorizontal } from 'lucide-react';

export const QuestionManager: React.FC = () => {
  const {
    questions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    moveQuestion,
    toggleArchiveQuestion,
    resetQuestionsToDefault,
    applyPresetQuestions,
  } = useApp();

  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionPlaceholder, setNewQuestionPlaceholder] = useState('');
  const [newQuestionRequired, setNewQuestionRequired] = useState(false);
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  // Deletion state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    addQuestion(newQuestionText.trim(), newQuestionPlaceholder.trim(), newQuestionRequired);
    setNewQuestionText('');
    setNewQuestionPlaceholder('');
    setNewQuestionRequired(false);
    setIsAddingOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteQuestion(deletingId);
      setDeletingId(null);
    }
  };

  const handleConfirmReset = () => {
    resetQuestionsToDefault();
    setConfirmResetOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Android M3 Top App Bar & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#49454f] dark:text-[#cac4d0] mb-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#1a73e8] dark:text-[#a8c7fa]" />
            <span>Custom Question Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1b20] dark:text-[#e6e0e9]">
            Questions & Prompts
          </h1>
          <p className="text-sm text-[#49454f] dark:text-[#cac4d0] mt-1">
            Create, reorder, and customize the prompts presented on your check-in screen.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="h-10 px-4 rounded-full border border-[#cac4d0] dark:border-[#49454f] bg-[#f7f2fa] dark:bg-[#1d1b20] hover:bg-[#ece6f0] dark:hover:bg-[#2b2930] text-xs font-semibold text-[#1d1b20] dark:text-[#e6e0e9] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer m3-pressable"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Templates</span>
          </button>

          <button
            onClick={() => setIsAddingOpen(!isAddingOpen)}
            className="h-10 px-5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] dark:bg-[#a8c7fa] dark:text-[#042f74] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer m3-pressable"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Preset Packs Drawer */}
      {showPresets && (
        <div className="mb-6 p-6 rounded-3xl bg-[#f3edf7] dark:bg-[#211f26] border border-[#cac4d0]/40 dark:border-[#49454f]/40 animate-in fade-in zoom-in-95">
          <QuestionTemplates
            onApplyPreset={(presetQs) => {
              applyPresetQuestions(presetQs);
              setShowPresets(false);
            }}
          />
        </div>
      )}

      {/* Inline Add Question Form (Android M3 Card) */}
      {isAddingOpen && (
        <form
          onSubmit={handleAddSubmit}
          className="mb-6 p-6 rounded-3xl bg-[#f7f2fa] dark:bg-[#1d1b20] border-2 border-[#1a73e8]/40 dark:border-[#a8c7fa]/40 shadow-sm flex flex-col gap-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#1d1b20] dark:text-[#e6e0e9] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#1a73e8] dark:text-[#a8c7fa]" />
              New Custom Question
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingOpen(false)}
              className="text-xs text-[#79747e] dark:text-[#938f99] hover:text-[#1d1b20] dark:hover:text-[#e6e0e9]"
            >
              Cancel
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#1d1b20] dark:text-[#e6e0e9]">
              Question Title *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="e.g. What is one win or moment of gratitude today?"
              className="w-full px-4 py-2.5 text-base rounded-2xl border border-[#cac4d0] dark:border-[#49454f] bg-[#fdfcff] dark:bg-[#141218] text-[#1d1b20] dark:text-[#e6e0e9] focus:outline-none focus:ring-2 focus:ring-[#1a73e8] dark:focus:ring-[#a8c7fa]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#1d1b20] dark:text-[#e6e0e9]">
              Placeholder Prompt Hint (optional)
            </label>
            <input
              type="text"
              value={newQuestionPlaceholder}
              onChange={(e) => setNewQuestionPlaceholder(e.target.value)}
              placeholder="e.g. A breakthrough, victory, or lesson learned..."
              className="w-full px-4 py-2.5 text-base rounded-2xl border border-[#cac4d0] dark:border-[#49454f] bg-[#fdfcff] dark:bg-[#141218] text-[#1d1b20] dark:text-[#e6e0e9] focus:outline-none focus:ring-2 focus:ring-[#1a73e8] dark:focus:ring-[#a8c7fa]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="new-question-required"
              checked={newQuestionRequired}
              onChange={(e) => setNewQuestionRequired(e.target.checked)}
              className="w-4 h-4 rounded text-[#1a73e8] focus:ring-[#1a73e8] cursor-pointer"
            />
            <label
              htmlFor="new-question-required"
              className="text-xs text-[#1d1b20] dark:text-[#e6e0e9] font-medium cursor-pointer"
            >
              Require an answer before daily submission
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#49454f] dark:text-[#cac4d0] hover:bg-[#ece6f0] dark:hover:bg-[#2b2930] rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newQuestionText.trim()}
              className="px-6 py-2.5 text-xs font-semibold bg-[#1a73e8] hover:bg-[#1557b0] dark:bg-[#a8c7fa] dark:text-[#042f74] text-white rounded-full transition-colors disabled:opacity-50 cursor-pointer shadow-xs m3-pressable"
            >
              Save Question
            </button>
          </div>
        </form>
      )}

      {/* List of Custom Questions */}
      <div className="flex flex-col gap-3">
        {questions.length === 0 ? (
          <div className="text-center py-12 px-6 rounded-3xl bg-[#f7f2fa] dark:bg-[#1d1b20] border border-[#cac4d0]/50 dark:border-[#49454f]/50">
            <p className="text-sm text-[#49454f] dark:text-[#cac4d0] mb-4">
              You don't have any custom questions configured.
            </p>
            <button
              onClick={() => resetQuestionsToDefault()}
              className="px-5 py-2.5 text-xs font-semibold rounded-full bg-[#1a73e8] text-white dark:bg-[#a8c7fa] dark:text-[#042f74] cursor-pointer"
            >
              Load Default Questions
            </button>
          </div>
        ) : (
          questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
              total={questions.length}
              onMoveUp={() => moveQuestion(index, 'up')}
              onMoveDown={() => moveQuestion(index, 'down')}
              onUpdate={updateQuestion}
              onDelete={(id) => setDeletingId(id)}
              onToggleArchive={toggleArchiveQuestion}
            />
          ))
        )}
      </div>

      {/* Restore default questions footer */}
      {questions.length > 0 && (
        <div className="mt-8 pt-4 border-t border-[#cac4d0]/40 dark:border-[#49454f]/40 flex items-center justify-between text-xs text-[#79747e] dark:text-[#938f99]">
          <span>{questions.length} custom {questions.length === 1 ? 'question' : 'questions'} configured</span>
          <button
            onClick={() => setConfirmResetOpen(true)}
            className="flex items-center gap-1.5 hover:text-[#1d1b20] dark:hover:text-[#e6e0e9] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore default questions</span>
          </button>
        </div>
      )}

      {/* Delete Question Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Question"
        message="Are you sure you want to delete this question? Past submissions will preserve their answers and original question text."
        confirmLabel="Delete"
        isDestructive={true}
      />

      {/* Reset Defaults Confirmation */}
      <ConfirmDialog
        isOpen={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        onConfirm={handleConfirmReset}
        title="Restore Default Questions"
        message="This will reset your question list to the standard starter set. Past submissions will not be affected."
        confirmLabel="Reset to Defaults"
        isDestructive={false}
      />
    </div>
  );
};
