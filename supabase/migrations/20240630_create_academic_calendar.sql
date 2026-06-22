-- 20240630_create_academic_calendar.sql
-- Migration to create the academic_calendar table for storing calendar events

CREATE TABLE IF NOT EXISTS academic_calendar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Trigger to update updated_at on row modification
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp ON academic_calendar;
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON academic_calendar
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
