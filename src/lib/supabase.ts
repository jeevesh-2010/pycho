import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Question, Submission, CloudConfig } from '../types';

let supabaseInstance: SupabaseClient | null = null;
let currentConfigKey = '';

export function getSupabaseClient(config?: CloudConfig): SupabaseClient | null {
  const url = config?.supabaseUrl?.trim();
  const key = config?.supabaseAnonKey?.trim();

  if (!url || !key) {
    supabaseInstance = null;
    return null;
  }

  const configKey = `${url}::${key}`;
  if (supabaseInstance && currentConfigKey === configKey) {
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    currentConfigKey = configKey;
    return supabaseInstance;
  } catch (err) {
    console.error('Failed to create Supabase client:', err);
    return null;
  }
}

export async function testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string }> {
  try {
    const tempClient = createClient(url.trim(), key.trim());
    // Try to query or ping the health endpoint / auth
    const { error } = await tempClient.from('submissions').select('id').limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        // Table does not exist yet, but connection succeeded!
        return {
          success: true,
          message: 'Connected to Supabase! (Note: tables not created yet; run the provided SQL setup schema).',
        };
      }
      if (error.message?.includes('JWT') || error.message?.includes('API key')) {
        return { success: false, message: `Authentication error: ${error.message}` };
      }
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Successfully connected and verified database tables!' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Connection failed: ${msg}` };
  }
}

// SQL Schema for user setup
export const SUPABASE_SQL_SCHEMA = `-- 1. Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  placeholder TEXT,
  required BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL,
  date TEXT NOT NULL,
  answers JSONB NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- 4. Policies (authenticated user can access own records)
DROP POLICY IF EXISTS "Users can manage their own questions" ON public.questions;
CREATE POLICY "Users can manage their own questions"
  ON public.questions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own submissions" ON public.submissions;
CREATE POLICY "Users can manage their own submissions"
  ON public.submissions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Optional: Allow anonymous access if using public mode
DROP POLICY IF EXISTS "Public access to questions" ON public.questions;
CREATE POLICY "Public access to questions" ON public.questions FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to submissions" ON public.submissions;
CREATE POLICY "Public access to submissions" ON public.submissions FOR ALL TO anon USING (true) WITH CHECK (true);

-- 5. Enable Realtime Publications
ALTER PUBLICATION supabase_realtime ADD TABLE public.questions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.submissions;
`;

// Remote fetchers
export async function fetchRemoteSubmissions(client: SupabaseClient, userId?: string): Promise<Submission[]> {
  try {
    let query = client.from('submissions').select('*').order('timestamp', { ascending: false });
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { data, error } = await query;
    if (error) {
      console.warn('Error fetching remote submissions:', error.message);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      timestamp: row.timestamp,
      date: row.date,
      answers: row.answers,
      tags: row.tags || [],
      userId: row.user_id,
      synced: true,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.warn('Network error fetching remote submissions', err);
    return [];
  }
}

export async function insertRemoteSubmission(client: SupabaseClient, submission: Submission, userId?: string): Promise<boolean> {
  try {
    const payload = {
      id: submission.id,
      user_id: userId || null,
      timestamp: submission.timestamp,
      date: submission.date,
      answers: submission.answers,
      tags: submission.tags || [],
    };

    const { error } = await client.from('submissions').upsert(payload);
    if (error) {
      console.warn('Failed to insert remote submission:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Network error saving remote submission', err);
    return false;
  }
}

export async function deleteRemoteSubmission(client: SupabaseClient, submissionId: string): Promise<boolean> {
  try {
    const { error } = await client.from('submissions').delete().eq('id', submissionId);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchRemoteQuestions(client: SupabaseClient, userId?: string): Promise<Question[]> {
  try {
    let query = client.from('questions').select('*').order('order_index', { ascending: true });
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { data, error } = await query;
    if (error) {
      console.warn('Error fetching remote questions:', error.message);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      text: row.text,
      placeholder: row.placeholder || '',
      required: Boolean(row.required),
      order: row.order_index ?? 0,
      archived: Boolean(row.archived),
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.warn('Network error fetching remote questions', err);
    return [];
  }
}

export async function syncRemoteQuestions(client: SupabaseClient, questions: Question[], userId?: string): Promise<boolean> {
  try {
    const rows = questions.map((q) => ({
      id: q.id,
      user_id: userId || null,
      text: q.text,
      placeholder: q.placeholder || '',
      required: Boolean(q.required),
      order_index: q.order,
      archived: Boolean(q.archived),
    }));

    const { error } = await client.from('questions').upsert(rows);
    return !error;
  } catch {
    return false;
  }
}
