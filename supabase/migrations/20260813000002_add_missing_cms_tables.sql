-- Create membership_benefits table
CREATE TABLE IF NOT EXISTS public.membership_benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create academic_supports table
CREATE TABLE IF NOT EXISTS public.academic_supports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set RLS policies
ALTER TABLE public.membership_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_supports ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on membership_benefits"
    ON public.membership_benefits FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access on academic_supports"
    ON public.academic_supports FOR SELECT
    USING (true);
