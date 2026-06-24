'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { CongressEvent } from '@/types/admin';
import { Bot } from 'lucide-react';
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

        
      </section>

      {/* Strategic Priorities */}
      <section className="py-6">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-xl font-semibold text-center text-primary mb-4">Strategic Priorities</h2>
          <div className="grid grid-cols-2 gap-4">
  <div className="flex flex-col items-center bg-white/80 backdrop-blur-md p-2 rounded text-center">
    <Image src="/Academic advocacy and curriculum improvement.png" alt="Academic" width={40} height={40} className="w-10 h-10 mb-2 rounded" />
    <span className="text-sm font-medium mb-1">Academic Advocacy & Curriculum Improvement</span>
    <p className="text-xs text-neutral-600">We champion policies and initiatives that enhance academic excellence, ensuring graduate students have a voice in curriculum development, teaching quality, and the overall learning experience.</p>
  </div>
  <div className="flex flex-col items-center bg-white/80 backdrop-blur-md p-2 rounded text-center">
    <Image src="/Professional development and career services.png" alt="Career" width={40} height={40} className="w-10 h-10 mb-2 rounded" />
    <span className="text-sm font-medium mb-1">Professional Development & Career Services</span>
    <p className="text-xs text-neutral-600">We equip graduate students with the skills, networks, and opportunities needed to excel in their careers through training programs, mentorship, industry engagement, and career support services.</p>
  </div>
  <div className="flex flex-col items-center bg-white/80 backdrop-blur-md p-2 rounded text-center">
    <Image src="/Research funding and collaboration.png" alt="Research" width={40} height={40} className="w-10 h-10 mb-2 rounded" />
    <span className="text-sm font-medium mb-1">Research Funding & Collaboration</span>
    <p className="text-xs text-neutral-600">We promote a vibrant research culture by facilitating access to funding opportunities, fostering interdisciplinary partnerships, and encouraging collaborations with academia, industry, and development organizations.</p>
  </div>
  <div className="flex flex-col items-center bg-white/80 backdrop-blur-md p-2 rounded text-center">
    <Image src="/Student welfare and mental health support.png" alt="Welfare" width={40} height={40} className="w-10 h-10 mb-2 rounded" />
    <span className="text-sm font-medium mb-1">Student Welfare & Mental Health Support</span>
    <p className="text-xs text-neutral-600">We are committed to the holistic well‑being of graduate students by advocating for welfare initiatives, providing support systems, and promoting mental health awareness and resilience.</p>
  </div>
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
