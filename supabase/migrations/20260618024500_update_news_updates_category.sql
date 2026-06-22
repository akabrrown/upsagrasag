-- Migration to update news_updates category enum
-- Drop old check constraint if it exists
ALTER TABLE public.news_updates DROP CONSTRAINT IF EXISTS news_updates_category_check;
-- Add new check constraint with allowed categories
ALTER TABLE public.news_updates ADD CONSTRAINT news_updates_category_check CHECK (category IN ('news','articles','announcements'));
