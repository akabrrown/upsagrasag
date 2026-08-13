"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  ExternalLink, 
  PlusCircle, 
  X, 
  CheckCircle, 
  Copy, 
  Tag, 
  Share2, 
  ArrowRight,
  Filter,
  Ticket,
  Mail,
  User
} from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  full_description?: string;
  event_date: string; // e.g. "2026-07-03T20:00:00"
  time_label: string; // e.g. "8:00 PM"
  location: string;
  price: string; // e.g. "GHS 350" or "Free"
  discount_code?: string;
  discount_info?: string;
  registration_deadline?: string;
  image_url?: string;
  url?: string;
  is_featured?: boolean;
  status: 'Registration open' | 'Limited seats' | 'Sold out' | 'Registration closed' | 'Past Event';
  speaker?: string;
  theme?: string;
}

export default function EventsClient({ initialEvents = [] }: { initialEvents?: any[] }) {
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Ongoing' | 'Past'>('Upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState(6);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal State for Event Detail
  const [selectedEventModal, setSelectedEventModal] = useState<EventItem | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const categories = ['All', 'Event', 'Programme', 'Congress'];

  // Combine DB events if present
  const allEvents = useMemo(() => {
    if (!initialEvents || initialEvents.length === 0) return [];

    const formattedDB: EventItem[] = initialEvents.map(e => ({
      id: e.id,
      title: e.title,
      category: (e as any).type || 'Event',
      summary: e.description ? e.description.slice(0, 140) + '...' : 'Official GRASAG-UPSA graduate event.',
      full_description: e.description,
      event_date: e.event_date || '2026-08-30T10:00:00',
      time_label: new Date(e.event_date || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: e.location || 'UPSA Campus',
      price: (e as any).price || 'Free',
      image_url: e.image_url,
      url: e.url || '#',
      is_featured: e.is_featured,
      status: (new Date(e.event_date).getTime() < Date.now()) ? 'Past Event' : 'Registration open',
      theme: e.theme
    }));

    return formattedDB;
  }, [initialEvents]);

  // Featured Event (only 1 receiving large treatment)
  const featuredEvent = useMemo(() => {
    return allEvents.find(e => e.is_featured && e.status !== 'Past Event') || allEvents[0];
  }, [allEvents]);

  // Filtering events based on Tab, Search, Category, and Month
  const filteredEvents = useMemo(() => {
    return allEvents.filter(e => {
      // Tab filter
      const eventTime = new Date(e.event_date).getTime();
      const isPast = e.status === 'Past Event' || eventTime < Date.now();
      
      if (activeTab === 'Upcoming' && isPast) return false;
      if (activeTab === 'Past' && !isPast) return false;
      if (activeTab === 'Ongoing') return false; // Default empty unless flagged

      // Search query
      const matchesSearch = 
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;

      // Month filter
      let matchesMonth = true;
      if (selectedMonth !== 'All') {
        const monthName = new Date(e.event_date).toLocaleString('default', { month: 'long' });
        matchesMonth = monthName.toLowerCase() === selectedMonth.toLowerCase();
      }

      return matchesSearch && matchesCategory && matchesMonth;
    });
  }, [allEvents, activeTab, searchQuery, selectedCategory, selectedMonth]);

  // Remaining events excluding the featured event if in Upcoming tab
  const gridEvents = useMemo(() => {
    if (activeTab === 'Upcoming' && featuredEvent) {
      return filteredEvents.filter(e => e.id !== featuredEvent.id);
    }
    return filteredEvents;
  }, [filteredEvents, activeTab, featuredEvent]);

  const visibleGridEvents = useMemo(() => {
    return gridEvents.slice(0, visibleCount);
  }, [gridEvents, visibleCount]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleAddToCalendar = (eventItem: EventItem) => {
    const title = encodeURIComponent(eventItem.title);
    const details = encodeURIComponent(eventItem.summary);
    const location = encodeURIComponent(eventItem.location);
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleUrl, '_blank');
  };

  return (
    <div className="w-full bg-background text-foreground pb-20">
      
      {/* 1. Useful Hero Section with reduced vertical padding */}
      <section className="w-full bg-[#001a54] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-left space-y-4">
          <nav className="flex items-center gap-2 text-xs font-semibold text-blue-200/80">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Events & Programmes</span>
          </nav>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Events & Programmes
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 max-w-2xl font-medium leading-relaxed">
              Discover upcoming conferences, workshops, networking sessions and student programmes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => {
                setActiveTab('Upcoming');
                const el = document.getElementById('events-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#B8860B] hover:bg-[#a6790a] text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-xs"
            >
              View Upcoming Events
            </button>
            <button 
              onClick={() => setIsSubmitModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all border border-white/20"
            >
              Submit an Event
            </button>
          </div>
        </div>
      </section>

      {/* Main Events Workspace max-w-6xl */}
      <div id="events-section" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-10">
        
        {/* 2. Navigation Tabs & Search/Filters */}
        <div className="space-y-6 text-left">
          
          {/* Tabs: Upcoming / Ongoing / Past */}
          <div className="flex items-center gap-3 border-b border-neutral-200">
            {(['Upcoming', 'Ongoing', 'Past'] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setVisibleCount(6);
                  }}
                  className={`pb-3 text-sm font-extrabold transition-all border-b-2 cursor-pointer ${
                    isActive
                      ? 'border-[#001a54] text-[#001a54]'
                      : 'border-transparent text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  {tab === 'Upcoming' ? 'Upcoming Events' : tab === 'Ongoing' ? 'Ongoing' : 'Past Events'}
                </button>
              );
            })}
          </div>

          {/* Search bar & Dropdown Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search events by title, venue or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E8E8E8] rounded-2xl pl-11 pr-4 py-3 text-xs text-neutral-800 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-[#001a54] shadow-xs"
              />
            </div>

            {/* Category Select */}
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white border border-[#E8E8E8] rounded-2xl px-3.5 py-3 text-xs font-bold text-neutral-700 outline-none focus:ring-2 focus:ring-[#001a54]"
              >
                <option value="All">Event Type: All</option>
                {categories.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Month Select */}
            <div className="md:col-span-3">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-white border border-[#E8E8E8] rounded-2xl px-3.5 py-3 text-xs font-bold text-neutral-700 outline-none focus:ring-2 focus:ring-[#001a54]"
              >
                <option value="All">Month: All</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. FEATURED EVENT (Only 1 receiving large treatment) */}
        {activeTab === 'Upcoming' && featuredEvent && !searchQuery && selectedCategory === 'All' && (
          <section className="space-y-3 text-left">
            <span className="text-[10px] font-extrabold text-[#B8860B] uppercase tracking-widest block">
              Featured Flagship Programme
            </span>

            <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">
              {/* Image Section */}
              <div className="md:col-span-5 relative w-full h-[240px] sm:h-[280px] rounded-2xl overflow-hidden bg-neutral-100 shrink-0">
                <img 
                  src={featuredEvent.image_url || '/opportunities-hero.png'} 
                  alt={featuredEvent.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-[#B8860B] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {featuredEvent.category}
                </span>
              </div>

              {/* Info Section */}
              <div className="md:col-span-7 space-y-4">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#001a54] leading-tight">
                    {featuredEvent.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                    {featuredEvent.summary}
                  </p>
                </div>

                {/* Date & Location Banner */}
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-neutral-700 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#B8860B]" />
                    <span>Friday, July 3, 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#B8860B]" />
                    <span>{featuredEvent.time_label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#B8860B]" />
                    <span>{featuredEvent.location}</span>
                  </div>
                </div>

                {/* Structured Discount Code Box */}
                {featuredEvent.discount_code && (
                  <div className="bg-[#FAF6EC] border border-[#F5EAD2] p-3.5 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#001a54] block">{featuredEvent.discount_info}</span>
                      <span className="text-[10px] text-neutral-500">Code: <strong className="text-[#001a54]">{featuredEvent.discount_code}</strong></span>
                    </div>
                    <button 
                      onClick={() => handleCopyCode(featuredEvent.discount_code!)}
                      className="bg-white border border-[#F5EAD2] text-[#B8860B] hover:bg-[#B8860B] hover:text-white font-bold px-3 py-1.5 rounded-lg text-[10px] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedCode === featuredEvent.discount_code ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={featuredEvent.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#001a54] hover:bg-[#0b2b73] text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-xs"
                  >
                    Register Now
                  </a>
                  <button
                    onClick={() => setSelectedEventModal(featuredEvent)}
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold px-6 py-3 rounded-xl text-xs transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 5. Compact 3-Column Grid for Remaining Events */}
        <section className="space-y-6 text-left">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#001a54]">
              {activeTab === 'Upcoming' ? 'All Upcoming Events' : activeTab === 'Past' ? 'Past Events Archive' : 'Ongoing Events'}
            </h3>
            <span className="text-xs text-neutral-400 font-medium">{filteredEvents.length} event{filteredEvents.length > 1 ? 's' : ''}</span>
          </div>

          {gridEvents.length === 0 ? (
            <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-neutral-200/70 space-y-2">
              <Calendar className="w-10 h-10 text-neutral-400 mx-auto" />
              <h4 className="font-bold text-neutral-700">No events found</h4>
              <p className="text-xs text-neutral-500">There are no {activeTab.toLowerCase()} events matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {visibleGridEvents.map((item) => {
                const isPast = activeTab === 'Past' || item.status === 'Past Event';

                return (
                  <article
                    key={item.id}
                    onClick={() => setSelectedEventModal(item)}
                    className="group bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-[#001a54]/30 transition-all duration-300 cursor-pointer text-left"
                  >
                    <div>
                      {/* Image Header */}
                      <div className="relative w-full h-44 bg-neutral-100 overflow-hidden">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#001a54] to-[#0b2b73] flex items-center justify-center text-white/50">
                            <Calendar className="w-10 h-10" />
                          </div>
                        )}
                        <span className="absolute top-2 left-2 bg-[#FAF6EC] border border-[#F5EAD2] text-[#B8860B] text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                          {item.category}
                        </span>
                        <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {item.price}
                        </span>
                        {item.theme && (
                           <span className="absolute top-2 right-2 bg-[#001a54] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                             Theme: {item.theme}
                           </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-[#001a54] text-base line-clamp-2 leading-snug group-hover:text-[#B8860B] transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                            {item.summary}
                          </p>
                        </div>

                        <div className="space-y-1.5 text-xs text-neutral-500 font-medium pt-1">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#B8860B]" />
                            <span>{new Date(item.event_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} • {item.time_label}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#B8860B]" />
                            <span className="truncate">{item.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Single Main Action Footer */}
                    <div className="p-5 pt-0">
                      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold">
                        {isPast ? (
                          <span className="text-neutral-400 group-hover:text-[#001a54] transition-colors">View Recap →</span>
                        ) : (
                          <span className="text-[#001a54] group-hover:text-[#B8860B] transition-colors flex items-center gap-1">
                            Register Now <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* 9. Load More Events */}
        {visibleCount < gridEvents.length && (
          <div className="text-center pt-4">
            <button
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="bg-[#001a54] hover:bg-[#0b2b73] text-white font-bold px-8 py-3.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer"
            >
              Load More Events
            </button>
          </div>
        )}

      </div>

      {/* 10. Dedicated Event Detail Modal */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-left">
            <div className="relative w-full h-56 bg-neutral-900 shrink-0">
              <img 
                src={selectedEventModal.image_url || '/opportunities-hero.png'} 
                alt={selectedEventModal.title} 
                className="w-full h-full object-cover" 
              />
              <button
                onClick={() => setSelectedEventModal(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="absolute bottom-4 left-4 bg-[#B8860B] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {selectedEventModal.category}
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6 flex-1">
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                  {selectedEventModal.status}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#001a54]">
                  {selectedEventModal.title}
                </h2>
                {selectedEventModal.theme && (
                  <p className="text-sm font-semibold text-[#B8860B] mt-1">Theme: {selectedEventModal.theme}</p>
                )}
              </div>

              {/* Event Details Grid */}
              <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-100 text-xs font-medium text-neutral-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#B8860B]" />
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 block uppercase">Date & Time</span>
                    <span>{new Date(selectedEventModal.event_date).toLocaleDateString()} • {selectedEventModal.time_label}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#B8860B]" />
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 block uppercase">Location</span>
                    <span>{selectedEventModal.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-[#B8860B]" />
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 block uppercase">Price</span>
                    <span>{selectedEventModal.price}</span>
                  </div>
                </div>
                {selectedEventModal.registration_deadline && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#B8860B]" />
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 block uppercase">Closes</span>
                      <span>{selectedEventModal.registration_deadline}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-bold text-[#001a54] text-base border-b pb-2">About This Programme</h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
                  {selectedEventModal.full_description || selectedEventModal.summary}
                </p>
              </div>

              {/* Actions & Calendar Add */}
              <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => handleAddToCalendar(selectedEventModal)}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#B8860B]" />
                  <span>Add to Google Calendar</span>
                </button>

                {selectedEventModal.url && selectedEventModal.status !== 'Past Event' && (
                  <a
                    href={selectedEventModal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#001a54] hover:bg-[#0b2b73] text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Register Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Event Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-4 text-left relative">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-[#001a54]">Submit an Event Proposal</h3>
            <p className="text-xs text-neutral-500">Propose a student conference, workshop or departmental seminar for inclusion in the GRASAG calendar.</p>
            <form onSubmit={(e) => { e.preventDefault(); setIsSubmitModalOpen(false); alert('Event proposal submitted for executive review!'); }} className="space-y-3">
              <input type="text" placeholder="Event Title" required className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs" />
              <input type="text" placeholder="Organizing Committee / Department" required className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs" />
              <textarea placeholder="Event Brief & Proposed Date" rows={3} required className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs" />
              <button type="submit" className="w-full bg-[#001a54] text-white font-bold py-2.5 rounded-xl text-xs">Submit Proposal</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
