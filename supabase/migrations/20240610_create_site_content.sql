create table public.site_content (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text not null,
  type text check (type in ('text','html','image_url')) default 'text',
  is_published boolean default false,
  updated_at timestamp with time zone default now()
);
