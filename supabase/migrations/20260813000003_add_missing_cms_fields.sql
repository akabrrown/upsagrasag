-- Add missing fields to CMS tables to match frontend components

-- Opportunities table
ALTER TABLE IF EXISTS public.opportunities ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE IF EXISTS public.opportunities ADD COLUMN IF NOT EXISTS apply_url TEXT;

-- Executives table
ALTER TABLE IF EXISTS public.executives ADD COLUMN IF NOT EXISTS email TEXT;

-- Events & Programmes table
ALTER TABLE IF EXISTS public.events_programmes ADD COLUMN IF NOT EXISTS price TEXT DEFAULT 'Free';
ALTER TABLE IF EXISTS public.events_programmes ADD COLUMN IF NOT EXISTS discount_code TEXT;
ALTER TABLE IF EXISTS public.events_programmes ADD COLUMN IF NOT EXISTS discount_info TEXT;
ALTER TABLE IF EXISTS public.events_programmes ADD COLUMN IF NOT EXISTS registration_deadline TEXT;
ALTER TABLE IF EXISTS public.events_programmes ADD COLUMN IF NOT EXISTS speaker TEXT;
