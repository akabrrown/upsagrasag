-- 02_posts.sql
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  body text NOT NULL,
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public select posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "admin modify posts" ON public.posts FOR ALL USING (auth.role() = 'admin');
