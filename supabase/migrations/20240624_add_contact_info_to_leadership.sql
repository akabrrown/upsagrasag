/* 20240624_add_contact_info_to_leadership.sql */
-- Add a flexible JSONB column for arbitrary contact information.

alter table public.leadership
  add column if not exists contact_info jsonb default '{}'::jsonb;

-- Optional: create GIN index for faster JSON queries.
create index if not exists idx_leadership_contact_info on public.leadership using gin (contact_info);
