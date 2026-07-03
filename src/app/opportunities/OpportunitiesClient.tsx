"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import type { Opportunity } from '@/types/admin';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  Search, 
  Filter, 
  ArrowRight, 
  ExternalLink, 
  Briefcase, 
  GraduationCap, 
  Globe, 
  Trophy, 
  BookOpen,
  Mail,
  CheckCircle,
  FileText,
  HelpCircle,
  Building,
  Compass,
  Users
} from 'lucide-react';

interface OpportunitiesClientProps {
  initialOpportunities: Opportunity[];
}

const categoriesList = [
  { name: 'All', icon: Compass },
  { name: 'Scholarships', icon: GraduationCap },
  { name: 'Jobs', icon: Briefcase },
  { name: 'Research', icon: BookOpen },
  { name: 'Fellowships', icon: Globe },
  { name: 'Competitions', icon: Trophy }
];

export default function OpportunitiesClient({ initialOpportunities }: OpportunitiesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [activeOpportunity, setActiveOpportunity] = useState<Opportunity | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  // Process opportunities to ensure status & categories match our items
  const processedOpportunities = useMemo(() => {
    return initialOpportunities.map(opp => {
      // Clean category to match titles
      let category = opp.category || 'Jobs';
      if (category.toLowerCase().includes('scholar')) category = 'Scholarships';
      else if (category.toLowerCase().includes('job') || category.toLowerCase().includes('career')) category = 'Jobs';
      else if (category.toLowerCase().includes('research')) category = 'Research';
      else if (category.toLowerCase().includes('fellow')) category = 'Fellowships';
      else if (category.toLowerCase().includes('compet')) category = 'Competitions';

      return {
        ...opp,
        category
      };
    });
  }, [initialOpportunities]);

  // Unique list values for filters
  const locations = useMemo(() => {
    const locSet = new Set<string>();
    processedOpportunities.forEach(opp => {
      if (opp.location) locSet.add(opp.location);
    });
    return ['All', ...Array.from(locSet)];
  }, [processedOpportunities]);

  const types = useMemo(() => {
    const typeSet = new Set<string>();
    processedOpportunities.forEach(opp => {
      if (opp.type) typeSet.add(opp.type);
    });
    return ['All', ...Array.from(typeSet)];
  }, [processedOpportunities]);

  // Filtering opportunities
  const filteredOpportunities = useMemo(() => {
    return processedOpportunities.filter(opp => {
      const matchesSearch = 
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opp.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || opp.category === selectedCategory;
      const matchesType = selectedType === 'All' || opp.type === selectedType;
      const matchesLocation = selectedLocation === 'All' || opp.location === selectedLocation;

      return matchesSearch && matchesCategory && matchesType && matchesLocation;
    });
  }, [processedOpportunities, searchQuery, selectedCategory, selectedType, selectedLocation]);

  // Featured opportunity: Pick first one flagged as featured, or just the first item
  const featuredOpportunity = useMemo(() => {
    if (filteredOpportunities.length === 0) return null;
    return filteredOpportunities[0];
  }, [filteredOpportunities]);

  // Latest Opportunities (excluding featured)
  const latestOpportunities = useMemo(() => {
    if (filteredOpportunities.length <= 1) return [];
    return filteredOpportunities.slice(1);
  }, [filteredOpportunities]);

  // Upcoming deadlines (chronological order of opportunities with deadlines)
  const upcomingDeadlines = useMemo(() => {
    return processedOpportunities
      .filter(opp => (opp as any).deadline)
      .map(opp => {
        const parsedDate = Date.parse((opp as any).deadline);
        return {
          opp,
          date: isNaN(parsedDate) ? new Date() : new Date(parsedDate)
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 4);
  }, [processedOpportunities]);

  // Grouped opportunities by type for sections
  const scholarships = useMemo(() => processedOpportunities.filter(o => o.category === 'Scholarships').slice(0, 3), [processedOpportunities]);
  const jobs = useMemo(() => processedOpportunities.filter(o => o.category === 'Jobs').slice(0, 3), [processedOpportunities]);
  const research = useMemo(() => processedOpportunities.filter(o => o.category === 'Research').slice(0, 3), [processedOpportunities]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  const getDaysLeftLabel = (deadlineStr: string) => {
    const deadlineTime = Date.parse(deadlineStr);
    if (isNaN(deadlineTime)) return `Closes ${deadlineStr}`;
    const diff = deadlineTime - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return "Closed";
    if (days === 0) return "Closes Today";
    if (days === 1) return "Closing Tomorrow";
    if (days <= 7) return `${days} Days Left`;
    return `Closes ${new Date(deadlineTime).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`;
  };

  return (
    <div className="w-full bg-background text-foreground pb-20">
      
      {/* Editorial Header Section */}
      <section className="relative w-full bg-[#FAF6EC] py-20 px-4 sm:px-6 lg:px-8 border-b border-neutral-100 overflow-hidden">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 text-left space-y-6">
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent uppercase tracking-wider">
              Careers & Grants
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#001a54] tracking-tight leading-tight">
              Graduate Opportunities
            </h1>
            <p className="text-base sm:text-lg font-semibold text-neutral-800 tracking-wide uppercase">
              Scholarships • Grants • Careers
            </p>
            <p className="text-sm sm:text-base text-neutral-600 max-w-xl leading-relaxed font-medium">
              Discover scholarships, corporate graduate schemes, research grants, internships, and fellowships curated specifically for University of Professional Studies, Accra postgraduate students.
            </p>
            <div>
              <button 
                onClick={() => handleScrollToSection('opportunities-section')}
                className="bg-[#001a54] hover:bg-[#0b2b73] text-white font-bold px-8 py-3.5 rounded-full text-sm transition-all duration-300 shadow-sm"
              >
                Browse Opportunities
              </button>
            </div>
          </div>
          <div className="md:col-span-5 relative w-full h-[280px] sm:h-[350px] flex items-center justify-center">
            <Image 
              src="/opportunities-hero.png" 
              alt="Opportunities Illustration" 
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Category Icons Quick Selector Bar */}
      <section className="max-w-5xl mx-auto px-4 pt-12">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {categoriesList.map((cat, idx) => {
            const CatIcon = cat.icon;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  handleScrollToSection('opportunities-section');
                }}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all duration-300 ${
                  isSelected 
                    ? 'bg-[#001a54] border-[#001a54] text-white shadow-md' 
                    : 'bg-white border-neutral-100 text-neutral-600 hover:border-neutral-200 hover:shadow-sm'
                }`}
              >
                <CatIcon className={`w-7 h-7 mb-2 ${isSelected ? 'text-[#B8860B]' : 'text-neutral-400'}`} strokeWidth={1.5} />
                <span className="text-xs font-bold tracking-wide">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Filter and Content Controls Section */}
      <section id="opportunities-section" className="max-w-5xl mx-auto px-4 pt-16 space-y-8">
        
        {/* Editorial Title */}
        <div className="text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#001a54] tracking-tight">
            Curated Directory
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-1">
            Filter by category, funding type, or location to find fellowships aligned to your academic progress.
          </p>
        </div>

        {/* Filter bar */}
        <div className="bg-white border border-neutral-100 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by title, organization or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-700 outline-none focus:ring-2 focus:ring-[#001a54] transition-all"
            />
          </div>

          {/* Filters Selects */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs font-bold text-neutral-600 outline-none focus:ring-2 focus:ring-[#001a54]"
            >
              <option value="All">Category: All</option>
              {categoriesList.filter(c => c.name !== 'All').map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs font-bold text-neutral-600 outline-none focus:ring-2 focus:ring-[#001a54]"
            >
              <option value="All">Type: All</option>
              {types.filter(t => t !== 'All').map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="appearance-none bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs font-bold text-neutral-600 outline-none focus:ring-2 focus:ring-[#001a54] col-span-2 sm:col-span-1"
            >
              <option value="All">Location: All</option>
              {locations.filter(l => l !== 'All').map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Empty state */}
        {filteredOpportunities.length === 0 && (
          <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-3">
            <HelpCircle className="w-12 h-12 text-neutral-400 mx-auto" />
            <h3 className="text-lg font-bold text-neutral-800">No opportunities match your search</h3>
            <p className="text-sm text-neutral-500 max-w-sm mx-auto">
              Try adjusting your query or reset the category filters to browse all active listings.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedType('All'); setSelectedLocation('All'); }}
              className="text-[#B8860B] font-bold text-sm hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* FEATURED OPPORTUNITY */}
        {featuredOpportunity && (
          <div className="space-y-4">
            <p className="text-xs font-bold text-[#B8860B] uppercase tracking-widest text-left">Featured Opportunity</p>
            <div className="bg-[#001a54] text-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-stretch min-h-[350px]">
              
              {/* Left Column: Image/Banner */}
              <div className="w-full md:w-[45%] relative min-h-[220px] md:min-h-0 bg-[#0b2b73] flex items-center justify-center p-8">
                {featuredOpportunity.image_url ? (
                  <Image 
                    src={featuredOpportunity.image_url} 
                    alt={featuredOpportunity.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-center gap-4 opacity-80">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-[#B8860B]">
                      <GraduationCap className="w-8 h-8" />
                    </div>
                    <span className="text-lg font-bold tracking-wide uppercase">{featuredOpportunity.company}</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 z-20">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#B8860B] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                    {featuredOpportunity.category}
                  </span>
                </div>
              </div>

              {/* Right Column: Copy & Details */}
              <div className="w-full md:w-[55%] p-8 sm:p-10 flex flex-col justify-between text-left space-y-6">
                <div className="space-y-4">
                  <span className="text-xs text-blue-200/80 font-bold block uppercase tracking-wider">{featuredOpportunity.company}</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    {featuredOpportunity.title}
                  </h3>
                  
                  {/* Metadata Row */}
                  <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs sm:text-sm text-blue-100/90 font-medium">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-[#B8860B]" /> {featuredOpportunity.location || 'Accra'}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-[#B8860B]" /> {featuredOpportunity.type || 'Fully Funded'}</span>
                    {(featuredOpportunity as any).deadline && (
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-[#B8860B]" /> {getDaysLeftLabel((featuredOpportunity as any).deadline)}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <button 
                    onClick={() => setActiveOpportunity(featuredOpportunity)}
                    className="bg-[#B8860B] hover:bg-[#a6790a] text-white font-bold px-8 py-3 rounded-full text-xs transition-colors shadow-sm"
                  >
                    View Details
                  </button>
                  {featuredOpportunity.apply_url && (
                    <a 
                      href={featuredOpportunity.apply_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1 text-xs font-bold text-white hover:underline"
                    >
                      Apply Now <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LATEST OPPORTUNITIES */}
        {latestOpportunities.length > 0 && (
          <div className="space-y-6 pt-6">
            <h3 className="text-xl font-bold text-[#001a54] text-left">Latest Openings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestOpportunities.map((opp) => (
                <article 
                  key={opp.id} 
                  className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 text-left flex flex-col justify-between h-[360px]"
                >
                  <div className="p-6 space-y-4">
                    {/* Header: Organization & Badge */}
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest truncate">{opp.company}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF6EC] border border-[#F5EAD2] px-2.5 py-0.5 text-[9px] font-bold text-[#B8860B] uppercase tracking-wider">
                        {opp.category}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-[#001a54] text-lg line-clamp-2 leading-snug group-hover:underline">
                      {opp.title}
                    </h4>

                    {/* Metadata elements */}
                    <div className="space-y-2 text-xs text-neutral-500 font-medium">
                      <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-neutral-400" /> {opp.location || 'Accra'}</div>
                      <div className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-neutral-400" /> {opp.type || 'Fully Funded'}</div>
                      {(opp as any).deadline && (
                        <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-neutral-400" /> {getDaysLeftLabel((opp as any).deadline)}</div>
                      )}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="p-6 pt-0 flex justify-between items-center border-t border-neutral-50">
                    <button 
                      onClick={() => setActiveOpportunity(opp)}
                      className="text-xs font-bold text-[#001a54] hover:text-[#B8860B] transition-colors"
                    >
                      Read Details
                    </button>
                    {opp.apply_url && (
                      <a 
                        href={opp.apply_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-0.5 text-xs font-bold text-[#B8860B] hover:underline"
                      >
                        Apply <ArrowRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Grouped sections by opportunity types */}
      <section className="max-w-5xl mx-auto px-4 pt-24 space-y-16">
        
        {/* Latest Scholarships Section */}
        {scholarships.length > 0 && (
          <div className="space-y-6 text-left">
            <h3 className="text-2xl font-bold text-[#001a54] tracking-tight">Latest Scholarships</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {scholarships.map((opp) => (
                <div key={opp.id} className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[240px]">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">{opp.company}</span>
                    <h4 className="font-bold text-[#001a54] text-base line-clamp-2">{opp.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-neutral-500 font-medium">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-neutral-400" /> {opp.location || 'Accra'}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-neutral-400" /> {opp.type || 'Fully Funded'}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveOpportunity(opp)}
                    className="w-full bg-[#FAF6EC] hover:bg-[#F5EAD2] text-[#B8860B] font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Latest Jobs Section */}
        {jobs.length > 0 && (
          <div className="space-y-6 text-left">
            <h3 className="text-2xl font-bold text-[#001a54] tracking-tight">Latest Jobs & Careers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {jobs.map((opp) => (
                <div key={opp.id} className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[240px]">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">{opp.company}</span>
                    <h4 className="font-bold text-[#001a54] text-base line-clamp-2">{opp.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-neutral-500 font-medium">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-neutral-400" /> {opp.location || 'Accra'}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-neutral-400" /> {opp.type || 'Full-time'}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveOpportunity(opp)}
                    className="w-full bg-[#001a54]/5 hover:bg-[#001a54]/10 text-[#001a54] font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Research Opportunities Section */}
        {research.length > 0 && (
          <div className="space-y-6 text-left">
            <h3 className="text-2xl font-bold text-[#001a54] tracking-tight">Research Opportunities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {research.map((opp) => (
                <div key={opp.id} className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[240px]">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">{opp.company}</span>
                    <h4 className="font-bold text-[#001a54] text-base line-clamp-2">{opp.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-neutral-500 font-medium">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-neutral-400" /> {opp.location || 'Accra'}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-neutral-400" /> {opp.type || 'Research Grant'}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveOpportunity(opp)}
                    className="w-full bg-[#eefcf5] hover:bg-[#d2f5e3] text-emerald-700 font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Section 8: Upcoming Deadlines Timeline */}
      {upcomingDeadlines.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 pt-24 space-y-8 text-left">
          <div>
            <h3 className="text-2xl font-bold text-[#001a54] tracking-tight">Upcoming Deadlines</h3>
            <p className="text-xs text-neutral-500 font-medium">Ensure your applications are completed before these upcoming close dates.</p>
          </div>

          <div className="relative border-l border-neutral-200 pl-6 ml-4 space-y-8">
            {upcomingDeadlines.map(({ opp, date }, index) => (
              <div key={index} className="relative group">
                {/* Timeline node */}
                <div className="absolute left-[-33px] top-1 w-4.5 h-4.5 rounded-full bg-white border-2 border-[#B8860B] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B8860B]" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{opp.company}</span>
                    <h4 
                      onClick={() => setActiveOpportunity(opp)}
                      className="font-bold text-[#001a54] text-sm sm:text-base hover:underline cursor-pointer"
                    >
                      {opp.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5" />
                      {getDaysLeftLabel((opp as any).deadline)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 9: Career Resources Section */}
      <section className="max-w-5xl mx-auto px-4 pt-24 space-y-8 text-left">
        <div>
          <h3 className="text-2xl font-bold text-[#001a54] tracking-tight">Career Resources</h3>
          <p className="text-xs text-neutral-500 font-medium">Essential toolkits to empower your graduate applications.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between items-start gap-4">
            <div className="p-3 bg-[#001a54]/5 rounded-xl text-[#001a54]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-[#001a54] block mb-1 text-sm sm:text-base">CV Templates</span>
              <p className="text-xs text-neutral-500 leading-relaxed">Download professionally designed CV templates approved for graduate applications.</p>
            </div>
            <a href="#" className="text-xs font-bold text-[#B8860B] hover:underline flex items-center gap-1">Download PDF <ExternalLink className="w-3 h-3" /></a>
          </div>

          <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between items-start gap-4">
            <div className="p-3 bg-[#001a54]/5 rounded-xl text-[#001a54]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-[#001a54] block mb-1 text-sm sm:text-base">Research Proposal Guide</span>
              <p className="text-xs text-neutral-500 leading-relaxed">A comprehensive checklist and methodology guide for thesis and grant proposals.</p>
            </div>
            <a href="#" className="text-xs font-bold text-[#B8860B] hover:underline flex items-center gap-1">Download PDF <ExternalLink className="w-3 h-3" /></a>
          </div>

          <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between items-start gap-4">
            <div className="p-3 bg-[#001a54]/5 rounded-xl text-[#001a54]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-[#001a54] block mb-1 text-sm sm:text-base">Interview Tips</span>
              <p className="text-xs text-neutral-500 leading-relaxed">Master graduate entry interviews with standard question reviews and tips.</p>
            </div>
            <a href="#" className="text-xs font-bold text-[#B8860B] hover:underline flex items-center gap-1">Read Article <ExternalLink className="w-3 h-3" /></a>
          </div>
        </div>
      </section>

      {/* Section 10: Premium Newsletter Subscription CTA */}
      <section className="max-w-5xl mx-auto px-4 pt-24">
        <div className="bg-[#000830] text-white p-8 sm:p-12 rounded-3xl text-center space-y-6 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Never Miss An Opportunity</h3>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-md mx-auto">
              Subscribe to receive weekly newsletters containing the latest Scholarships, Conferences, Grants, and Jobs.
            </p>
          </div>

          {subscribed ? (
            <div className="max-w-md mx-auto bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-2 relative z-10 animate-fade-in">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
              <span className="font-bold text-sm">Successfully Subscribed!</span>
              <p className="text-xs text-neutral-400">You will now receive opportunities straight to your inbox.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-neutral-500" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:ring-2 focus:ring-[#B8860B]"
                />
              </div>
              <button 
                type="submit"
                className="bg-[#B8860B] hover:bg-[#a6790a] text-white font-bold px-8 py-3 rounded-xl text-sm transition-colors shadow-sm"
              >
                Subscribe
              </button>
            </form>
          )}

          {/* Decorative backdrop elements */}
          <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-white/5 blur-xl pointer-events-none" />
          <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 rounded-full bg-[#B8860B]/10 blur-xl pointer-events-none" />
        </div>
      </section>

      {/* DETAIL MODAL PANEL (Slide-over details card) */}
      {activeOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-fade-in p-4 sm:p-6">
          <div className="bg-white rounded-3xl w-full max-w-2xl h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-slide-in text-left">
            {/* Modal Header */}
            <div className="bg-[#FAF6EC] p-6 border-b border-[#F5EAD2] flex justify-between items-start gap-4">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#001a54]/5 px-2.5 py-0.5 text-[10px] font-bold text-[#001a54] uppercase tracking-wider">
                  {activeOpportunity.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#001a54] leading-tight">
                  {activeOpportunity.title}
                </h3>
                <span className="text-sm font-semibold text-neutral-500 flex items-center gap-1">
                  <Building className="w-4 h-4 text-[#B8860B]" /> {activeOpportunity.company}
                </span>
              </div>
              <button 
                onClick={() => setActiveOpportunity(null)}
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-neutral-600 font-bold border border-neutral-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">
              
              {/* Metadata panel */}
              <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-5 rounded-2xl border border-neutral-100 text-xs sm:text-sm font-medium text-neutral-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4.5 h-4.5 text-[#B8860B]" />
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 block uppercase tracking-wider">Location</span>
                    <span>{activeOpportunity.location || 'Accra'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4.5 h-4.5 text-[#B8860B]" />
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 block uppercase tracking-wider">Funding / Type</span>
                    <span>{activeOpportunity.type || 'Fully Funded'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4.5 h-4.5 text-[#B8860B]" />
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 block uppercase tracking-wider">Duration</span>
                    <span>1 Week / 3 Months</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4.5 h-4.5 text-[#B8860B]" />
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 block uppercase tracking-wider">Deadline</span>
                    <span>{(activeOpportunity as any).deadline ? new Date((activeOpportunity as any).deadline).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h4 className="font-bold text-neutral-900 border-b pb-2">Description & Scope</h4>
                <div 
                  className="text-sm text-neutral-600 leading-relaxed space-y-2 rich-text" 
                  dangerouslySetInnerHTML={{ __html: activeOpportunity.description || 'No description provided.' }}
                />
              </div>

              {/* Requirements */}
              <div className="space-y-3">
                <h4 className="font-bold text-neutral-900 border-b pb-2">Key Requirements</h4>
                <ul className="list-disc list-inside text-sm text-neutral-600 space-y-2.5">
                  <li>Applicants must be currently registered postgraduate students of UPSA.</li>
                  <li>Demonstrate a strong academic record or relevant sector-specific professional skills.</li>
                  <li>Prepare CV templates and references ahead of applying.</li>
                </ul>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="p-6 border-t border-neutral-100 flex justify-end items-center gap-3 bg-neutral-50/50">
              <button 
                onClick={() => setActiveOpportunity(null)}
                className="px-5 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-500 hover:bg-neutral-100 transition-colors"
              >
                Close
              </button>
              {activeOpportunity.apply_url && (
                <a 
                  href={activeOpportunity.apply_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-[#001a54] hover:bg-[#0b2b73] text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5"
                >
                  Apply Now <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function handleScrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
