'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bot, Landmark, GraduationCap, Play } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatModal from '@/components/ChatModal';
import PartnerCarousel from '@/components/PartnerCarousel';
import { supabaseClient } from '@/lib/supabaseClient';
import Image from 'next/image';
import { CongressEvent } from '@/types/admin';


export default function HomePage() {
    const [isChatOpen, setIsChatOpen] = useState(false);
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Congress events state (fetched from DB)
  const [events, setEvents] = useState<CongressEvent[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const currentEvent = events[currentEventIndex] || null;

useEffect(() => {
  // If no event or no date, reset timer
  if (!currentEvent?.event_date) {
    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    return;
  }
  // Parse date string as UTC (ISO format)
  const targetDate = new Date(currentEvent.event_date);
  const calculate = () => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    if (diff <= 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    setTimeLeft({ days, hours, minutes, seconds });
  };
  // Initial calculation
  calculate();
  const interval = setInterval(calculate, 1000);
  return () => clearInterval(interval);
}, [currentEvent?.event_date]);

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
        .select('title, description, event_date, image_url, location, is_featured')
        .eq('is_featured', true)
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
    if (!currentEvent?.event_date) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }
    
    // Replace spaces with 'T' to fix Safari/iOS parsing bugs if the DB returns "YYYY-MM-DD HH:mm:ss"
    const safeDateString = currentEvent.event_date.replace(' ', 'T');
    const targetDate = new Date(safeDateString).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const difference = targetDate - now;

      if (difference <= 0 || isNaN(targetDate)) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return true; // indicates it should clear
      }
      
      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      return false;
    };

    const shouldClear = updateTimer();
    if (shouldClear) return;

    const interval = setInterval(() => {
      if (updateTimer()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentEventIndex, events, currentEvent?.event_date]);


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
  const heroTitle = hero.title || 'Inspiring Students To Uncover Their True Potential';
  const heroSubtitle = hero.subtitle || 'Lorem ipsum dolor sit amet consectetur. Vel imperdiet quam nisl vehicula nec blandit orci. Cras laoreet urna in dui nisl et. Vestibulum fermentum.';
  const heroCtaText = hero.ctaText || 'Explore Academics';
  const heroCtaLink = hero.ctaLink || '/opportunities';


  // Define hero slides (reordered: Welcome first, Congratulations second, Inspiring third)
  const slides = [
    {
      title: 'Welcome to the Graduate Student Association of Ghana - UPSA',
      subtitle: 'Join us in fostering graduate research, professional growth, and community impact across Ghana.',
      ctaText: 'Learn More',
      ctaLink: '/about',
      imagePath: '/IMG_1619-scaled-2.jpg',
      bgStyle: { backgroundImage: 'url(/IMG_1619-scaled-2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' },
    },
    {
      title: 'Congratulations to the newly elected GRASAG executives for the 2026/2027 academic year',
      subtitle: 'We welcome our new student leaders and look forward to a successful academic term of representation, excellence, and impact.',
      ctaText: 'Meet the Team',
      ctaLink: '/leadership',
      imagePath: '/group-image.png',
      bgStyle: { backgroundImage: 'url(/group-image.png)', backgroundSize: 'cover', backgroundPosition: 'center' },
    },
    {
      title: heroTitle,
      subtitle: heroSubtitle,
      ctaText: heroCtaText,
      ctaLink: heroCtaLink,
      imagePath: '/grad23-2x.jpg',
      bgStyle: { backgroundImage: 'url(/grad23-2x.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' },
    },
  ];
  const [slideIndex, setSlideIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [slides.length]);
  const currentSlide = slides[slideIndex];

  const bgStyle = currentSlide?.bgStyle || {};
  const sectionClass = `relative overflow-hidden border-b border-neutral-100 flex items-end justify-start min-h-[800px] pb-12 pt-32 px-6 sm:px-12 lg:px-24 ${!bgStyle.backgroundImage ? 'bg-gradient-to-br from-slate-50 via-slate-100/50 to-white' : ''}`;

  return (
    <div className="relative min-h-screen bg-background">
      {/* Hero Section */}
      <section className={sectionClass}>
        {/* Animated Background layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out" 
          style={bgStyle}
        />
        {/* Dark overlay for readability */}
        {bgStyle.backgroundImage && (
          <div className="absolute inset-0 bg-black/60" />
        )}
        
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          {/* Text Content Left Column with modern slide transitions */}
          <div className="lg:col-span-8 text-left h-full flex flex-col justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={slideIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="space-y-4 sm:space-y-5"
              >

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-[1.15] max-w-2xl">
                  {currentSlide.title}
                </h1>
                
                {currentSlide.subtitle && (
                  <p className="text-white/80 text-sm sm:text-base max-w-xl leading-relaxed">
                    {currentSlide.subtitle}
                  </p>
                )}
                
                <div className="pt-2">
                  {currentSlide.ctaText && currentSlide.ctaLink && (
                    <Link href={currentSlide.ctaLink} className="inline-block bg-[#d4af37] hover:bg-[#c39e2e] text-slate-900 font-bold px-6 py-3 rounded-md transition shadow-lg hover:scale-[1.02] transform duration-200">
                      {currentSlide.ctaText}
                    </Link>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Floating Images Right Column (now clickable and reflecting active slide index) */}
          <div className="lg:col-span-4 hidden md:flex items-end justify-end gap-3 pb-2 w-full">
            {slides.map((slide, idx) => (
              <button
                key={idx}
                onClick={() => setSlideIndex(idx)}
                className={`relative w-[110px] h-[75px] rounded-lg overflow-hidden border shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer ${
                  slideIndex === idx 
                    ? 'border-2 border-[#d4af37] scale-105' 
                    : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
              >
                <Image src={slide.imagePath} alt={`Slide ${idx + 1} preview`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>






          {/* Our Focus Areas – Horizontally Scrolling Cards */}
          <section className="bg-neutral-50 border-y border-neutral-100 py-20 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-12">
              <p className="text-sm font-bold text-[#B8860B] uppercase tracking-widest mb-2">Our Agenda</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                Our Focus Areas,<br />
                <span className="text-neutral-500">Championing Graduate Excellence</span>
              </h2>
            </div>

            {/* Scrolling marquee container */}
            <div className="relative w-full overflow-hidden py-4">
              {/* Fade gradient overlays on the sides */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-neutral-50 to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-neutral-50 to-transparent z-10" />

              <div className="animate-marquee flex gap-6">
                {(() => {
                  const cardList = [
                    {
                      title: 'Good Governance, Representation and Accountability',
                      description: 'GRASAG-UPSA promotes transparent, accountable and responsive leadership through effective representation, timely communication, responsible resource management and constitutional governance.',
                      image: '/president-speech.png',
                      icon_name: 'Scale',
                      link: '/about',
                    },
                    {
                      title: 'Student Welfare, Support and Wellbeing',
                      description: 'GRASAG-UPSA prioritises the welfare and wellbeing of graduate students, including mental health, psychosocial support, student-parent support, campus services and emergency support systems.',
                      image: '/dsdsee.jpg',
                      icon_name: 'HeartHandshake',
                      link: '/welfare',
                    },
                    {
                      title: 'Research, Academic Excellence and Innovation',
                      description: 'GRASAG-UPSA supports research, academic excellence and innovation through thesis support, research capacity-building, academic publishing, peer learning and scholarly engagement.',
                      image: '/researchhh.png',
                      icon_name: 'GraduationCap',
                      link: '/research-and-opportunities',
                    },
                    {
                      title: 'Access, Equity, Inclusion and Digital Transformation',
                      description: 'GRASAG-UPSA promotes equal access, inclusion and non-discrimination for all graduate students, regardless of gender, religion, ethnicity, disability, nationality or social background.',
                      image: '/inclusive.png',
                      icon_name: 'Globe',
                      link: '/about',
                    },
                    {
                      title: 'Graduate Community, Identity and Engagement',
                      description: 'GRASAG-UPSA builds a united and active graduate community through student engagement, social interaction, leadership development, recognition programmes, sports, culture and volunteerism.',
                      image: '/communittty.jpg',
                      icon_name: 'Users',
                      link: '/about',
                    },
                    {
                      title: 'Advancement, Employability, Entrepreneurship and Partnerships',
                      description: 'GRASAG-UPSA connects graduate education to career growth, entrepreneurship and national development through employability initiatives, mentorship, alumni engagement and strategic partnerships.',
                      image: '/WhatsApp Image 2026-06-20 at 3.52.26 AM.jpeg',
                      icon_name: 'Briefcase',
                      link: '/opportunities',
                    },
                  ];

                  // Triplicate the cards to guarantee smooth loop even on wide displays
                  const triplicatedCards = [...cardList, ...cardList, ...cardList];

                  return triplicatedCards.map((card, idx) => {
                    const IconComponent = (LucideIcons as any)[card.icon_name] || LucideIcons.HelpCircle;
                    return (
                      <div
                        key={idx}
                        className="flex-shrink-0 flex w-[520px] sm:w-[600px] md:w-[660px] h-[280px] sm:h-[320px] md:h-[350px] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]"
                      >
                        {/* Left Side: Content */}
                        <div className="w-[55%] p-5 sm:p-6 md:p-8 flex flex-col justify-between text-left">
                          <div>
                            {/* Icon Wrapper */}
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FAF6EC] border border-[#F5EAD2] flex items-center justify-center mb-3 sm:mb-4">
                              <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-[#B8860B]" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg sm:text-xl font-extrabold text-neutral-900 leading-snug mb-1.5 sm:mb-2.5 line-clamp-2">
                              {card.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed line-clamp-3">
                              {card.description}
                            </p>
                          </div>
                          <Link
                            href={card.link}
                            className="text-sm sm:text-base font-bold text-[#B8860B] hover:text-primary transition-colors flex items-center gap-1 mt-2 w-fit"
                          >
                            Explore More <span className="text-sm font-normal">→</span>
                          </Link>
                        </div>
                        {/* Right Side: Image */}
                        <div className="w-[45%] relative h-full">
                          <Image
                            src={card.image}
                            alt={card.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 30vw, 20vw"
                          />
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </section>

          {/* Featured Upcoming Events Banner Section */}
          {events.length > 0 && (
            <section className="w-full relative overflow-hidden bg-slate-950 min-h-[480px] flex flex-col justify-end">
              <div className="absolute inset-0">
                {events.map((event, idx) => (
                  <div 
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out bg-contain bg-right bg-no-repeat ${
                      currentEventIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                    style={{ backgroundImage: `url('${event.image_url || '/bkg-grasag.jpg'}')`, backgroundSize: 'auto 100%' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
                  </div>
                ))}
              </div>

              <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-16 sm:py-20 md:py-24 flex flex-col justify-between h-full min-h-[480px] text-left w-full">
                <div>
                  <span className="inline-block rounded-full bg-[#B8860B]/20 px-4 py-1 text-xs sm:text-sm font-semibold text-[#B8860B] uppercase tracking-widest border border-[#B8860B]/30">
                    Featured Event
                  </span>
                </div>
                
                <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="max-w-2xl space-y-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
                      {currentEvent?.title}
                    </h2>
                    {currentEvent?.location && (
                      <h3 className="text-base sm:text-lg font-bold text-[#B8860B]">
                        Location: {currentEvent.location}
                      </h3>
                    )}
                    <p className="text-sm sm:text-base text-white/80 leading-relaxed font-medium">
                      {currentEvent?.description}
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/events"
                        className="inline-block bg-[#B8860B] hover:bg-[#9A7C1C] text-white font-bold px-6 py-3 rounded-lg transition shadow-lg hover:scale-[1.02] transform duration-200 uppercase text-xs tracking-wider"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>

                  {currentEvent?.event_date && (
                    <div className="flex flex-wrap gap-4 items-center justify-start md:justify-end">
                      {[
                        { label: 'Days', value: timeLeft.days },
                        { label: 'Hours', value: timeLeft.hours },
                        { label: 'Min', value: timeLeft.minutes },
                        { label: 'Sec', value: timeLeft.seconds }
                      ].map(item => (
                        <div key={item.label} className="min-w-[65px] rounded-2xl bg-white/10 backdrop-blur-md px-3 py-2.5 border border-white/10 text-center shadow-lg">
                          <div className="text-xl sm:text-2xl font-black text-white">{item.value}</div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {events.length > 1 && (
                  <div className="flex gap-2.5 mt-8 justify-start">
                    {events.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentEventIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          currentEventIndex === idx ? 'w-8 bg-[#B8860B]' : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
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
                          <Image src={ev.image_url} alt={ev.title || "Event Image"} fill className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-50 transition-opacity duration-500 transform" />
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

          {/* Quick Links Section (moved before footer) */}
          <section className="mx-auto max-w-5xl px-4 py-16">
            <h2 className="text-2xl font-bold text-accent mb-6">Quick Links</h2>
            {quickLinks.length > 0 && (
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
            )}
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
