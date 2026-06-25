-- Create quick_links table
CREATE TABLE IF NOT EXISTS public.quick_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    icon_name TEXT NOT NULL,
    url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Setup Row Level Security (RLS)
ALTER TABLE public.quick_links ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to quick_links"
    ON public.quick_links FOR SELECT
    USING (true);

-- Allow authenticated users to manage quick_links
CREATE POLICY "Allow authenticated users to manage quick_links"
    ON public.quick_links FOR ALL
    USING (auth.role() = 'authenticated');

-- Insert default rows matching user request
INSERT INTO public.quick_links (title, subtitle, icon_name, url, display_order)
VALUES
    ('Volunteer with Us', '', 'Heart', '#', 1),
    ('Reach Out', 'Report A Case', 'AlertCircle', '#', 2),
    ('Opportunity Portal', 'Apply for a Job / Upload an Opportunity', 'Briefcase', '#', 3),
    ('Reports and Publications', '', 'FileText', '#', 4);
