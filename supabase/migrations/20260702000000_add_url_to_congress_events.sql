-- 20260702000000_add_url_to_congress_events.sql
-- Migration: add url column to congress_events table

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE IF EXISTS public.congress_events
  ADD COLUMN IF NOT EXISTS url TEXT;

-- Optional index for fast lookup by URL
CREATE INDEX IF NOT EXISTS idx_congress_events_url ON public.congress_events(url);
