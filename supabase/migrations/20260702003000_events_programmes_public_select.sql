-- 20260702003000_events_programmes_public_select.sql
-- Migration: enable public SELECT access to events_programmes

DROP POLICY IF EXISTS "public_select" ON public.events_programmes;
CREATE POLICY "public_select"
  ON public.events_programmes
  FOR SELECT
  USING (true);
