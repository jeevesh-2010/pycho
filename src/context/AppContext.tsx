import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import type { Question, Submission, ActiveTab, DateFilterType, SubmissionAnswer } from '../types';
import {
  loadStoredQuestions,
  saveStoredQuestions,
  loadStoredSubmissions,
  saveStoredSubmissions,
  loadStoredDraft,
  saveStoredDraft,
  clearStoredDraft,
  subscribeToLocalSync,
  postLocalSyncEvent,
} from '../lib/storage';
import { DEFAULT_QUESTIONS } from '../lib/defaultQuestions';
import { useAuth } from './AuthContext';
import {
  fetchRemoteSubmissions,
  insertRemoteSubmission,
  deleteRemoteSubmission,
  fetchRemoteQuestions,
  syncRemoteQuestions,
} from '../lib/supabase';
import { getTodayDateString } from '../utils/date';
import { exportAllToMarkdown, exportAllToJson, exportAllToCsv } from '../utils/export';
import { isToday, isYesterday, subDays, parseISO, isAfter } from 'date-fns';

export interface ToastItem {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning';
}

interface AppContextType {
  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Questions
  questions: Question[];
  activeQuestions: Question[];
  addQuestion: (text: string, placeholder?: string, required?: boolean) => void;
  updateQuestion: (id: string, partial: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  reorderQuestions: (newOrder: Question[]) => void;
  moveQuestion: (index: number, direction: 'up' | 'down') => void;
  toggleArchiveQuestion: (id: string) => void;
  resetQuestionsToDefault: () => void;
  applyPresetQuestions: (presetList: string[]) => void;

  // Submissions
  submissions: Submission[];
  filteredSubmissions: Submission[];
  addSubmission: (answers: SubmissionAnswer[]) => Promise<Submission>;
  deleteSubmission: (id: string) => Promise<void>;
  hasSubmittedToday: boolean;
  todaySubmissionCount: number;

  // Draft answers
  draftAnswers: Record<string, string>;
  updateDraftAnswer: (questionId: string, text: string) => void;
  clearDraft: () => void;

  // Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateFilter: DateFilterType;
  setDateFilter: (filter: DateFilterType) => void;
  customDate: string;
  setCustomDate: (date: string) => void;

  // Modals & Panels
  isCloudModalOpen: boolean;
  setIsCloudModalOpen: (open: boolean) => void;

  // Export / Import
  exportSubmissions: (type: 'markdown' | 'json' | 'csv') => void;
  importJsonBackup: (jsonString: string) => { success: boolean; message: string };

  // Toasts
  toasts: ToastItem[];
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void;
  removeToast: (id: string) => void;

  // Sync state
  isSyncing: boolean;
  syncWithCloud: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { supabaseClient, user, syncStatus } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>('checkin');
  const [questions, setQuestions] = useState<Question[]>(loadStoredQuestions);
  const [submissions, setSubmissions] = useState<Submission[]>(loadStoredSubmissions);
  const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>(loadStoredDraft);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [customDate, setCustomDate] = useState(getTodayDateString());

  // Cloud modal
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Listen to local BroadcastChannel for multi-tab sync
  useEffect(() => {
    const unsubscribe = subscribeToLocalSync((type) => {
      if (type === 'SUBMISSION_ADDED' || type === 'SUBMISSION_DELETED') {
        const fresh = loadStoredSubmissions();
        setSubmissions(fresh);
        showToast('⚡ Updated in real time from another tab', 'info');
      } else if (type === 'QUESTIONS_UPDATED') {
        const fresh = loadStoredQuestions();
        setQuestions(fresh);
      }
    });
    return unsubscribe;
  }, [showToast]);

  // Full Cloud Sync function
  const syncWithCloud = useCallback(async () => {
    if (!supabaseClient) return;
    setIsSyncing(true);
    try {
      // 1. Fetch remote submissions
      const remoteSubs = await fetchRemoteSubmissions(supabaseClient, user?.id);
      if (remoteSubs.length > 0) {
        setSubmissions((prevLocal) => {
          // Merge by ID, keeping newest
          const map = new Map<string, Submission>();
          prevLocal.forEach((s) => map.set(s.id, s));
          remoteSubs.forEach((s) => map.set(s.id, s));
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          saveStoredSubmissions(merged);
          return merged;
        });
      }

      // 2. Fetch remote questions
      const remoteQs = await fetchRemoteQuestions(supabaseClient, user?.id);
      if (remoteQs.length > 0) {
        setQuestions(() => {
          const sorted = remoteQs.sort((a, b) => a.order - b.order);
          saveStoredQuestions(sorted);
          return sorted;
        });
      }
    } catch (e) {
      console.warn('Sync failed:', e);
    } finally {
      setIsSyncing(false);
    }
  }, [supabaseClient, user?.id]);

  // Initial cloud sync when client / user connects
  useEffect(() => {
    if (supabaseClient && syncStatus === 'connected') {
      syncWithCloud();
    }
  }, [supabaseClient, syncStatus, syncWithCloud]);

  // Real-time Supabase subscriptions (cross-device sync!)
  useEffect(() => {
    if (!supabaseClient) return;

    const channelName = `zen_sync_realtime_${user?.id || 'public'}`;
    const channel = supabaseClient
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'submissions' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newRow = payload.new as {
              id: string;
              timestamp: string;
              date: string;
              answers: SubmissionAnswer[];
              tags?: string[];
              user_id?: string;
              created_at?: string;
            };
            const item: Submission = {
              id: newRow.id,
              timestamp: newRow.timestamp,
              date: newRow.date,
              answers: newRow.answers,
              tags: newRow.tags || [],
              userId: newRow.user_id,
              synced: true,
              createdAt: newRow.created_at,
            };

            setSubmissions((prev) => {
              if (prev.some((s) => s.id === item.id)) return prev;
              const next = [item, ...prev];
              saveStoredSubmissions(next);
              return next;
            });
            showToast('⚡ New check-in received from another device!', 'success');
          } else if (payload.eventType === 'DELETE') {
            const oldId = payload.old?.id;
            if (oldId) {
              setSubmissions((prev) => {
                const next = prev.filter((s) => s.id !== oldId);
                saveStoredSubmissions(next);
                return next;
              });
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'questions' },
        () => {
          fetchRemoteQuestions(supabaseClient, user?.id).then((qs) => {
            if (qs.length > 0) {
              setQuestions(qs);
              saveStoredQuestions(qs);
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [supabaseClient, user?.id, showToast]);

  // Active questions (non-archived)
  const activeQuestions = useMemo(() => {
    return questions.filter((q) => !q.archived).sort((a, b) => a.order - b.order);
  }, [questions]);

  // Draft management
  const updateDraftAnswer = useCallback((questionId: string, text: string) => {
    setDraftAnswers((prev) => {
      const next = { ...prev, [questionId]: text };
      saveStoredDraft(next);
      return next;
    });
  }, []);

  const clearDraft = useCallback(() => {
    setDraftAnswers({});
    clearStoredDraft();
  }, []);

  // Questions management
  const addQuestion = useCallback(
    (text: string, placeholder = '', required = false) => {
      const cleanText = text.trim();
      if (!cleanText) return;
      const newQuestion: Question = {
        id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        text: cleanText,
        placeholder: placeholder.trim(),
        required,
        order: questions.length,
        archived: false,
        createdAt: new Date().toISOString(),
      };
      const updated = [...questions, newQuestion];
      setQuestions(updated);
      saveStoredQuestions(updated);
      showToast('Question added', 'success');

      if (supabaseClient) {
        syncRemoteQuestions(supabaseClient, updated, user?.id);
      }
    },
    [questions, showToast, supabaseClient, user?.id]
  );

  const updateQuestion = useCallback(
    (id: string, partial: Partial<Question>) => {
      const updated = questions.map((q) => (q.id === id ? { ...q, ...partial } : q));
      setQuestions(updated);
      saveStoredQuestions(updated);
      showToast('Question updated', 'info');

      if (supabaseClient) {
        syncRemoteQuestions(supabaseClient, updated, user?.id);
      }
    },
    [questions, showToast, supabaseClient, user?.id]
  );

  const deleteQuestion = useCallback(
    (id: string) => {
      const updated = questions
        .filter((q) => q.id !== id)
        .map((q, idx) => ({ ...q, order: idx }));
      setQuestions(updated);
      saveStoredQuestions(updated);
      showToast('Question deleted', 'info');

      if (supabaseClient) {
        syncRemoteQuestions(supabaseClient, updated, user?.id);
      }
    },
    [questions, showToast, supabaseClient, user?.id]
  );

  const reorderQuestions = useCallback(
    (newOrder: Question[]) => {
      const indexed = newOrder.map((q, i) => ({ ...q, order: i }));
      setQuestions(indexed);
      saveStoredQuestions(indexed);

      if (supabaseClient) {
        syncRemoteQuestions(supabaseClient, indexed, user?.id);
      }
    },
    [supabaseClient, user?.id]
  );

  const moveQuestion = useCallback(
    (index: number, direction: 'up' | 'down') => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= questions.length) return;

      const updated = [...questions];
      const [moved] = updated.splice(index, 1);
      updated.splice(targetIndex, 0, moved);
      reorderQuestions(updated);
    },
    [questions, reorderQuestions]
  );

  const toggleArchiveQuestion = useCallback(
    (id: string) => {
      const target = questions.find((q) => q.id === id);
      if (!target) return;
      const nextArchived = !target.archived;
      updateQuestion(id, { archived: nextArchived });
      showToast(nextArchived ? 'Question archived' : 'Question restored', 'info');
    },
    [questions, updateQuestion, showToast]
  );

  const resetQuestionsToDefault = useCallback(() => {
    setQuestions(DEFAULT_QUESTIONS);
    saveStoredQuestions(DEFAULT_QUESTIONS);
    showToast('Reset to default questions', 'info');

    if (supabaseClient) {
      syncRemoteQuestions(supabaseClient, DEFAULT_QUESTIONS, user?.id);
    }
  }, [showToast, supabaseClient, user?.id]);

  const applyPresetQuestions = useCallback(
    (presetList: string[]) => {
      const newQuestions: Question[] = presetList.map((text, idx) => ({
        id: `q-preset-${Date.now()}-${idx}`,
        text,
        placeholder: '',
        required: false,
        order: idx,
        archived: false,
        createdAt: new Date().toISOString(),
      }));
      setQuestions(newQuestions);
      saveStoredQuestions(newQuestions);
      showToast('Preset questions loaded!', 'success');

      if (supabaseClient) {
        syncRemoteQuestions(supabaseClient, newQuestions, user?.id);
      }
    },
    [showToast, supabaseClient, user?.id]
  );

  // Submissions management
  const addSubmission = useCallback(
    async (answers: SubmissionAnswer[]): Promise<Submission> => {
      const now = new Date();
      const submission: Submission = {
        id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: now.toISOString(),
        date: getTodayDateString(),
        answers,
        userId: user?.id,
        synced: Boolean(supabaseClient),
        createdAt: now.toISOString(),
      };

      // 1. Save locally immediately
      const updated = [submission, ...submissions];
      setSubmissions(updated);
      saveStoredSubmissions(updated);
      clearDraft();
      postLocalSyncEvent('SUBMISSION_ADDED', submission);

      // 2. Sync to Supabase in background
      if (supabaseClient) {
        insertRemoteSubmission(supabaseClient, submission, user?.id).then((ok) => {
          if (!ok) {
            showToast('Saved locally. Will retry cloud sync when connected.', 'warning');
          }
        });
      }

      return submission;
    },
    [submissions, clearDraft, supabaseClient, user?.id, showToast]
  );

  const deleteSubmission = useCallback(
    async (id: string) => {
      const updated = submissions.filter((s) => s.id !== id);
      setSubmissions(updated);
      saveStoredSubmissions(updated);
      postLocalSyncEvent('SUBMISSION_DELETED', { id });
      showToast('Check-in deleted', 'info');

      if (supabaseClient) {
        deleteRemoteSubmission(supabaseClient, id);
      }
    },
    [submissions, showToast, supabaseClient]
  );

  // Today submission status
  const hasSubmittedToday = useMemo(() => {
    const today = getTodayDateString();
    return submissions.some((s) => s.date === today);
  }, [submissions]);

  const todaySubmissionCount = useMemo(() => {
    const today = getTodayDateString();
    return submissions.filter((s) => s.date === today).length;
  }, [submissions]);

  // Filtered Submissions (Search & Date filter)
  const filteredSubmissions = useMemo(() => {
    let result = submissions;

    // 1. Date Filter
    if (dateFilter === 'today') {
      result = result.filter((s) => isToday(parseISO(s.timestamp)));
    } else if (dateFilter === 'yesterday') {
      result = result.filter((s) => isYesterday(parseISO(s.timestamp)));
    } else if (dateFilter === 'week') {
      const sevenDaysAgo = subDays(new Date(), 7);
      result = result.filter((s) => isAfter(parseISO(s.timestamp), sevenDaysAgo));
    } else if (dateFilter === 'month') {
      const thirtyDaysAgo = subDays(new Date(), 30);
      result = result.filter((s) => isAfter(parseISO(s.timestamp), thirtyDaysAgo));
    } else if (dateFilter === 'custom' && customDate) {
      result = result.filter((s) => s.date === customDate);
    }

    // 2. Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((s) => {
        // Search in any answer text or question prompt
        return s.answers.some(
          (ans) =>
            ans.answer.toLowerCase().includes(query) ||
            ans.questionText.toLowerCase().includes(query)
        );
      });
    }

    return result;
  }, [submissions, dateFilter, customDate, searchQuery]);

  // Export
  const exportSubmissions = useCallback(
    (type: 'markdown' | 'json' | 'csv') => {
      if (type === 'markdown') {
        exportAllToMarkdown(submissions);
      } else if (type === 'json') {
        exportAllToJson(submissions, questions);
      } else if (type === 'csv') {
        exportAllToCsv(submissions);
      }
      showToast(`Exported ${submissions.length} entries as ${type.toUpperCase()}`, 'success');
    },
    [submissions, questions, showToast]
  );

  const importJsonBackup = useCallback(
    (jsonString: string): { success: boolean; message: string } => {
      try {
        const parsed = JSON.parse(jsonString);
        if (!parsed.submissions && !Array.isArray(parsed)) {
          return { success: false, message: 'Invalid JSON backup format' };
        }

        const incomingSubs: Submission[] = parsed.submissions || parsed;
        if (Array.isArray(incomingSubs)) {
          // Merge
          const map = new Map<string, Submission>();
          submissions.forEach((s) => map.set(s.id, s));
          incomingSubs.forEach((s) => map.set(s.id, s));
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          setSubmissions(merged);
          saveStoredSubmissions(merged);
        }

        if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          setQuestions(parsed.questions);
          saveStoredQuestions(parsed.questions);
        }

        showToast('Backup restored successfully!', 'success');
        return { success: true, message: 'Backup restored successfully!' };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { success: false, message: `Failed to import JSON: ${msg}` };
      }
    },
    [submissions, showToast]
  );

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        questions,
        activeQuestions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        reorderQuestions,
        moveQuestion,
        toggleArchiveQuestion,
        resetQuestionsToDefault,
        applyPresetQuestions,
        submissions,
        filteredSubmissions,
        addSubmission,
        deleteSubmission,
        hasSubmittedToday,
        todaySubmissionCount,
        draftAnswers,
        updateDraftAnswer,
        clearDraft,
        searchQuery,
        setSearchQuery,
        dateFilter,
        setDateFilter,
        customDate,
        setCustomDate,
        isCloudModalOpen,
        setIsCloudModalOpen,
        exportSubmissions,
        importJsonBackup,
        toasts,
        showToast,
        removeToast,
        isSyncing,
        syncWithCloud,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
