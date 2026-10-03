-- Migration: merge research_opportunities into opportunities and drop research_opportunities

-- Ensure columns exist just in case they were dropped
ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS category TEXT;

-- Insert all research opportunities into opportunities
INSERT INTO public.opportunities (
    id,
    title,
    description,
    category,
    apply_url,
    deadline,
    created_at,
    type,
    company
)
SELECT 
    id,
    title,
    description,
    sub_type, -- sub_type was 'scholarships', 'calls', etc.
    link_url,
    deadline,
    timezone('utc'::text, now()),
    'Research / Academic', -- default type
    'GRASAG-UPSA' -- default company
FROM public.research_opportunities
ON CONFLICT (id) DO NOTHING;

-- Drop research_opportunities table as it's merged
DROP TABLE IF EXISTS public.research_opportunities;
