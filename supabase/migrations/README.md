-- 01_admin_users.sql
CREATE TABLE public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_uid text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policies: only admin can modify
CREATE POLICY "admin can select" ON public.admin_users FOR SELECT USING (true);
CREATE POLICY "admin can modify" ON public.admin_users FOR ALL USING (auth.uid() = auth_uid);

-- 02_posts.sql
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  body text NOT NULL,
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public select posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "admin modify posts" ON public.posts FOR INSERT, UPDATE, DELETE USING (auth.role() = 'admin');

-- 03_events.sql
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date timestamp with time zone NOT NULL,
  location text,
  description text,
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public select events" ON public.events FOR SELECT USING (true);
CREATE POLICY "admin modify events" ON public.events FOR INSERT, UPDATE, DELETE USING (auth.role() = 'admin');

-- 04_opportunities.sql
CREATE TABLE public.opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL,
  details text,
  link text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public select opportunities" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "admin modify opportunities" ON public.opportunities FOR INSERT, UPDATE, DELETE USING (auth.role() = 'admin');

-- 05_mba_courses.sql
CREATE TABLE public.mba_courses (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE
);

INSERT INTO public.mba_courses (name) VALUES
  ('Master of Business Administration in Accounting & Finance'),
  ('Master of Business Administration in Auditing'),
  ('Master of Business Administration in Internal Auditing'),
  ('Master of Business Administration in Corporate Governance'),
  ('Master of Business Administration in Marketing'),
  ('Master of Business Administration in Total Quality Management'),
  ('Master of Business Administration in Corporate Communications'),
  ('Master of Business Administration in Petroleum Accounting & Finance'),
  ('Master of Business Administration in Impact Entrepreneurship and Innovation'),
  ('Master of Business Administration in Business Management'),
  ('Master of Business Administration in Wealth and Asset Management'),
  ('Master of Business Administration in Management Information Systems'),
  ('Master of Business Administration in Human Resource Management');

-- No RLS needed – read‑only for all users

-- 06_questions_bank.sql
CREATE TYPE public.file_type AS ENUM ('pdf', 'docx');

CREATE TABLE public.questions_bank (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id integer REFERENCES public.mba_courses(id) NOT NULL,
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type public.file_type NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.questions_bank ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public select questions" ON public.questions_bank FOR SELECT USING (true);
CREATE POLICY "admin modify questions" ON public.questions_bank FOR INSERT, UPDATE, DELETE USING (auth.role() = 'admin');

-- 07_chat_logs.sql
CREATE TABLE public.chat_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  message text NOT NULL,
  response text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin select chat logs" ON public.chat_logs FOR SELECT USING (auth.role() = 'admin');
CREATE POLICY "admin insert chat logs" ON public.chat_logs FOR INSERT USING (auth.role() = 'admin');
