/* Migration: add title and created_at columns to past_questions table */
ALTER TABLE past_questions
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
