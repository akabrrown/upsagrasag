'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Bot } from 'lucide-react';
import { supabaseClient } from '@/lib/supabaseClient';

import { partnerService } from '@/lib/supabase/admin';

export default function HomePage() {
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Hero section state
  const [hero, setHero] = useState({
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: '',
    imageUrl: '',
  });

  // Countdown effect
  useEffect(() => {
    const targetDate = new Date('Nov 15, 2026 09:00:00').getTime();
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
  }, []);

  // Fetch hero content
  useEffect(() => {
    const fetchHero = async () => {
      const { data, error } = await supabaseClient
        .from('page_contents')
        .select('title, body, image_url, cta_text, cta_link')
        .eq('slug', 'home-hero')
        .single();
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
      setPartners(data.map(p => ({ name: p.name, logo: p.logo_url ?? '' })));
    } catch (err) {
      console.error('Failed to fetch partners', err);
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
  const heroBgStyle = hero.imageUrl
    ? { backgroundImage: `url(${hero.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

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
  }, []);
  const currentSlide = slides[slideIndex];

  const bgStyle = currentSlide?.bgStyle || {};
  const sectionClass = `relative overflow-hidden px-4 py-8 lg:px-8 border-b border-neutral-100 flex items-center justify-center min-h-[25vh] ${!bgStyle.backgroundImage ? 'bg-gradient-to-br from-slate-50 via-slate-100/50 to-white' : ''}`;

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
                <img
                  src="/WhatsApp Image 2026-06-04 at 6.23.20 PM.jpeg"
                  alt="President – Samuel Sasu Adonteng"
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
                Welcome to the official website for the Graduate Students' Association of Ghana – UPSA.
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
      <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden gradient-bg text-white px-6 py-12 md:px-12 md:py-16 shadow-xl">
          <div className="absolute inset-0 bg-cover bg-center opacity-10 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200')]"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-xl space-y-4">
              <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent tracking-wide uppercase border border-accent/30">
                Upcoming Congress
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
                14th Annual GRASAG-UPSA General Congress
              </h2>
              <p className="text-sm text-neutral-200">
                Join our research symposium, professional development panels, and networks. Ensure you register and reserve your delegates slot.
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

      {/* Partner Logos */}
      <section className="bg-slate-50 border-y border-neutral-100 py-10">
        <div className="mx-auto max-w-7xl px-4 text-center space-y-6">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Our Corporate & Academic Partners</p>
          <div className="flex flex-wrap justify-center items-center gap-10">
            {partners.map((partner) => (
              <div key={partner.name} className="h-10 w-24 relative opacity-50 hover:opacity-100 transition-opacity duration-300">
                <img src={partner.logo} alt={partner.name} className="object-contain w-full h-full filter grayscale" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Chatbot Indicator */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link
          href="/chat"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-2xl hover:scale-105 hover:bg-accent/90 transition-all duration-200"
        >
          <Bot className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
}
