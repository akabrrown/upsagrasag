import React from 'react';
import { LeadershipClient } from './LeadershipClient';
import { leadershipService, pastExecutiveService, supabaseAdminClient } from '@/lib/supabase/admin';

export const revalidate = 60; // Revalidate every 60 seconds

// Exact list of GRASAG-UPSA executives with their real biographies and local image pathways
const MOCK_EXECUTIVES = [
  {
    id: "exec-sasu",
    name: "Samuel Sasu Adonteng",
    role: "President",
    email: "president@grasagupsa.org",
    bio: "Samuel Sasu Adonteng is a youth development practitioner, policy advocate, and emerging academic with experience in project management, public policy, entrepreneurship, education, and students’ rights...",
    type: "executive",
    display_order: 1,
    image_url: "/Sasu.jpeg"
  },
  {
    id: "exec-duncan",
    name: "Michael Duncan Manyah",
    role: "Vice President",
    email: "vp@grasagupsa.org",
    bio: "Michael Duncan Manyah is a dedicated student leader committed to enhancing the graduate student experience at UPSA, working collaboratively to implement student-centered policies, academic support systems, and welfare initiatives.",
    type: "executive",
    display_order: 2,
    image_url: "/VP.jpeg"
  },
  {
    id: "exec-aba",
    name: "Ennuson Nana Aba Afomoaba",
    role: "General Secretary",
    email: "secretary@grasagupsa.org",
    bio: "Ennuson Nana Aba Afomoaba is the General Secretary of GRASAG-UPSA, ensuring administrative excellence, efficient record keeping, and clear communication channels between the executive committee, students, and administration.",
    type: "executive",
    display_order: 3,
    image_url: "/WhatsApp Image 2026-06-04 at 6.14.59 PM.jpeg"
  },
  {
    id: "exec-norbert",
    name: "Norbert Okyere Boansi",
    role: "Finance Officer",
    email: "finance@grasagupsa.org",
    bio: "Norbert Okyere Boansi is the Finance Officer of GRASAG-UPSA, managing resources with maximum accountability, transparency, and strategic foresight to support key graduate student welfare and development programmes.",
    type: "executive",
    display_order: 4,
    image_url: "/Norbet.jpeg"
  },
  {
    id: "exec-kelvin",
    name: "Kelvin Saka",
    role: "Organising Secretary",
    email: "organising@grasagupsa.org",
    bio: "Kelvin Nii Adotey Saka is an emerging quality management professional...",
    type: "executive",
    display_order: 5,
    image_url: "/WhatsApp Image 2026-06-04 at 6.14.58 PM (1).jpeg"
  },
  {
    id: "exec-samantha",
    name: "Samantha Abdallah",
    role: "Women's Commissioner",
    email: "wocom@grasagupsa.org",
    bio: "Samantha Abdallah is the Women's Commissioner of GRASAG-UPSA for the 2026/2027 Academic Year. She is dedicated to advocating for gender inclusion, organising empowerment seminars, and establishing mentoring programs for graduate female students.",
    type: "executive",
    display_order: 6,
    image_url: "/Secretary.jpeg"
  }
];
type Executive = { id: string; name: string; role: string; email: string; phone: string; bio: string; type: string; display_order: number; image_url: string; };

export default async function LeadershipPage() {
  let executives: Executive[] = [];
  let patrons: Executive[] = [];
  let pastExecutives: any[] = [];
  let eventsCount = 0;
  
  try {
    const allLeaders = await leadershipService.list();
    executives = allLeaders
      .filter(l => l.type === 'executive')
      .map(l => ({
        id: l.id ?? '',
        name: l.name ?? '',
        role: l.role ?? '',
        email: (l as any).email ?? '',
        phone: (l as any).phone ?? '',
        bio: l.bio ?? '',
        type: l.type ?? 'executive',
        display_order: l.display_order ?? 0,
        image_url: l.image_url ?? ''
      }))
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

    patrons = allLeaders
      .filter(l => l.type === 'patron')
      .map(l => ({
        id: l.id ?? '',
        name: l.name ?? '',
        role: l.role ?? '',
        email: (l as any).email ?? '',
        phone: (l as any).phone ?? '',
        bio: l.bio ?? '',
        type: l.type ?? 'patron',
        display_order: l.display_order ?? 0,
        image_url: l.image_url ?? ''
      }))
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  } catch (error) {
    console.error("Error fetching leaders from Supabase, using mock fallback data:", error);
  }

  try {
    pastExecutives = await pastExecutiveService.list();
  } catch (error) {
    console.error("Error fetching past executives from Supabase:", error);
  }

  try {
    const { count, error } = await supabaseAdminClient
      .from('events_programmes')
      .select('id', { count: 'exact', head: true });
    
    if (!error && count !== null) {
      eventsCount = count;
    }
  } catch (error) {
    console.error("Error fetching events count from Supabase:", error);
  }

  // Fall back to high-quality mock data if database has no executives or connection failed
  const displayExecutives = executives.length > 0 ? executives : MOCK_EXECUTIVES;
  const displayPatrons = patrons;
  
  const stats = {
    executivesCount: displayExecutives.length,
    eventsCount: eventsCount || 25, // Fallback to 25 if error/0 for UI gracefully
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 space-y-24">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-block rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            Governance
          </span>
          <h1 className="text-5xl font-extrabold text-neutral-900 tracking-tight sm:text-6xl bg-gradient-to-r from-neutral-900 via-neutral-800 to-primary bg-clip-text text-transparent animate-fade-in">
            Leadership & Governance
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
            Meet the leaders and executives dedicated to serving your academic welfare, professional opportunities, and graduate community interests.
          </p>
        </div>

        <LeadershipClient executives={displayExecutives} pastExecutives={pastExecutives} patrons={displayPatrons} stats={stats} />
      </div>
    </div>
  );
}
