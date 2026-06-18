-- 20260618024000_admin_backend_overhaul.sql

-- Enable uuid-ossp extension if not exists
create extension if not exists "uuid-ossp";

-- 1. admin_users
create table if not exists public.admin_users (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  role text not null default 'admin',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table public.admin_users enable row level security;
drop policy if exists "admin users full access" on public.admin_users;
create policy "admin users full access" on public.admin_users for all using (auth.role() = 'admin');

-- 2. homepage_president
create table if not exists public.homepage_president (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  speech text not null,
  image_url text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table public.homepage_president enable row level security;
drop policy if exists "public select president" on public.homepage_president;
drop policy if exists "admin full access president" on public.homepage_president;
create policy "public select president" on public.homepage_president for select using (true);
create policy "admin full access president" on public.homepage_president for all using (auth.role() = 'admin');

-- 3. congress_events
create table if not exists public.congress_events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  event_date timestamp with time zone not null,
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table public.congress_events enable row level security;
drop policy if exists "public select congress" on public.congress_events;
drop policy if exists "admin full access congress" on public.congress_events;
create policy "public select congress" on public.congress_events for select using (true);
create policy "admin full access congress" on public.congress_events for all using (auth.role() = 'admin');

-- 4. partners
create table if not exists public.partners (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  logo_url text not null,
  display_order int default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table public.partners enable row level security;
drop policy if exists "public select partners" on public.partners;
drop policy if exists "admin full access partners" on public.partners;
create policy "public select partners" on public.partners for select using (true);
create policy "admin full access partners" on public.partners for all using (auth.role() = 'admin');

-- 5. constitution_files
create table if not exists public.constitution_files (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  file_url text not null,
  version text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table public.constitution_files enable row level security;
drop policy if exists "public select constitution" on public.constitution_files;
drop policy if exists "admin full access constitution" on public.constitution_files;
create policy "public select constitution" on public.constitution_files for select using (true);
create policy "admin full access constitution" on public.constitution_files for all using (auth.role() = 'admin');

-- 6. leadership
create table if not exists public.leadership (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  role text not null,
  type text not null check (type in ('patron', 'authority')),
  bio text,
  image_url text,
  display_order int default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table public.leadership enable row level security;
drop policy if exists "public select leadership" on public.leadership;
drop policy if exists "admin full access leadership" on public.leadership;
create policy "public select leadership" on public.leadership for select using (true);
create policy "admin full access leadership" on public.leadership for all using (auth.role() = 'admin');

-- 7. executives
create table if not exists public.executives (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  title text not null,
  bio text,
  photo_url text,
  display_order int default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table public.executives enable row level security;
drop policy if exists "public select executives" on public.executives;
drop policy if exists "admin full access executives" on public.executives;
create policy "public select executives" on public.executives for select using (true);
create policy "admin full access executives" on public.executives for all using (auth.role() = 'admin');

-- 8. opportunities
create table if not exists public.opportunities (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  company text not null,
  type text not null,
  category text not null,
  apply_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table public.opportunities add column if not exists company text;
alter table public.opportunities add column if not exists type text;
alter table public.opportunities add column if not exists category text;
alter table public.opportunities add column if not exists apply_url text;
alter table public.opportunities enable row level security;
drop policy if exists "public select opportunities" on public.opportunities;
drop policy if exists "admin full access opportunities" on public.opportunities;
create policy "public select opportunities" on public.opportunities for select using (true);
create policy "admin full access opportunities" on public.opportunities for all using (auth.role() = 'admin');

-- 9. resources
create table if not exists public.resources (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  file_url text,
  link_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table public.resources enable row level security;
drop policy if exists "public select resources" on public.resources;
drop policy if exists "admin full access resources" on public.resources;
create policy "public select resources" on public.resources for select using (true);
create policy "admin full access resources" on public.resources for all using (auth.role() = 'admin');

-- 10. past_questions
create table if not exists public.past_questions (
  id uuid default uuid_generate_v4() primary key,
  course_code text not null,
  course_title text not null,
  year text not null,
  file_url text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table public.past_questions enable row level security;
drop policy if exists "public select past_questions" on public.past_questions;
drop policy if exists "admin full access past_questions" on public.past_questions;
create policy "public select past_questions" on public.past_questions for select using (true);
create policy "admin full access past_questions" on public.past_questions for all using (auth.role() = 'admin');

-- 11. tutorials
create table if not exists public.tutorials (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  video_url text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table public.tutorials enable row level security;
drop policy if exists "public select tutorials" on public.tutorials;
drop policy if exists "admin full access tutorials" on public.tutorials;
create policy "public select tutorials" on public.tutorials for select using (true);
create policy "admin full access tutorials" on public.tutorials for all using (auth.role() = 'admin');

-- 12. events_programmes
create table if not exists public.events_programmes (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  event_date timestamp with time zone not null,
  location text,
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table public.events_programmes enable row level security;
drop policy if exists "public select events_programmes" on public.events_programmes;
drop policy if exists "admin full access events_programmes" on public.events_programmes;
create policy "public select events_programmes" on public.events_programmes for select using (true);
create policy "admin full access events_programmes" on public.events_programmes for all using (auth.role() = 'admin');

-- 13. research_opportunities
create table if not exists public.research_opportunities (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  sub_type text not null check (sub_type in ('scholarships', 'calls', 'publications', 'careers')),
  link_url text,
  deadline timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table public.research_opportunities enable row level security;
drop policy if exists "public select research_opportunities" on public.research_opportunities;
drop policy if exists "admin full access research_opportunities" on public.research_opportunities;
create policy "public select research_opportunities" on public.research_opportunities for select using (true);
create policy "admin full access research_opportunities" on public.research_opportunities for all using (auth.role() = 'admin');

-- 14. news_updates
create table if not exists public.news_updates (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  category text not null check (category in ('notices', 'press', 'reports', 'accountability', 'gallery')),
  image_url text,
  published_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table public.news_updates enable row level security;
drop policy if exists "public select news_updates" on public.news_updates;
drop policy if exists "admin full access news_updates" on public.news_updates;
create policy "public select news_updates" on public.news_updates for select using (true);
create policy "admin full access news_updates" on public.news_updates for all using (auth.role() = 'admin');

-- 15. platform_settings
create table if not exists public.platform_settings (
  id uuid default uuid_generate_v4() primary key,
  maintenance_mode boolean default false,
  updated_at timestamp with time zone default now()
);
alter table public.platform_settings add column if not exists maintenance_mode boolean default false;
alter table public.platform_settings enable row level security;
drop policy if exists "public select platform_settings" on public.platform_settings;
drop policy if exists "admin full access platform_settings" on public.platform_settings;
create policy "public select platform_settings" on public.platform_settings for select using (true);
create policy "admin full access platform_settings" on public.platform_settings for all using (auth.role() = 'admin');

-- Insert initial platform_settings row if empty
insert into public.platform_settings (maintenance_mode)
select false
where not exists (select 1 from public.platform_settings);

-- Set up storage buckets
insert into storage.buckets (id, name, public) values ('constitution_files', 'constitution_files', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('past_questions', 'past_questions', true) on conflict (id) do nothing;

-- Storage policies for constitution_files
create policy "public select constitution_files storage" on storage.objects for select using (bucket_id = 'constitution_files');
create policy "admin full access constitution_files storage" on storage.objects for all using (bucket_id = 'constitution_files' and auth.role() = 'admin');

-- Storage policies for past_questions
create policy "public select past_questions storage" on storage.objects for select using (bucket_id = 'past_questions');
create policy "admin full access past_questions storage" on storage.objects for all using (bucket_id = 'past_questions' and auth.role() = 'admin');
