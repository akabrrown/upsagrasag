-- 04_opportunities.sql
CREATE TABLE public.opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  link text,
  deadline date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Admin‑only policies
CREATE POLICY "admin_select_opportunities" ON public.opportunities FOR SELECT USING (auth.role() = 'admin');
CREATE POLICY "admin_insert_opportunities" ON public.opportunities FOR INSERT WITH CHECK (auth.role() = 'admin');
CREATE POLICY "admin_update_opportunities" ON public.opportunities FOR UPDATE USING (auth.role() = 'admin') WITH CHECK (auth.role() = 'admin');
CREATE POLICY "admin_delete_opportunities" ON public.opportunities FOR DELETE USING (auth.role() = 'admin');
