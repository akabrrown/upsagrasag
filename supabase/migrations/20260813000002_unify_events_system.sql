-- Migration: Unify Events System
-- Consolidate congress_events and featured_events into events_programmes

-- 1. Add type and display_on_page columns to events_programmes
ALTER TABLE public.events_programmes ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Event';
ALTER TABLE public.events_programmes ADD COLUMN IF NOT EXISTS display_on_page BOOLEAN DEFAULT true;
ALTER TABLE public.events_programmes ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.events_programmes ADD COLUMN IF NOT EXISTS url TEXT;

-- Ensure all existing events_programmes have type 'Event' and display_on_page true
UPDATE public.events_programmes SET type = 'Event' WHERE type IS NULL;
UPDATE public.events_programmes SET display_on_page = true WHERE display_on_page IS NULL;

-- 2. Migrate congress_events data into events_programmes
INSERT INTO public.events_programmes (
    id,
    title,
    description,
    event_date,
    location,
    image_url,
    url,
    is_featured,
    type,
    display_on_page,
    created_at,
    updated_at
)
SELECT 
    id,
    title,
    description,
    event_date,
    location,
    image_url,
    url,
    false AS is_featured,
    'Congress' AS type,
    true AS display_on_page,
    created_at,
    updated_at
FROM public.congress_events
ON CONFLICT (id) DO NOTHING;

-- 3. Update sub_events to point to events_programmes (since congress events are now there)
-- The foreign key was previously pointing to congress_events
ALTER TABLE public.sub_events
  DROP CONSTRAINT IF EXISTS sub_events_event_id_fkey;

ALTER TABLE public.sub_events
  ADD CONSTRAINT sub_events_event_id_fkey 
  FOREIGN KEY (event_id) 
  REFERENCES public.events_programmes(id) 
  ON DELETE CASCADE;

-- 4. Drop redundant tables
DROP TABLE IF EXISTS public.congress_events;
DROP TABLE IF EXISTS public.featured_events;
