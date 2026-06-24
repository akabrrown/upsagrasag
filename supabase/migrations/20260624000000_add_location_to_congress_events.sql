-- Migration to add location column to congress_events
default public schema

ALTER TABLE public.congress_events
ADD COLUMN IF NOT EXISTS location text;
