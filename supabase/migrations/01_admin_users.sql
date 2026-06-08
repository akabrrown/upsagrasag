-- 01_admin_users.sql
CREATE TABLE public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_uid uuid NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policies: only admin can modify
CREATE POLICY "admin can select" ON public.admin_users FOR SELECT USING (true);
CREATE POLICY "admin can modify" ON public.admin_users FOR ALL USING (auth.uid() = auth_uid);
