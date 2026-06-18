-- Create pages table
create table public.pages (
  id uuid default uuid_generate_v4() primary key,
  slug text not null unique,
  title text not null,
  content text,
  image_url text,
  status text not null default 'draft',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.pages enable row level security;

-- Policy: public can select only published pages
create policy "public select published" on public.pages for select using (status = 'published');

-- Policy: admin can insert/update/delete
create policy "admin full access" on public.pages for all using (auth.role() = 'admin');

-- Create admin_users table
create table public.admin_users (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  role text not null default 'admin',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.admin_users enable row level security;
create policy "admin users full access" on public.admin_users for all using (auth.role() = 'admin');
