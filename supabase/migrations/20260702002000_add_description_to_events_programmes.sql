-- 20260702002000_add_description_to_events_programmes.sql
-- Migration: add a description column to the events_programmes table

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE IF EXISTS public.events_programmes
  ADD COLUMN IF NOT EXISTS description TEXT;
