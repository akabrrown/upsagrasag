-- 20260702001000_add_url_to_events_programmes.sql
-- Migration: add a URL column to the events_programmes table

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE IF EXISTS public.events_programmes
  ADD COLUMN IF NOT EXISTS url TEXT;

-- Optional index for fast lookup by URL
CREATE INDEX IF NOT EXISTS idx_events_programmes_url ON public.events_programmes(url);
