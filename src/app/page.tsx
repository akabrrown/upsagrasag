'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bot
} from 'lucide-react';

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set target date for Annual Congress (e.g., Nov 15, 2026)
    const targetDate = new Date('Nov 15, 2026 09:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
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

  const partners = [
    { name: 'KPMG',    logo: 'https://cdn.simpleicons.org/kpmg/000?size=256' },
    { name: 'PwC',     logo: 'https://cdn.simpleicons.org/pwc/000?size=256' },
    { name: 'Deloitte',logo: 'https://cdn.simpleicons.org/deloitte/000?size=256' },
    { name: 'ICAG',    logo: 'https://cdn.simpleicons.org/icag/000?size=256' },
    { name: 'ACCA',    logo: 'https://cdn.simpleicons.org/acca/000?size=256' },
  ];

  return (
    <div className="relative min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 px-4 py-20 lg:px-8 border-b border-neutral-100">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
        <div className="mx-auto max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary leading-tight">
              Welcome to the Graduate Student Association of Ghana - <span className="text-accent">University of Professional Studies Accra (UPSA) Chapter</span>
            </h1>
            <p className="text-lg text-neutral-600 max-w-xl leading-relaxed">
              The Graduate Student Association of Ghana (GRASAG), University of Professional Studies Chapter, warmly welcomes all graduate students, stakeholders, and partners to our vibrant academic community.
            </p>
            <p className="text-lg text-neutral-600 max-w-xl leading-relaxed">
              As a body representing graduate students, we are committed to promoting academic excellence, professional development, leadership, research, innovation, and student welfare. We serve as a platform that unites graduate students, amplifies their voices, and creates opportunities for personal and collective growth.
            </p>
            <p className="text-lg text-neutral-600 max-w-xl leading-relaxed">
              Through seminars, conferences, mentorship programs, research initiatives, community engagements, and professional networking events, we strive to equip our members with the skills and exposure needed to excel both academically and professionally.
            </p>
            <p className="text-lg text-neutral-600 max-w-xl leading-relaxed">
              We also recognize the importance of collaboration in achieving impactful results. Therefore, we warmly invite organizations, institutions, corporate bodies, alumni, and individuals who share our vision to partner with us in creating meaningful opportunities and lasting impact for graduate students.
            </p>
            <p className="text-lg text-neutral-600 max-w-xl leading-relaxed">
              Together, we can build a stronger academic and professional community that nurtures future leaders and contributes positively to society.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/opportunities"
                className="btn-accent text-sm"
              >
                Explore Opportunities <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Welcome Card Column */}
          <div className="lg:col-span-5">
            <div className="site-card-light bg-white p-8">
              <div className="relative h-48 w-48 overflow-hidden rounded-full bg-neutral-100 shadow-inner mx-auto border-4 border-slate-50">
                <img src="/grasag-upsa-logo.png" alt="GRASAG UPSA Logo" className="object-contain w-full h-full p-4" />
              </div>
              <div className="mt-6 space-y-4 text-center">
                <blockquote className="italic text-sm text-neutral-600">
                  "Graduate study is a journey of transformation. At GRASAG-UPSA, our commitment is to provide a support ecosystem that empowers you with research backing, professional excellence, and general welfare."
                </blockquote>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">Kofi Adu-Gyamfi</h3>
                  <p className="text-xs font-semibold text-accent uppercase tracking-wide">President, GRASAG-UPSA</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Countdown & Events banner */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
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
