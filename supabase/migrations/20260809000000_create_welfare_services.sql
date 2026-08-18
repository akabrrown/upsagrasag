-- Create welfare_services table
CREATE TABLE IF NOT EXISTS public.welfare_services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    action TEXT NOT NULL,
    href TEXT,
    icon TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.welfare_services ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone."
    ON public.welfare_services FOR SELECT
    USING ( true );

CREATE POLICY "Admin can insert welfare services."
    ON public.welfare_services FOR INSERT
    WITH CHECK ( auth.role() = 'authenticated' ); -- assuming authenticated role or admin role is checked via application

CREATE POLICY "Admin can update welfare services."
    ON public.welfare_services FOR UPDATE
    USING ( auth.role() = 'authenticated' );

CREATE POLICY "Admin can delete welfare services."
    ON public.welfare_services FOR DELETE
    USING ( auth.role() = 'authenticated' );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER handle_welfare_services_updated_at
    BEFORE UPDATE ON public.welfare_services
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- Insert initial data
INSERT INTO public.welfare_services (title, description, action, href, icon, display_order) VALUES
('Emergency Financial Support', 'Check available assistance for unexpected financial difficulties.', 'Check eligibility →', '#contact-welfare', 'DollarSign', 1),
('Accommodation Support', 'Get guidance on hostels, housing concerns and roommate connections.', 'Find accommodation help →', '#contact-welfare', 'Home', 2),
('Academic & Personal Concerns', 'Get help navigating grievances or personal challenges affecting your studies.', 'Request guidance →', '#contact-welfare', 'HelpCircle', 3),
('Safety & Confidential Reporting', 'Report harassment, discrimination or immediate welfare concerns safely.', 'Make a confidential report →', '#contact-welfare', 'ShieldAlert', 4),
('Mental Health & Counselling', 'Speak confidentially with a professional counsellor or support officer.', 'Speak to someone →', '#contact-welfare', 'Brain', 5);
