-- Migration to correct foreign key for sub_events
-- Previously referenced events_programmes; now reference congress_events

ALTER TABLE public.sub_events DROP CONSTRAINT IF EXISTS sub_events_event_id_fkey;

ALTER TABLE public.sub_events
  ADD CONSTRAINT sub_events_event_id_fkey
  FOREIGN KEY (event_id) REFERENCES public.congress_events(id) ON DELETE CASCADE;
