-- Create welfare_steps table
CREATE TABLE IF NOT EXISTS public.welfare_steps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    step_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create focus_areas table
CREATE TABLE IF NOT EXISTS public.focus_areas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    icon_name TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create objectives table
CREATE TABLE IF NOT EXISTS public.objectives (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    description TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create hero_slides table
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    cta_text TEXT,
    cta_link TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.welfare_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- Policies for welfare_steps
DROP POLICY IF EXISTS "Public welfare_steps are viewable by everyone." ON public.welfare_steps;
DROP POLICY IF EXISTS "Admin can modify welfare_steps." ON public.welfare_steps;
CREATE POLICY "Public welfare_steps are viewable by everyone." ON public.welfare_steps FOR SELECT USING (true);
CREATE POLICY "Admin can modify welfare_steps." ON public.welfare_steps USING (auth.role() = 'authenticated');

-- Policies for focus_areas
DROP POLICY IF EXISTS "Public focus_areas are viewable by everyone." ON public.focus_areas;
DROP POLICY IF EXISTS "Admin can modify focus_areas." ON public.focus_areas;
CREATE POLICY "Public focus_areas are viewable by everyone." ON public.focus_areas FOR SELECT USING (true);
CREATE POLICY "Admin can modify focus_areas." ON public.focus_areas USING (auth.role() = 'authenticated');

-- Policies for objectives
DROP POLICY IF EXISTS "Public objectives are viewable by everyone." ON public.objectives;
DROP POLICY IF EXISTS "Admin can modify objectives." ON public.objectives;
CREATE POLICY "Public objectives are viewable by everyone." ON public.objectives FOR SELECT USING (true);
CREATE POLICY "Admin can modify objectives." ON public.objectives USING (auth.role() = 'authenticated');

-- Policies for hero_slides
DROP POLICY IF EXISTS "Public hero_slides are viewable by everyone." ON public.hero_slides;
DROP POLICY IF EXISTS "Admin can modify hero_slides." ON public.hero_slides;
CREATE POLICY "Public hero_slides are viewable by everyone." ON public.hero_slides FOR SELECT USING (true);
CREATE POLICY "Admin can modify hero_slides." ON public.hero_slides USING (auth.role() = 'authenticated');

-- Triggers for updated_at
DROP TRIGGER IF EXISTS handle_welfare_steps_updated_at ON public.welfare_steps;
CREATE TRIGGER handle_welfare_steps_updated_at BEFORE UPDATE ON public.welfare_steps FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
DROP TRIGGER IF EXISTS handle_focus_areas_updated_at ON public.focus_areas;
CREATE TRIGGER handle_focus_areas_updated_at BEFORE UPDATE ON public.focus_areas FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
DROP TRIGGER IF EXISTS handle_objectives_updated_at ON public.objectives;
CREATE TRIGGER handle_objectives_updated_at BEFORE UPDATE ON public.objectives FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
DROP TRIGGER IF EXISTS handle_hero_slides_updated_at ON public.hero_slides;
CREATE TRIGGER handle_hero_slides_updated_at BEFORE UPDATE ON public.hero_slides FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
-- Extend existing tables with SEO and audit columns

-- Resources table extensions
ALTER TABLE public.resources
    ADD COLUMN IF NOT EXISTS meta_title TEXT,
    ADD COLUMN IF NOT EXISTS meta_description TEXT,
    ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
    ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS metadata JSONB,
    ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
    ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.focus_areas(id) ON DELETE SET NULL;

-- Opportunities table extensions
ALTER TABLE public.opportunities
    ADD COLUMN IF NOT EXISTS meta_title TEXT,
    ADD COLUMN IF NOT EXISTS meta_description TEXT,
    ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
    ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS metadata JSONB,
    ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
    ADD COLUMN IF NOT EXISTS focus_area_id UUID REFERENCES public.focus_areas(id) ON DELETE SET NULL;

-- Editor role policies (insert/update only, no delete)
CREATE POLICY "Editor can modify welfare_steps" ON public.welfare_steps FOR ALL USING (auth.role() = 'editor') WITH CHECK (auth.role() = 'editor');
CREATE POLICY "Editor can modify focus_areas" ON public.focus_areas FOR ALL USING (auth.role() = 'editor') WITH CHECK (auth.role() = 'editor');
CREATE POLICY "Editor can modify objectives" ON public.objectives FOR ALL USING (auth.role() = 'editor') WITH CHECK (auth.role() = 'editor');
CREATE POLICY "Editor can modify hero_slides" ON public.hero_slides FOR ALL USING (auth.role() = 'editor') WITH CHECK (auth.role() = 'editor');

-- End of migration
