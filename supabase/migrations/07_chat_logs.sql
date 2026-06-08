-- 07_chat_logs.sql
CREATE TABLE public.chat_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.admin_users(id),
  message text NOT NULL,
  role text NOT NULL CHECK (role IN ('user','assistant')),
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public select chat_logs" ON public.chat_logs FOR SELECT USING (true);
CREATE POLICY "admin modify chat_logs" ON public.chat_logs FOR ALL USING (auth.role() = 'admin');
