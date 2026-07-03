import React from 'react';
import { LeadershipClient } from './LeadershipClient';
import { leadershipService } from '@/lib/supabase/admin';

export const revalidate = 60; // Revalidate every 60 seconds

// Exact list of GRASAG-UPSA executives with their real biographies and local image pathways
const MOCK_EXECUTIVES = [
  {
    id: "exec-sasu",
    name: "Samuel Sasu Adonteng",
    role: "President",
    email: "president@grasagupsa.org",
    bio: "Samuel Sasu Adonteng is a youth development practitioner, policy advocate, and emerging academic with experience in project management, public policy, entrepreneurship, education, and students’ rights. He is currently affiliated with the University of Professional Studies, Accra, supporting work across the Media and Website Unit and the UPSA Enterprise and Innovation Centre, where he contributes to programme design, research, communications, innovation, and student enterprise development. He is also the Head of the Technical Division at the All-Africa Students Union, where he has coordinated major initiatives including digital inclusion, girls’ education, youth empowerment, and student participation in education governance. Samuel is a first-year PhD student at UPSA with interests in education, public policy, leadership, entrepreneurship, and social change, and remains committed to advancing opportunities that empower young people, strengthen institutions, and promote inclusive development across Africa. Currently, Samuel serves as President of GRASAG UPSA for the 2026/2027 Academic Year.",
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
    bio: "Kelvin Nii Adotey Saka is an emerging quality management professional, researcher, and student leader dedicated to advancing excellence in higher education, organizational development, and institutional governance. With a growing track record in quality assurance, stakeholder engagement, and policy support, he is passionate about driving continuous improvement and promoting meaningful student participation in decisionmaking processes. He is currently pursuing a Master of Business Administration (MBA) in Total Quality Management at the University of Professional Studies, Accra (UPSA), where he previously earned a Bachelor of Business Administration. Kelvin has gained professional experience through his work with the All-Africa Students Union (AASU) and the Global Student Forum, contributing to organizational coordination, membership engagement, and strategic initiatives across diverse contexts. His research interests include quality assurance systems, higher education governance, process improvement, and student engagement. He remains committed to fostering innovation, accountability, and sustainable institutional growth.",
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
type Executive = { id: string; name: string; role: string; email: string; bio: string; type: string; display_order: number; image_url: string; };
export default async function LeadershipPage() {
  let executives: Executive[] = [];
  try {
    const allLeaders = await leadershipService.list();
    executives = allLeaders
      .filter(l => l.type === 'executive')
      .map(l => ({
        id: l.id ?? '',
        name: l.name ?? '',
        role: l.role ?? '',
        email: l.email ?? '',
        bio: l.bio ?? '',
        type: l.type ?? 'executive',
        display_order: l.display_order ?? 0,
        image_url: l.image_url ?? ''
      }))
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  } catch (error) {
    console.error("Error fetching leaders from Supabase, using mock fallback data:", error);
  }

  // Fall back to high-quality mock data if database has no executives or connection failed
  const displayExecutives = executives.length > 0 ? executives : MOCK_EXECUTIVES;

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

        <LeadershipClient executives={displayExecutives} />
      </div>
    </div>
  );
}
