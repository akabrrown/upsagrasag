create table public.executives (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  title text not null,
  bio text,
  photo_url text,
  display_order int not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- RLS: only admin can write, everyone can read
alter table public.executives enable row level security;
create policy "admin can full access" on public.executives for all using (auth.role() = 'admin');
create policy "public read" on public.executives for select using (true);
