-- 06_questions_bank.sql
CREATE TYPE public.file_type AS ENUM ('pdf','docx');

CREATE TABLE IF NOT EXISTS questions_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id INTEGER REFERENCES public.mba_courses(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type public.file_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.questions_bank ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public select questions" ON public.questions_bank FOR SELECT USING (true);
CREATE POLICY "admin modify questions" ON public.questions_bank FOR ALL USING (auth.role() = 'admin');
