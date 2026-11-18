import type { Question, Submission, CloudConfig } from '../types';
import { DEFAULT_QUESTIONS } from './defaultQuestions';

const STORAGE_KEYS = {
  QUESTIONS: 'zen_questions_v1',
  SUBMISSIONS: 'zen_submissions_v1',
  DRAFT: 'zen_checkin_draft_v1',
  CLOUD_CONFIG: 'zen_cloud_config_v1',
  THEME: 'zen_theme_v1',
};

// Cross-tab broadcast channel for local instant realtime sync
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('zen_local_sync_channel');
  }
} catch (e) {
  console.warn('BroadcastChannel not supported in this environment', e);
}

export function postLocalSyncEvent(type: 'SUBMISSION_ADDED' | 'QUESTIONS_UPDATED' | 'SUBMISSION_DELETED', payload?: unknown) {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type, payload, timestamp: Date.now() });
    } catch (e) {
      console.warn('Error broadcasting sync event', e);
    }
  }
}

export function subscribeToLocalSync(callback: (type: string, payload?: unknown) => void): () => void {
  if (!broadcastChannel) return () => {};
  const handler = (event: MessageEvent) => {
    if (event.data && event.data.type) {
      callback(event.data.type, event.data.payload);
    }
  };
  broadcastChannel.addEventListener('message', handler);
  return () => {
    broadcastChannel?.removeEventListener('message', handler);
  };
}

export function loadStoredQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (!raw) {
      saveStoredQuestions(DEFAULT_QUESTIONS);
      return DEFAULT_QUESTIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.sort((a, b) => a.order - b.order);
    }
    return DEFAULT_QUESTIONS;
  } catch (e) {
    console.error('Error loading stored questions', e);
    return DEFAULT_QUESTIONS;
  }
}

export function saveStoredQuestions(questions: Question[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    postLocalSyncEvent('QUESTIONS_UPDATED', questions);
  } catch (e) {
    console.error('Error saving stored questions', e);
  }
}

export function loadStoredSubmissions(): Submission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Sort reverse chronological by timestamp (newest first)
      return parsed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    return [];
  } catch (e) {
    console.error('Error loading stored submissions', e);
    return [];
  }
}

export function saveStoredSubmissions(submissions: Submission[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  } catch (e) {
    console.error('Error saving stored submissions', e);
  }
}

export function loadStoredDraft(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRAFT);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveStoredDraft(draft: Record<string, string>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(draft));
  } catch (e) {
    console.error('Error saving draft', e);
  }
}

export function clearStoredDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.DRAFT);
  } catch (e) {
    console.error('Error clearing draft', e);
  }
}

export function loadStoredCloudConfig(): CloudConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLOUD_CONFIG);
    const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        supabaseUrl: parsed.supabaseUrl || envUrl,
        supabaseAnonKey: parsed.supabaseAnonKey || envKey,
        syncEnabled: typeof parsed.syncEnabled === 'boolean' ? parsed.syncEnabled : Boolean(envUrl && envKey),
        autoSync: parsed.autoSync !== false,
      };
    }

    return {
      supabaseUrl: envUrl,
      supabaseAnonKey: envKey,
      syncEnabled: Boolean(envUrl && envKey),
      autoSync: true,
    };
  } catch {
    return {
      supabaseUrl: '',
      supabaseAnonKey: '',
      syncEnabled: false,
      autoSync: true,
    };
  }
}

export function saveStoredCloudConfig(config: CloudConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CLOUD_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving cloud config', e);
  }
}

export function loadStoredTheme(): 'light' | 'dark' | 'system' {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.THEME);
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
    return 'system';
  } catch {
    return 'system';
  }
}

export function saveStoredTheme(theme: 'light' | 'dark' | 'system'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (e) {
    console.error('Error saving theme', e);
  }
}
