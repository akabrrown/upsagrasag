-- Migration to add contact_email, contact_phone, contact_address to platform_settings
ALTER TABLE IF EXISTS public.platform_settings
ADD COLUMN IF NOT EXISTS contact_email text,
ADD COLUMN IF NOT EXISTS contact_phone text,
ADD COLUMN IF NOT EXISTS contact_address text;
