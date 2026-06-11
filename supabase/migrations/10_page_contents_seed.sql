-- supabase/migrations/10_page_contents_seed.sql
-- Seed default entries for page_contents so admin panel shows pages
INSERT INTO public.page_contents (slug, title, body, image_url, cta_text, cta_link)
VALUES
  ('home-hero', 'Welcome to GRASAG UPSA', 'Your hero description here.', NULL, 'Learn More', '/about'),
  ('about', 'About Us', 'Information about the organization.', NULL, NULL, NULL),
  ('academics', 'Academics', 'Academic programs and details.', NULL, NULL, NULL),
  ('resources', 'Resources', 'Useful resources and links.', NULL, NULL, NULL),
  ('contact', 'Contact', 'How to reach us.', NULL, NULL, NULL),
  ('past-questions', 'Past Exam Questions', 'Browse past exam PDFs and study materials.', NULL, NULL, NULL),
  ('tutorials', 'Tutorials & Resources', 'Curated tutorial videos and guides.', NULL, NULL, NULL);

-- Ensure RLS policies are already applied in earlier migration.
