create table public.opportunities (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  type text check (type in ('internship','full-time','contract')),
  location text,
  apply_url text,
  image_url text,
  deadline date,
  is_active boolean default true,
  display_order integer default 0,
  slug text unique,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS policies: only admin role can modify; public can read limited fields
create policy "admin_full_access" on public.opportunities for all using (auth.role() = 'admin');
create policy "public_select" on public.opportunities for select using (true);
