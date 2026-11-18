export interface Question {
  id: string;
  text: string;
  placeholder?: string;
  required?: boolean;
  order: number;
  archived?: boolean;
  createdAt: string;
}

export interface TemplateQuestionItem {
  id: string;
  text: string;
  placeholder?: string;
  required?: boolean;
}

export interface QuestionTemplate {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  questions: TemplateQuestionItem[];
  isCustom?: boolean;
  createdAt: string;
  updatedAt?: string;
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
  templateId?: string;
  templateTitle?: string;
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
