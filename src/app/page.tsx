'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bot } from 'lucide-react';
import ChatModal from '@/components/ChatModal';
import PartnerCarousel from '@/components/PartnerCarousel';
import { supabaseClient } from '@/lib/supabaseClient';


export default function HomePage() {
    const [isChatOpen, setIsChatOpen] = useState(false);
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Congress event state (fetched from DB)
  const [congress, setCongress] = useState<{ title: string; description: string; event_date: string; image_url: string } | null>(null);

  // Hero section state
  const [hero, setHero] = useState({
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: '',
    imageUrl: '',
  });

  // Fetch the latest upcoming congress event
  useEffect(() => {
    const fetchCongress = async () => {
      const { data, error } = await supabaseClient
        .from('congress_events')
        .select('title, description, event_date, image_url')
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true })
        .limit(1)
        .maybeSingle();
      if (!error && data) {
        setCongress(data);
      }
    };
    fetchCongress();
  }, []);

  // Countdown effect – uses congress event_date from the DB
  useEffect(() => {
    if (!congress?.event_date) return;
    const targetDate = new Date(congress.event_date).getTime();
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
  }, [congress?.event_date]);

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
      title: 'Welcome to the Graduate Student Association of Ghana',
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
                  width={500}
                  height={300}
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
                Welcome to the official website for the Graduate Students&apos; Association of Ghana – UPSA.
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

      {/* Countdown & Events banner */}
      {(congress || Object.values(timeLeft).some(v => v > 0)) && (
        <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden gradient-bg text-white px-6 py-12 md:px-12 md:py-16 shadow-xl">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-10"
              style={{ backgroundImage: `url('${congress?.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200'}')` }}
            ></div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="max-w-xl space-y-4">
                <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent tracking-wide uppercase border border-accent/30">
                  Upcoming Events
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
                  {congress?.title || 'Upcoming GRASAG-UPSA Events'}
                </h2>
                <p className="text-sm text-neutral-200">
                  {congress?.description || 'Join our research symposium, professional development panels, and networks. Ensure you register and reserve your delegates slot.'}
                </p>
              </div>

              {/* Timer values */}
              <div className="flex flex-wrap gap-4 text-center">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Min', value: timeLeft.minutes },
                  { label: 'Sec', value: timeLeft.seconds },
                ].map((item) => (
                  <div key={item.label} className="w-20 rounded-2xl bg-white/10 px-3 py-4 backdrop-blur-md border border-white/10">
                    <div className="text-2xl font-black text-white">{item.value}</div>
                    <div className="text-[10px] font-bold text-neutral-300 uppercase tracking-wide">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

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
      {/* Partner Logos */}
<section className="bg-slate-50 border-y border-neutral-100 py-10">
  <div className="mx-auto max-w-7xl px-4 text-center space-y-6">
    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Our Corporate & Academic Partners</p>
    <div className="flex flex-wrap justify-center items-center gap-10">
      <PartnerCarousel logos={partners.map(p => p.logo)} />
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
