-- Migration: add hero fields to page_contents
ALTER TABLE public.page_contents
ADD COLUMN IF NOT EXISTS cta_text text,
ADD COLUMN IF NOT EXISTS cta_link text;
