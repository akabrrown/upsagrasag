-- Add theme and slug to events_programmes table

ALTER TABLE IF EXISTS public.events_programmes ADD COLUMN IF NOT EXISTS theme TEXT;
ALTER TABLE IF EXISTS public.events_programmes ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
