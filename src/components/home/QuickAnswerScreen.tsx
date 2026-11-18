import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { QuestionInputItem } from './QuestionInputItem';
import { SubmissionSuccess } from './SubmissionSuccess';
import type { Submission, SubmissionAnswer } from '../../types';
import { Send, Trash2, SlidersHorizontal, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export const QuickAnswerScreen: React.FC = () => {
  const {
    activeQuestions,
    draftAnswers,
    updateDraftAnswer,
    clearDraft,
    addSubmission,
    setActiveTab,
    showToast,
    resetQuestionsToDefault,
  } = useApp();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState<Submission | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const hasAnyInput = Object.values(draftAnswers).some((v) => v && v.trim().length > 0);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (submitting) return;

    const newErrors: Record<string, string> = {};
    let hasError = false;

    activeQuestions.forEach((q) => {
      const val = (draftAnswers[q.id] || '').trim();
      if (q.required && !val) {
        newErrors[q.id] = 'This question is required.';
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      showToast('Please fill in required fields', 'warning');
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const answers: SubmissionAnswer[] = activeQuestions.map((q) => ({
        questionId: q.id,
        questionText: q.text,
        answer: (draftAnswers[q.id] || '').trim(),
      }));

      const created = await addSubmission(answers);
      setLastSubmitted(created);
      showToast('Check-in recorded', 'success');
    } catch (err) {
      console.error('Submission failed', err);
      showToast('Failed to submit check-in', 'warning');
    } finally {
      setSubmitting(false);
    }
  };

  if (lastSubmitted) {
    return (
      <SubmissionSuccess
        submission={lastSubmitted}
        onViewHistory={() => {
          setLastSubmitted(null);
          setActiveTab('history');
        }}
        onWriteAnother={() => {
          setLastSubmitted(null);
          clearDraft();
        }}
        onCopyNotice={() => showToast('Check-in copied to clipboard!', 'info')}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Android M3 Hero Greeting Banner */}
      <div className="mb-6 p-6 rounded-3xl bg-[#f3edf7] dark:bg-[#211f26] border border-[#cac4d0]/40 dark:border-[#49454f]/40 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-medium text-[#49454f] dark:text-[#cac4d0] mb-2 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#1a73e8] dark:text-[#a8c7fa]" />
          <span>{format(new Date(), 'EEEE, MMMM d')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1b20] dark:text-[#e6e0e9]">
          {getGreeting()}. Time for your daily reflection.
        </h1>
        <p className="text-sm text-[#49454f] dark:text-[#cac4d0] mt-1.5 leading-relaxed">
          Answer quickly below. Submissions sync in real time across your devices.
        </p>
      </div>

      {/* Empty State: No active questions */}
      {activeQuestions.length === 0 ? (
        <div className="text-center py-12 px-6 rounded-3xl bg-[#f7f2fa] dark:bg-[#1d1b20] border border-[#cac4d0]/50 dark:border-[#49454f]/50">
          <SlidersHorizontal className="w-12 h-12 text-[#79747e] mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#1d1b20] dark:text-[#e6e0e9]">
            No Active Questions
          </h3>
          <p className="text-sm text-[#49454f] dark:text-[#cac4d0] mt-1 mb-6 max-w-sm mx-auto">
            Load default starter questions or create your custom prompts in the Questions tab.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={resetQuestionsToDefault}
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#1a73e8] text-white dark:bg-[#a8c7fa] dark:text-[#042f74] shadow-xs cursor-pointer m3-pressable"
            >
              Load Default Questions
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className="px-5 py-2.5 rounded-full text-xs font-semibold border border-[#79747e] text-[#1d1b20] dark:text-[#e6e0e9] hover:bg-[#ece6f0] dark:hover:bg-[#2b2930] transition-colors cursor-pointer m3-pressable"
            >
              Manage Questions
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* List of Questions */}
          <div className="flex flex-col gap-4">
            {activeQuestions.map((question, index) => (
              <QuestionInputItem
                key={question.id}
                question={question}
                index={index}
                value={draftAnswers[question.id] || ''}
                onChange={(val) => updateDraftAnswer(question.id, val)}
                error={errors[question.id]}
              />
            ))}
          </div>

          {/* Android M3 Bottom Action Bar with Extended FAB */}
          <div className="pt-2 pb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-[#49454f] dark:text-[#cac4d0] order-2 sm:order-1">
              {hasAnyInput && (
                <button
                  type="button"
                  onClick={clearDraft}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ece6f0] dark:bg-[#2b2930] hover:bg-[#e6e0e9] dark:hover:bg-[#36343b] text-[#ba1a1a] dark:text-[#ffb4ab] transition-colors cursor-pointer"
                  title="Clear draft answers"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset draft</span>
                </button>
              )}
              <span className="hidden sm:inline">
                Shortcut: <kbd className="px-2 py-0.5 rounded-md bg-[#e6e0e9] dark:bg-[#2b2930] font-mono text-[11px]">Ctrl+Enter</kbd>
              </span>
            </div>

            {/* Android M3 Extended FAB Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto h-14 px-8 rounded-full font-semibold text-sm sm:text-base text-white bg-[#1a73e8] hover:bg-[#1557b0] dark:bg-[#a8c7fa] dark:text-[#042f74] dark:hover:bg-[#d3e3fd] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 order-1 sm:order-2 m3-pressable"
            >
              <Send className="w-5 h-5" />
              <span>{submitting ? 'Recording...' : 'Submit Daily Check-in'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
