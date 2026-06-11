-- Migration: create past_questions table
create table public.past_questions (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  display_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS: admin can modify, public can read
alter table public.past_questions enable row level security;
create policy "admin_full_access" on public.past_questions for all using (auth.role() = 'admin');
create policy "public_select" on public.past_questions for select using (true);
