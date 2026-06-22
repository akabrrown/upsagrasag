-- Migration: add file_path column to past_questions table
ALTER TABLE past_questions
  ADD COLUMN IF NOT EXISTS file_path text;
