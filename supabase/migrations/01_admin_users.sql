-- 01_admin_users.sql
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_uid uuid NOT NULL UNIQUE,
  must_change_password boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid duplicates
DROP POLICY IF EXISTS "admin can select" ON public.admin_users;
DROP POLICY IF EXISTS "admin can modify" ON public.admin_users;

-- Policies: only admin can modify
CREATE POLICY "admin can select" ON public.admin_users FOR SELECT USING (true);
CREATE POLICY "admin can modify" ON public.admin_users FOR ALL USING (auth.uid() = auth_uid) WITH CHECK (auth.uid() = auth_uid);
