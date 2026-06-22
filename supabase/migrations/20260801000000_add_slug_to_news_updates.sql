-- Migration: add slug column to news_updates
-- Timestamp: 2026-08-01 00:00:00 UTC

-- 1. Add slug column (text, not null, default empty string)
ALTER TABLE public.news_updates
  ADD COLUMN slug TEXT NOT NULL DEFAULT '';

-- 2. Populate slug for existing rows using title (simple lower‑case, hyphenated)
UPDATE public.news_updates
SET slug = regexp_replace(lower(trim(title)), '\\s+', '-', 'g')
WHERE slug = '';

-- 3. Ensure uniqueness (add unique index)
CREATE UNIQUE INDEX news_updates_slug_key ON public.news_updates (slug);

-- 4. Optional: set default for future inserts (could be handled in app code)
-- ALTER TABLE public.news_updates ALTER COLUMN slug SET DEFAULT '';
