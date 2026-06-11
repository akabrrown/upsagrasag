-- Migration: create chatbot_logs table
CREATE TABLE public.chatbot_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid NOT NULL,
  user_message text NOT NULL,
  bot_response text NOT NULL,
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS: only admin can read/write
CREATE POLICY "admin_access" ON public.chatbot_logs
  FOR ALL USING (auth.role() = 'admin');
ALTER TABLE public.chatbot_logs ENABLE ROW LEVEL SECURITY;
