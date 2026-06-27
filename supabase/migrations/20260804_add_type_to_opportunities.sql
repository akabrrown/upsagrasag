-- Migration: Add type column back to opportunities
ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS type TEXT;
