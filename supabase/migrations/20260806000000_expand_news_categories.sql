-- Migration: expand news_updates category to support richer content types
-- Run after: 20260618024500_update_news_updates_category.sql
ALTER TABLE public.news_updates DROP CONSTRAINT IF EXISTS news_updates_category_check;

ALTER TABLE public.news_updates ADD CONSTRAINT news_updates_category_check CHECK (
  category IN (
    'news',
    'articles',
    'announcements',
    'press',
    'grasag-updates',
    'events-recaps',
    'student-stories'
  )
);