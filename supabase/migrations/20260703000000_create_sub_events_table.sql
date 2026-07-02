create table if not exists public.sub_events (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events_programmes(id) on delete cascade,
  title text not null,
  start_at timestamptz not null,
  end_at timestamptz,
  description text,
  created_at timestamptz default now()
);
