-- 20260701000000_add_is_featured_to_events_programmes.sql

-- Add is_featured column to events_programmes table
alter table public.events_programmes
  add column if not exists is_featured boolean default false;

-- Ensure existing rows have a value
update public.events_programmes set is_featured = false where is_featured is null;

-- Enable row level security policy already exists; no changes needed.
