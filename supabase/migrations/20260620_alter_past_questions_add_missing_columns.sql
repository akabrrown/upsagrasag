/*
  Migration: Alter past_questions table to include required columns for admin UI.
  This adds columns that were missing in the previous migration, ensuring that
  past questions created via the admin interface are persisted correctly.
*/

-- Add missing columns
ALTER TABLE public.past_questions
  ADD COLUMN IF NOT EXISTS program_id integer,
  ADD COLUMN IF NOT EXISTS program_slug text,
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS course_code text,
  ADD COLUMN IF NOT EXISTS course_title text,
  ADD COLUMN IF NOT EXISTS file_url text;
  ADD COLUMN IF NOT EXISTS file_path text;

-- Optionally, you may want to populate file_url from existing file_path if present.
-- This step is safe to run even if file_path does not exist.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'past_questions' AND column_name = 'file_path'
  ) THEN
    UPDATE public.past_questions SET file_url = file_path;
  END IF;
END $$;

-- RLS policies already exist; no action needed
