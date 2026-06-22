-- Migration: add extra metadata columns to past_questions
ALTER TABLE past_questions
  ADD COLUMN IF NOT EXISTS course_code text,
  ADD COLUMN IF NOT EXISTS course_title text,
  ADD COLUMN IF NOT EXISTS year text,
  ADD COLUMN IF NOT EXISTS program_slug text,
  ADD COLUMN IF NOT EXISTS file_path text;
