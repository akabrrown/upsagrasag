create extension if not exists "uuid-ossp";

create table if not exists public.gallery_images (
  id uuid primary key default uuid_generate_v4(),
  url text not null,
  title text not null,
  description text,
  uploaded_at timestamptz not null default now()
);

-- Enable row level security policies (optional)
alter table public.gallery_images enable row level security;

-- Policy: admins can insert, update, delete; public can select
create policy "allow select for all" on public.gallery_images for select using (true);
create policy "admin can modify" on public.gallery_images for all using (auth.role() = 'admin');
