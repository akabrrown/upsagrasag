-- Add start_date and end_date to opportunities table

ALTER TABLE IF EXISTS public.opportunities ADD COLUMN IF NOT EXISTS start_date TEXT;
ALTER TABLE IF EXISTS public.opportunities ADD COLUMN IF NOT EXISTS end_date TEXT;
