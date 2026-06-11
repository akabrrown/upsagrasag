-- Migration: create partners table
CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  logo_url text NOT NULL, -- Cloudinary image URL
  website text,
  description text,
  slug text NOT NULL UNIQUE,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS: only admin can read/write
CREATE POLICY "admin_access" ON public.partners
  FOR ALL USING (auth.role() = 'admin');
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
