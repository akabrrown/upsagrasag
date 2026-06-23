/* Migration to add missing columns for past_questions */
-- File: supabase/migrations/20260620_alter_past_questions_add_columns.sql

ALTER TABLE past_questions
  ADD COLUMN IF NOT EXISTS program_slug TEXT,
  ADD COLUMN IF NOT EXISTS course_code TEXT,
  ADD COLUMN IF NOT EXISTS course_title TEXT,
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS file_path TEXT;

-- Populate program_slug from existing programme if needed (optional)
-- UPDATE past_questions SET program_slug = programme;

-- Optionally drop old columns if no longer needed
-- ALTER TABLE past_questions DROP COLUMN IF EXISTS programme;
-- ALTER TABLE past_questions DROP COLUMN IF EXISTS pdf_url;
