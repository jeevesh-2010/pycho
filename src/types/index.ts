export interface Question {
  id: string;
  text: string;
  placeholder?: string;
  required?: boolean;
  order: number;
  archived?: boolean;
  createdAt: string;
}

export interface SubmissionAnswer {
  questionId: string;
  questionText: string;
  answer: string;
}

export interface Submission {
  id: string;
  timestamp: string; // ISO 8601 string, e.g. "2026-11-18T17:15:10.000Z"
  date: string; // YYYY-MM-DD
  answers: SubmissionAnswer[];
  tags?: string[];
  userId?: string;
  synced?: boolean;
  createdAt?: string;
}

export interface CloudConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  syncEnabled: boolean;
  autoSync: boolean;
}

export interface UserSession {
  id: string;
  email?: string;
  isAnonymous?: boolean;
}

export type ActiveTab = 'checkin' | 'history' | 'questions';

export type DateFilterType = 'all' | 'today' | 'yesterday' | 'week' | 'month' | 'custom';
