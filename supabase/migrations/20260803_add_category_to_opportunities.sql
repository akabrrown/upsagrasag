-- Migration: Add category column back to opportunities
ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS category TEXT;
