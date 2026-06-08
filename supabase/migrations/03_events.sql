-- 03_events.sql
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  location text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policies (admin only)
CREATE POLICY "admin_select_events" ON public.events FOR SELECT USING (auth.role() = 'admin');
CREATE POLICY "admin_insert_events" ON public.events FOR INSERT WITH CHECK (auth.role() = 'admin');
CREATE POLICY "admin_update_events" ON public.events FOR UPDATE USING (auth.role() = 'admin') WITH CHECK (auth.role() = 'admin');
CREATE POLICY "admin_delete_events" ON public.events FOR DELETE USING (auth.role() = 'admin');
