-- Migration: add image_url column to tutorials table

ALTER TABLE public.tutorials ADD COLUMN IF NOT EXISTS image_url text;
