-- Migration: create page_contents table for admin editable pages
CREATE TABLE IF NOT EXISTS public.page_contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL, -- e.g., 'home', 'academics', 'resources'
  title text,
  body text, -- markdown or html content
  image_url text,
  updated_at timestamp with time zone DEFAULT now()
);

-- Grant appropriate permissions (only service role can write)
GRANT SELECT ON public.page_contents TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.page_contents TO service_role;
