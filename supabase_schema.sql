-- ============================================================
-- ZenDaily — Supabase Database Schema & Realtime Setup
-- ============================================================

-- 1. Create questions table
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

-- 4. Policies for authenticated users (each user sees their own entries)
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

-- Optional: Allow public access if using public mode without authentication
DROP POLICY IF EXISTS "Public access to questions" ON public.questions;
CREATE POLICY "Public access to questions" ON public.questions FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to submissions" ON public.submissions;
CREATE POLICY "Public access to submissions" ON public.submissions FOR ALL TO anon USING (true) WITH CHECK (true);

-- 5. Enable Supabase Realtime publication for instant cross-device updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.questions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.submissions;
