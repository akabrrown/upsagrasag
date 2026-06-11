-- Migration: create resources table
CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  url text,
  image_url text NOT NULL, -- Cloudinary image URL
  slug text NOT NULL UNIQUE,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS: only admin can read/write
CREATE POLICY "admin_access" ON public.resources
  FOR ALL USING (auth.role() = 'admin');
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
