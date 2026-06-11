-- Migration: create site_settings table
create table public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  key text not null,
  value_text text,
  value_jsonb jsonb,
  updated_at timestamp with time zone default now()
);

-- RLS: restrict to admin role
alter table public.site_settings enable row level security;
create policy "admin_only" on public.site_settings for all using (auth.role() = 'admin');
