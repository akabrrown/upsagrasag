'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { CongressEvent } from '@/types/admin';
import { Bot, Landmark } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import ChatModal from '@/components/ChatModal';
import PartnerCarousel from '@/components/PartnerCarousel';
import { supabaseClient } from '@/lib/supabaseClient';
import Image from 'next/image';


export default function HomePage() {
    const [isChatOpen, setIsChatOpen] = useState(false);
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Congress events state (fetched from DB)
  const [events, setEvents] = useState<CongressEvent[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const currentEvent = events[currentEventIndex] || null;

  // News updates state
  const [newsUpdates, setNewsUpdates] = useState<{id: string; title: string; content: string; image_url: string; created_at: string; category: string}[]>([]);

  // Quick Links state
  interface QuickLink {
    id: string;
    title: string;
    subtitle?: string;
    icon_name: string;
    url: string;
    display_order: number;
  }
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([
  { id: '1', title: 'Volunteer with Us', subtitle: '', icon_name: 'Heart', url: '/volunteer', display_order: 1 },
  { id: '2', title: 'Reach Out', subtitle: 'Report A Case', icon_name: 'AlertCircle', url: '/report', display_order: 2 },
  { id: '3', title: 'Apply for a Job', subtitle: 'Upload a Job Opportunity', icon_name: 'Briefcase', url: '/jobs', display_order: 3 },
  { id: '4', title: 'Reports and Publications', subtitle: '', icon_name: 'FileText', url: '/reports', display_order: 4 },
]);
  useEffect(() => {
    const fetchQuickLinks = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('quick_links')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          setQuickLinks(data);
        } else if (error) {
          console.error('Error fetching quick links:', error);
          // Fallback sample links in case of error
          setQuickLinks([
            { id: '1', title: 'Volunteer with Us', subtitle: '', icon_name: 'Heart', url: '/volunteer', display_order: 1 },
            { id: '2', title: 'Reach Out', subtitle: 'Report A Case', icon_name: 'AlertCircle', url: '/report', display_order: 2 },
            { id: '3', title: 'Apply for a Job', subtitle: 'Upload a Job Opportunity', icon_name: 'Briefcase', url: '/jobs', display_order: 3 },
            { id: '4', title: 'Reports and Publications', subtitle: '', icon_name: 'FileText', url: '/reports', display_order: 4 },
          ]);
        }
      } catch (e) {
        console.error('Unexpected error fetching quick links:', e);
        // Keep existing sample links
      }
    };
    fetchQuickLinks();
  }, []);
  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabaseClient
        .from('news_updates')
        .select('id, title, content, image_url, created_at, category')
        .order('created_at', { ascending: false })
        .limit(3);
      if (!error && data) {
        setNewsUpdates(data);
      }
    };
    fetchNews();
  }, []);

  // Fetch upcoming congress events (multiple)
  useEffect(() => {
    const fetchCongress = async () => {
      const { data, error } = await supabaseClient
        .from('congress_events')
        .select('title, description, event_date, image_url, location')
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true })
        .limit(5);
      if (!error && data) {
        setEvents(data);
      }
    };
    fetchCongress();
  }, []);

  // Slide show effect for events if more than one
  useEffect(() => {
    if (events.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % events.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [events]);

  // Countdown effect – uses currentEvent event_date from the DB
  useEffect(() => {
    if (!currentEvent?.event_date) return;
    const targetDate = new Date(currentEvent.event_date).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const difference = targetDate - now;
      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      if (difference < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentEvent?.event_date]);

    // Hero section state
  const [hero, setHero] = useState({
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: '',
    imageUrl: '',
  });

  // Fetch hero content
  useEffect(() => {
    const fetchHero = async () => {
      const { data, error } = await supabaseClient
        .from('page_contents')
        .select('title, body, image_url, cta_text, cta_link')
        .eq('slug', 'home-hero')
        .limit(1)
        .maybeSingle();
      if (!error && data) {
        setHero({
          title: data.title ?? '',
          subtitle: data.body ?? '',
          ctaText: data.cta_text ?? '',
          ctaLink: data.cta_link ?? '',
          imageUrl: data.image_url ?? '',
        });
      }
    };
    fetchHero();
  }, []);

  const [partners, setPartners] = useState([] as { name: string; logo: string }[]);

useEffect(() => {
  const fetchPartners = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('partners')
        .select('name, logo_url')
        .order('display_order');
      if (error) throw error;
        const fetched = data.map(p => ({ name: p.name, logo: p.logo_url ?? '' }));
    setPartners(fetched);
    } catch (err) {
      console.warn('Failed to fetch partners (table might be missing)', err);
      setPartners([]);
    }
  };
  fetchPartners();
}, []);

  // Fetch executives (leadership) data
  const [executives, setExecutives] = useState([] as { id: number; name: string; title: string; photo_url: string }[]);
  useEffect(() => {
    const fetchExec = async () => {
      try {
        const response = await fetch('/api/leadership');
        if (!response.ok) throw new Error('Failed to fetch leadership');
        const data = await response.json();
        // The API may return an array directly or an object containing the array under a key (e.g., {executives: [...]})
        const execArray = Array.isArray(data) ? data : data.executives;
        if (Array.isArray(execArray) && execArray.length > 0) {
          setExecutives(execArray);
        } else {
          console.warn('Leadership endpoint returned unexpected format, using sample data');
          setExecutives([
            { id: 1, name: 'Sample Exec 1', title: 'President', photo_url: '' },
            { id: 2, name: 'Sample Exec 2', title: 'Vice President', photo_url: '' },
            { id: 3, name: 'Sample Exec 3', title: 'Treasurer', photo_url: '' },
          ]);
        }
      } catch (err) {
        console.warn('Failed to fetch leadership', err);
        // Fallback sample data on error
        setExecutives([
          { id: 1, name: 'Sample Exec 1', title: 'President', photo_url: '' },
          { id: 2, name: 'Sample Exec 2', title: 'Vice President', photo_url: '' },
          { id: 3, name: 'Sample Exec 3', title: 'Treasurer', photo_url: '' },
        ]);
      }
    };
    fetchExec();
  }, []);


  // Slides will be defined after hero defaults
  // Updated hero defaults for fallback when slide has no custom data
  const heroTitle = hero.title || 'Partner with GRASAG-UPSA today';
  const heroSubtitle = hero.subtitle || 'Join forces with GRASAG‑UPSA to shape graduate research, professional growth, and community impact across Ghana.';
  const heroCtaText = hero.ctaText || 'Partner with us';
  const heroCtaLink = hero.ctaLink || '/opportunities';


  // Define hero slides
  const slides = [
    {
      title: heroTitle,
      subtitle: heroSubtitle,
      ctaText: heroCtaText,
      ctaLink: heroCtaLink,
      bgStyle: { backgroundImage: 'url(/IMG_5241.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' },
    },
    {
      title: 'Welcome to the Graduate Student Association of Ghana - UPSA',
      subtitle: 'Join us in fostering graduate research, professional growth, and community impact across Ghana.',
      ctaText: 'Learn More',
      ctaLink: '/about',
      bgStyle: { backgroundImage: 'url(/IMG_5241.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' },
    },
  ];
  const [slideIndex, setSlideIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);
  const currentSlide = slides[slideIndex];

  const bgStyle = currentSlide?.bgStyle || {};
  const sectionClass = `relative overflow-hidden px-4 py-8 lg:px-8 border-b border-neutral-100 flex items-center justify-center min-h-[700px] ${!bgStyle.backgroundImage ? 'bg-gradient-to-br from-slate-50 via-slate-100/50 to-white' : ''}`;

  return (
    <div className="relative min-h-screen bg-background">
      {/* Hero Section */}
      <section className={sectionClass} style={bgStyle}>
        {/* Dark overlay for readability */}
        {bgStyle.backgroundImage && (
          <div className="absolute inset-0 bg-black/40" />
        )}
        <div className="relative z-10 max-w-2xl text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            {currentSlide.title}
          </h1>
          {currentSlide.subtitle && (
            <p className="mt-2 text-base text-white/80">
              {currentSlide.subtitle}
            </p>
          )}
          {currentSlide.ctaText && currentSlide.ctaLink && (
            <div className="mt-4">
              <Link href={currentSlide.ctaLink} className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition">
                {currentSlide.ctaText}
              </Link>
            </div>
          )}
        </div>
      </section>


      {/* Welcome & About Section (Below Hero) */}
      <section className="bg-neutral-50 border-y border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* President Photo – Left Side */}
            <div className="flex justify-center lg:justify-start lg:order-2">
              <div className="relative w-full max-w-lg overflow-hidden rounded-2xl">
                <Image
                  src="/Sasu.jpeg"
                  alt="President – Samuel Sasu Adonteng"
                  width={300}
                  height={150}
                  className="object-cover w-full h-auto rounded-2xl"
                />
                <div className="pt-4 border-t border-neutral-200">
                  <h3 className="text-lg font-bold text-neutral-900 italic">Samuel Sasu Adonteng</h3>
                  <p className="text-sm font-semibold text-accent mt-1">GRASAG‑UPSA President</p>
                </div>
              </div>
            </div>

            {/* Welcome Text – Right Side */}
            <div className="space-y-6 lg:order-1">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary leading-tight">
                Welcome to the Graduate Student Association of Ghana - UPSA.
              </h2>

              <div className="space-y-4 text-neutral-600 text-sm sm:text-base leading-relaxed">
                <p>
                  The Graduate Student Association of Ghana (GRASAG), University of Professional Studies Chapter, warmly welcomes all graduate students, stakeholders, and partners to our vibrant academic community.
                </p>
                <p>
                  As a body representing graduate students, we are committed to promoting academic excellence, professional development, leadership, research, innovation, and student welfare. We serve as a platform that unites graduate students, amplifies their voices, and creates opportunities for personal and collective growth.
                </p>
                <p>
                  Through seminars, conferences, mentorship programs, research initiatives, community engagements, and professional networking events, we strive to equip our members with the skills and exposure needed to excel both academically and professionally.
                </p>
                <p>
                  We also recognize the importance of collaboration in achieving impactful results. Therefore, we warmly invite organizations, institutions, corporate bodies, alumni, and individuals who share our vision to partner with us in creating meaningful opportunities and lasting impact for graduate students.
                </p>
                <p>
                  Together, we can build a stronger academic and professional community that nurtures future leaders and contributes positively to society.
                </p>
              </div>
            </div>

          </div>
        </div>
    </section>

{/* Upcoming Events Banner */}
{events.length > 0 && (
  <section className="mx-auto max-w-7xl px-4 py-12">
    <div className="relative mx-auto max-w-5xl rounded-2xl overflow-hidden border border-primary/20 bg-white/30 backdrop-blur-xl shadow-2xl min-h-[150px] sm:min-h-[250px]">
      {/* Background image */}
      {currentEvent?.image_url && (
        <Image
          src={currentEvent.image_url}
          alt="Event background"
          width={400}
          height={200}
          className="object-contain opacity-30"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/50 to-secondary/70 mix-blend-multiply" />
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 p-8 lg:p-12 text-center lg:text-left">
        <div className="max-w-xl space-y-4">
          <span className="inline-block rounded-full bg-[#d4af37]/20 px-4 py-1 text-sm font-semibold text-[#d4af37] uppercase tracking-wider border border-[#d4af37]/30">
            Upcoming Event
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            {currentEvent?.title}
          </h2>
          {currentEvent?.location && (
            <p className="text-base text-white font-medium mt-1">
              Location: {currentEvent.location}
            </p>
          )}
          <p className="text-base text-white max-w-prose font-medium">
            {currentEvent?.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-6 justify-center lg:justify-end">
          {[{ label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Min', value: timeLeft.minutes },
            { label: 'Sec', value: timeLeft.seconds }].map(item => (
            <div key={item.label} className="min-w-[70px] rounded-xl bg-primary/10 px-4 py-3 border border-primary/30 text-center">
              <div className="text-2xl font-bold text-primary">{item.value}</div>
              <div className="text-xs font-medium uppercase text-primary/80">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)}

          {/* Our Focus Areas – redesigned */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-accent flex items-center gap-2">
              <Landmark className="h-6 w-6 text-accent" /> Our Focus Areas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* G – Good Governance */}
              <div className="flex flex-col items-center text-center">
                            <Image src="/aassest/letter_g_stylish_1782309960852.png" alt="Good Governance" width={64} height={64} className="mb-2" />
                            <h3 className="text-lg font-bold text-accent">Good Governance, Representation and Accountability</h3>
                            <p className="text-sm text-neutral-500">
                              GRASAG-UPSA promotes transparent, accountable and responsive leadership through effective representation, timely communication, responsible resource management and constitutional governance. We remain committed to leadership that is accessible, answerable and focused on the welfare of all postgraduate students.
                            </p>
                          </div>
                          <div className="flex flex-col items-center text-center">
                            <Image src="/aassest/letter_r_stylish_1782310071931.png" alt="Research" width={64} height={64} className="mb-2" />
                            <h3 className="text-lg font-bold text-accent">Research, Academic Excellence and Innovation</h3>
                            <p className="text-sm text-neutral-500">
                              GRASAG-UPSA supports research, academic excellence and innovation through thesis support, research capacity-building, academic publishing, peer learning and scholarly engagement. We encourage solution-driven research that contributes to institutional improvement, industry practice and national development.
                            </p>
                          </div>
                          <div className="flex flex-col items-center text-center">
                            <Image src="/aassest/letter_a_stylish_1782310150000_1782310122240.png" alt="Access" width={64} height={64} className="mb-2" />
                            <h3 className="text-lg font-bold text-accent">Access, Equity, Inclusion and Digital Transformation</h3>
                            <p className="text-sm text-neutral-500">
                              GRASAG-UPSA promotes equal access, inclusion and non-discrimination for all graduate students, regardless of gender, religion, ethnicity, disability, nationality or social background. We also support digital transformation, accessible communication, technology-enabled services and improved access to digital learning resources.
                            </p>
                          </div>
                          <div className="flex flex-col items-center text-center">
                            <Image src="/aassest/letter_s_stylish_1782310200000_1782310253075.png" alt="Welfare" width={64} height={64} className="mb-2" />
                            <h3 className="text-lg font-bold text-accent">Student Welfare, Support and Wellbeing</h3>
                            <p className="text-sm text-neutral-500">
                              GRASAG-UPSA prioritises the welfare and wellbeing of graduate students, including mental health, psychosocial support, student-parent support, campus services and emergency support systems. We are committed to building a caring graduate community where students feel supported beyond the classroom.
                            </p>
                          </div>
                          <div className="flex flex-col items-center text-center">
                            <Image src="/aassest/letter_a_stylish_1782310150000_1782310122240.png" alt="Advancement" width={64} height={64} className="mb-2" />
                            <h3 className="text-lg font-bold text-accent">Advancement, Employability, Entrepreneurship and Partnerships</h3>
                            <p className="text-sm text-neutral-500">
                              GRASAG-UPSA connects graduate education to career growth, entrepreneurship and national development through employability initiatives, mentorship, alumni engagement, industry networking and strategic partnerships. We help students translate knowledge into professional progress, enterprise and social impact.
                            </p>
                          </div>
                          <div className="flex flex-col items-center text-center">
                            <Image src="/aassest/letter_g_stylish_1782309960852.png" alt="Graduate Community" width={64} height={64} className="mb-2" />
                            <h3 className="text-lg font-bold text-accent">Graduate Community, Identity and Engagement</h3>
                            <p className="text-sm text-neutral-500">
                             GRASAG-UPSA builds a united and active graduate community through student engagement, social interaction, leadership development, recognition programmes, sports, culture and volunteerism. We seek to strengthen identity, belonging and pride among postgraduate students of UPSA.
                            </p>
                          </div>
            </div>
          </section>

          {/* Quick Links Section */}
          <h2 className="text-2xl font-bold text-accent mb-4 mt-12">Quick Links</h2>
          {quickLinks.length > 0 && (
            <section className="mx-auto max-w-5xl px-4 py-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {quickLinks.map((link) => {
                  const IconComponent = (LucideIcons as any)[link.icon_name] || LucideIcons.Link;
                  return (
                    <Link key={link.id} href={link.url} className="flex items-start gap-5 p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-white hover:shadow-sm transition-all group">
                      <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white shadow-sm border border-neutral-100 flex items-center justify-center group-hover:border-accent/30 group-hover:shadow-md transition-all">
                        <IconComponent className="w-6 h-6 text-primary" strokeWidth={2} />
                      </div>
                      <div className="flex flex-col justify-center min-h-[3.5rem]">
                        <h3 className="text-lg font-extrabold text-neutral-800 group-hover:text-primary transition-colors">{link.title}</h3>
                        {link.subtitle && <p className="text-sm font-medium text-neutral-500 mt-0.5">{link.subtitle}</p>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Latest News Section */}
          <section className="mx-auto max-w-7xl px-4 py-16">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 border-l-4 border-accent pl-4">
                Latest <span className="text-accent">News</span>
              </h2>
            </div>
            {newsUpdates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {newsUpdates.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                    <div className="relative h-48 w-full bg-neutral-100 overflow-hidden">
                      {item.image_url ? (
                        <Image src={item.image_url} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-neutral-400">No Image</div>
                      )}
                      {item.category && (
                        <span className="absolute bottom-4 left-4 bg-accent text-white text-xs font-bold px-2 py-1 uppercase rounded-sm z-10">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="text-xs text-neutral-500 mb-2 font-medium">
                        {new Date(item.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <h3 className="text-lg font-bold text-primary mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-neutral-600 line-clamp-3 mb-4 flex-grow">
                        {item.content ? item.content.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>') : ''}
                      </p>
                      <Link href={`/news-updates`} className="text-accent text-sm font-bold tracking-wide flex items-center hover:underline uppercase mt-auto">
                        READ MORE <span className="ml-1">›</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-neutral-500 py-12">No recent news available.</div>
            )}
            <div className="flex justify-center mt-12">
              <Link href="/news-updates" className="rounded-full border-2 border-accent text-accent px-8 py-2.5 text-sm font-bold hover:bg-accent hover:text-white transition-colors uppercase tracking-wider">
                Explore All News
              </Link>
            </div>
          </section>

          {/* Events & Activities Section */}
          <section className="bg-neutral-50 border-y border-neutral-100">
            <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 border-l-4 border-accent pl-4">
                  Events & <span className="text-accent">Activities</span>
                </h2>
              </div>
              {events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {events.slice(0, 3).map((ev, i) => (
                    <div key={i} className="relative rounded-2xl overflow-hidden group h-[400px] shadow-sm hover:shadow-lg transition-shadow">
                      <div className="absolute inset-0 bg-neutral-800">
                        {ev.image_url ? (
                          <Image src={ev.image_url} alt={ev.title} fill className="object-cover opacity-60 group-hover:opacity-50 transition-opacity duration-500 group-hover:scale-105 transform" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center text-white/50" />
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      
                      <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-sm shadow-sm border border-white/10 uppercase">
                            {new Date(ev.event_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
                          {ev.title}
                        </h3>
                        <div className="mt-2 mb-4 text-white/70 text-xs font-bold uppercase tracking-wider bg-white/10 inline-block px-2 py-0.5 rounded border border-white/10 w-max">
                          Event
                        </div>
                        <Link href="/events" className="text-white text-sm font-bold tracking-wide flex items-center hover:text-accent transition-colors uppercase">
                          READ MORE <span className="ml-1">›</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-neutral-500 py-12">No upcoming events available.</div>
              )}
              <div className="flex justify-center mt-12">
                <Link href="/events" className="rounded-full border-2 border-accent text-accent px-8 py-2.5 text-sm font-bold hover:bg-accent hover:text-white transition-colors uppercase tracking-wider">
                  Explore All Events
                </Link>
              </div>
            </div>
          </section>

      {/* Floating Chatbot Indicator */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsChatOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-2xl hover:scale-105 hover:bg-accent/90 transition-all duration-200"
        >
          <Bot className="h-6 w-6" />
        </button>
      </div>
      {/* Chat Modal */}
      <ChatModal open={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
