"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Opportunity } from '@/types/admin';
import {
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Search,
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
  Users,
  Flag,
  Share2,
  Copy,
  PlusCircle,
  X,
  AlertCircle,
  Info,
  Star,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Newspaper
} from 'lucide-react';

interface OpportunitiesClientProps {
  initialOpportunities: Opportunity[];
}

// Updated categories list matching the user's specification
const categoriesList = [
  { name: 'All', icon: BookOpen, color: 'text-[#001a54]' },
  { name: 'Jobs & Internships', icon: Briefcase, color: 'text-blue-600' },
  { name: 'Scholarships', icon: GraduationCap, color: 'text-emerald-600' },
  { name: 'Research Grants', icon: Star, color: 'text-purple-600' },
  { name: 'Fellowships', icon: Globe, color: 'text-amber-600' },
  { name: 'Calls for Papers', icon: Newspaper, color: 'text-red-600' },
  { name: 'Conferences', icon: Users, color: 'text-cyan-600' },
  { name: 'Publication Opportunities', icon: FileText, color: 'text-pink-600' },
];

// Status badge colours
const statusColors: Record<string, string> = {
  'Open': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Closing Soon': 'bg-amber-50 text-amber-700 border-amber-200',
  'Limited Seats': 'bg-orange-50 text-orange-700 border-orange-200',
  'Sold Out': 'bg-red-50 text-red-700 border-red-200',
  'Application Closed': 'bg-neutral-100 text-neutral-500 border-neutral-200',
};

// Category normalizer for DB items
function normalizeCategory(raw: string): string {
  const s = (raw || '').toLowerCase();
  if (s.includes('scholar')) return 'Scholarships';
  if (s.includes('job') || s.includes('career') || s.includes('intern')) return 'Jobs & Internships';
  if (s.includes('grant') || s.includes('research')) return 'Research Grants';
  if (s.includes('fellow')) return 'Fellowships';
  if (s.includes('call') || s.includes('paper')) return 'Calls for Papers';
  if (s.includes('conf')) return 'Conferences';
  if (s.includes('publ')) return 'Publication Opportunities';
  return 'Jobs & Internships';
}

export default function OpportunitiesClient({ initialOpportunities }: OpportunitiesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDeadline, setSelectedDeadline] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [sortBy, setSortBy] = useState('closing-soon');
  const [statusTab, setStatusTab] = useState<'Open' | 'Closing Soon' | 'Archived'>('Open');
  const [activeOpportunity, setActiveOpportunity] = useState<Opportunity | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  // Process DB opportunities
  const processedOpportunities = useMemo(() => {
    return initialOpportunities.map(opp => ({
      ...opp,
      category: normalizeCategory(opp.category || ''),
    }));
  }, [initialOpportunities]);

  // Unique locations
  const locations = useMemo(() => {
    const locSet = new Set<string>();
    processedOpportunities.forEach(o => { if (o.location) locSet.add(o.location); });
    return ['All', ...Array.from(locSet)];
  }, [processedOpportunities]);

  const getDaysLeft = (deadlineStr: string): number | null => {
    const t = Date.parse(deadlineStr);
    if (isNaN(t)) return null;
    return Math.ceil((t - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const getDaysLeftLabel = (deadlineStr?: string): string => {
    if (!deadlineStr) return 'Deadline not provided';
    const days = getDaysLeft(deadlineStr);
    if (days === null) return `Closes ${deadlineStr}`;
    if (days < 0) return 'Application closed';
    if (days === 0) return 'Closes today';
    if (days === 1) return 'Closing tomorrow';
    if (days <= 7) return `${days} days left`;
    return `Apply by ${new Date(Date.parse(deadlineStr)).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}`;
  };

  const getOppStatus = (opp: Opportunity): string => {
    const d = (opp as any).deadline;
    if (!d) return 'Open';
    const days = getDaysLeft(d);
    if (days === null) return 'Open';
    if (days < 0) return 'Application Closed';
    if (days <= 7) return 'Closing Soon';
    return 'Open';
  };

  const isArchived = (opp: Opportunity): boolean => {
    const d = (opp as any).deadline;
    if (!d) return false;
    const days = getDaysLeft(d);
    return days !== null && days < 0;
  };

  // Tab filter
  const tabFiltered = useMemo(() => {
    return processedOpportunities.filter(o => {
      if (statusTab === 'Open') return !isArchived(o) && getOppStatus(o) !== 'Closing Soon' || getOppStatus(o) === 'Open';
      if (statusTab === 'Closing Soon') return getOppStatus(o) === 'Closing Soon';
      if (statusTab === 'Archived') return isArchived(o);
      return true;
    });
  }, [processedOpportunities, statusTab]);

  // Full filtering
  const filteredOpportunities = useMemo(() => {
    let result = tabFiltered.filter(opp => {
      const matchesSearch =
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opp.description || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || opp.category === selectedCategory;
      const matchesLocation = selectedLocation === 'All' || opp.location === selectedLocation;

      let matchesDeadline = true;
      if (selectedDeadline === 'This week') {
        const d = getDaysLeft((opp as any).deadline || '');
        matchesDeadline = d !== null && d >= 0 && d <= 7;
      } else if (selectedDeadline === 'This month') {
        const d = getDaysLeft((opp as any).deadline || '');
        matchesDeadline = d !== null && d >= 0 && d <= 30;
      }

      return matchesSearch && matchesCategory && matchesLocation && matchesDeadline;
    });

    // Sort
    if (sortBy === 'closing-soon') {
      result = result.sort((a, b) => {
        const da = (a as any).deadline ? Date.parse((a as any).deadline) : Infinity;
        const db = (b as any).deadline ? Date.parse((b as any).deadline) : Infinity;
        return da - db;
      });
    } else if (sortBy === 'newest') {
      result = result.sort((a, b) => {
        const da = (a as any).created_at ? Date.parse((a as any).created_at) : 0;
        const db = (b as any).created_at ? Date.parse((b as any).created_at) : 0;
        return db - da;
      });
    }

    return result;
  }, [tabFiltered, searchQuery, selectedCategory, selectedLocation, selectedDeadline, sortBy]);

  const featuredOpportunity = useMemo(() => {
    const featured = filteredOpportunities.find((o: any) => o.is_featured && !isArchived(o));
    return featured || (filteredOpportunities.length > 0 && !isArchived(filteredOpportunities[0]) ? filteredOpportunities[0] : null);
  }, [filteredOpportunities]);

  const gridOpportunities = useMemo(() => {
    if (statusTab !== 'Open' || !featuredOpportunity) return filteredOpportunities;
    return filteredOpportunities.filter(o => o.id !== featuredOpportunity.id);
  }, [filteredOpportunities, featuredOpportunity, statusTab]);

  const visibleGrid = useMemo(() => gridOpportunities.slice(0, visibleCount), [gridOpportunities, visibleCount]);

  const handleSave = (id: string) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleCopyLink = (opp: Opportunity) => {
    const url = `${window.location.origin}/opportunities/${opp.id}`;
    navigator.clipboard.writeText(url);
    setCopiedShareId(opp.id || null);
    setTimeout(() => setCopiedShareId(null), 2500);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="w-full bg-background text-foreground pb-20">

      {/* ───── 1. HERO ───── */}
      <section
        className="relative w-full py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/opportunity-img.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#001a54] via-[#001a54]/88 to-transparent z-0" />
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-blue-200/70 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Research & Opportunities</span>
          </nav>

          <div className="max-w-2xl text-left space-y-5">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Research & Opportunities
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-medium max-w-xl">
              Discover scholarships, research grants, jobs, fellowships and academic opportunities selected for graduate students.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => {
                  const el = document.getElementById('opp-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#B8860B] hover:bg-[#a6790a] text-white font-bold px-7 py-3 rounded-full text-xs transition-all shadow-sm"
              >
                Browse Opportunities
              </button>
              <button
                onClick={() => setIsSubmitOpen(true)}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-3 rounded-full text-xs transition-all"
              >
                Submit an Opportunity
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ───── MAIN CONTENT ───── */}
      <div id="opp-section" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">

        {/* ───── 2. STATUS TABS ───── */}
        <div className="flex items-center gap-1 border-b border-neutral-200">
          {(['Open', 'Closing Soon', 'Archived'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setStatusTab(tab); setVisibleCount(6); }}
              className={`pb-3 px-4 text-xs font-extrabold transition-all border-b-2 cursor-pointer ${
                statusTab === tab
                  ? 'border-[#001a54] text-[#001a54]'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              {tab === 'Open' ? 'Open Opportunities' : tab === 'Closing Soon' ? 'Closing Soon' : 'Archived'}
            </button>
          ))}
        </div>

        {/* ───── 3. SEARCH & FILTERS ───── */}
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search opportunities by title, organisation or keyword…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-neutral-800 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-[#001a54] shadow-xs"
            />
          </div>

          {/* Category filter chips */}
          <div className="flex flex-wrap gap-2">
            {categoriesList.map(cat => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#001a54] text-white border-[#001a54]'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B8860B]' : cat.color}`} strokeWidth={2} />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Dropdowns: Deadline, Location, Sort */}
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedDeadline}
              onChange={e => setSelectedDeadline(e.target.value)}
              className="bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-neutral-700 outline-none focus:ring-2 focus:ring-[#001a54]"
            >
              <option value="All">Deadline: Any time</option>
              <option value="This week">This week</option>
              <option value="This month">This month</option>
            </select>
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-neutral-700 outline-none focus:ring-2 focus:ring-[#001a54]"
            >
              <option value="All">Location: Any</option>
              {locations.filter(l => l !== 'All').map(l => <option key={l}>{l}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-neutral-700 outline-none focus:ring-2 focus:ring-[#001a54]"
            >
              <option value="closing-soon">Sort: Closing soon</option>
              <option value="newest">Sort: Newest first</option>
            </select>
          </div>
        </div>

        {/* ───── 4. EMPTY STATE ───── */}
        {filteredOpportunities.length === 0 && (
          <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
            <HelpCircle className="w-12 h-12 text-neutral-300 mx-auto" />
            <h3 className="text-base font-bold text-neutral-700">No opportunities match your search</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Try adjusting your filters or keywords.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedDeadline('All'); setSelectedLocation('All'); }}
              className="text-[#B8860B] font-bold text-xs hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* ───── 5. FEATURED OPPORTUNITY ───── */}
        {statusTab === 'Open' && featuredOpportunity && !searchQuery && selectedCategory === 'All' && (
          <section className="space-y-3">
            <p className="text-[10px] font-extrabold text-[#B8860B] uppercase tracking-widest">Featured Opportunity</p>
            <div className="bg-[#001a54] text-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row min-h-[300px]">
              {/* Left: Org logo / image */}
              <div className="w-full md:w-[38%] relative min-h-[200px] bg-[#0b2b73] flex items-center justify-center p-10">
                {featuredOpportunity.image_url ? (
                  <Image src={featuredOpportunity.image_url} alt={featuredOpportunity.title} fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-center gap-3 opacity-80">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-[#B8860B]">
                      <GraduationCap className="w-8 h-8" />
                    </div>
                    <span className="text-base font-bold tracking-wide uppercase">{featuredOpportunity.company}</span>
                  </div>
                )}
                <span className="absolute top-4 left-4 bg-[#B8860B] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {featuredOpportunity.category}
                </span>
                <span className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {getOppStatus(featuredOpportunity)}
                </span>
              </div>

              {/* Right: Details */}
              <div className="w-full md:w-[62%] p-8 sm:p-10 flex flex-col justify-between text-left space-y-5">
                <div className="space-y-3">
                  <span className="text-xs text-blue-200/80 font-bold block uppercase tracking-wider">{featuredOpportunity.company}</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    {featuredOpportunity.title}
                  </h3>
                  <p className="text-xs text-blue-100/80 leading-relaxed line-clamp-2">
                    {featuredOpportunity.description?.replace(/<[^>]*>/g, '').slice(0, 180) || 'No description provided.'}
                  </p>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-blue-100/90 font-medium pt-2">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#B8860B]" />{featuredOpportunity.location || 'Accra'}</span>
                    <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-[#B8860B]" />Graduate students</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#B8860B]" />{getDaysLeftLabel((featuredOpportunity as any).deadline)}</span>
                    <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-[#B8860B]" />{featuredOpportunity.type || 'See details'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setActiveOpportunity(featuredOpportunity)}
                    className="bg-[#B8860B] hover:bg-[#a6790a] text-white font-bold px-6 py-2.5 rounded-full text-xs transition-colors cursor-pointer"
                  >
                    View details →
                  </button>
                  {featuredOpportunity.apply_url && (
                    <a
                      href={featuredOpportunity.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-white/80 hover:text-white"
                    >
                      Apply now <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ───── 6. COMPACT 3-COLUMN GRID ───── */}
        {filteredOpportunities.length > 0 && (
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#001a54]">
                {statusTab === 'Open' ? 'All Open Opportunities' : statusTab === 'Closing Soon' ? 'Closing Soon' : 'Archived Opportunities'}
              </h2>
              <span className="text-xs text-neutral-400 font-semibold">
                {filteredOpportunities.length} listing{filteredOpportunities.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
              {visibleGrid.map(opp => {
                const archived = isArchived(opp);
                const oppStatus = getOppStatus(opp);
                const isSaved = opp.id ? savedIds.includes(opp.id) : false;
                const deadline = (opp as any).deadline;
                const daysLeft = deadline ? getDaysLeft(deadline) : null;
                const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 5;

                return (
                  <article
                    key={opp.id}
                    onClick={() => setActiveOpportunity(opp)}
                    className="group bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden flex flex-col shadow-xs hover:shadow-xl hover:border-[#001a54]/25 transition-all duration-300 cursor-pointer text-left"
                  >
                    {/* Top coloured stripe by category */}
                    <div className="px-5 pt-5 pb-4 flex-1 space-y-3">
                      {/* Top row: category + status + save */}
                      <div className="flex items-start justify-between gap-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF6EC] border border-[#F5EAD2] px-2 py-0.5 text-[10px] font-extrabold text-[#B8860B] uppercase tracking-wider">
                          {opp.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wider ${
                            archived
                              ? statusColors['Application Closed']
                              : isUrgent
                                ? statusColors['Closing Soon']
                                : statusColors['Open']
                          }`}>
                            {archived ? 'Closed' : isUrgent ? 'Urgent' : 'Open'}
                          </span>
                          <button
                            onClick={e => { e.stopPropagation(); handleSave(opp.id); }}
                            className="text-neutral-300 hover:text-[#B8860B] transition-colors cursor-pointer"
                            title={isSaved ? 'Remove bookmark' : 'Save opportunity'}
                          >
                            {isSaved ? <BookmarkCheck className="w-4 h-4 text-[#B8860B]" /> : <Bookmark className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Organisation */}
                      <p className="text-xs font-bold text-neutral-500 flex items-center gap-1">
                        <Building className="w-3 h-3 text-neutral-400 shrink-0" />
                        {opp.company}
                      </p>

                      {/* Title */}
                      <h4 className="font-extrabold text-[#001a54] text-base leading-snug line-clamp-2 group-hover:text-[#B8860B] transition-colors">
                        {opp.title}
                      </h4>

                      {/* Short summary - 2 lines max */}
                      <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                        {opp.description?.replace(/<[^>]*>/g, '').slice(0, 110) || 'See details for full description.'}
                      </p>

                      {/* Structured metadata */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                          <span>{opp.location || 'Accra'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
                          <GraduationCap className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                          <span>Graduate students and recent graduates</span>
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs font-bold ${isUrgent ? 'text-red-600' : 'text-neutral-600'}`}>
                          <Calendar className={`w-3.5 h-3.5 shrink-0 ${isUrgent ? 'text-red-500' : 'text-[#B8860B]'}`} />
                          <span>{getDaysLeftLabel(deadline)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card footer action */}
                    <div className="px-5 pb-5 pt-3 border-t border-neutral-100">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-[#001a54] group-hover:text-[#B8860B] transition-colors flex items-center gap-1">
                          View details <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                        {!archived && opp.apply_url && (
                          <a
                            href={opp.apply_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="bg-[#001a54] hover:bg-[#B8860B] text-white px-3 py-1.5 rounded-lg text-[10px] transition-colors flex items-center gap-1"
                          >
                            Apply now <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {archived && (
                          <span className="text-neutral-400 text-[10px] font-medium">Application closed</span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Load More */}
            {visibleCount < gridOpportunities.length && (
              <div className="text-center pt-4">
                <button
                  onClick={() => setVisibleCount(prev => prev + 6)}
                  className="bg-[#001a54] hover:bg-[#0b2b73] text-white font-bold px-8 py-3 rounded-full text-xs transition-all shadow-xs cursor-pointer"
                >
                  Load More Opportunities
                </button>
              </div>
            )}
          </section>
        )}

        {/* ───── 7. OPPORTUNITY ALERTS SUBSCRIPTION ───── */}
        <section>
          <div className="bg-[#000830] text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden">
            <div className="relative z-10 space-y-5">
              <div className="space-y-2 text-left">
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">Never Miss an Opportunity</h3>
                <p className="text-neutral-400 text-xs max-w-md">
                  Subscribe to receive weekly opportunity alerts — scholarships, grants, jobs, fellowships and more, selected for UPSA graduate students.
                </p>
              </div>
              {subscribed ? (
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-3 rounded-xl w-fit">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-sm">You're subscribed! We'll keep you posted.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-neutral-500 outline-none focus:ring-2 focus:ring-[#B8860B]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#B8860B] hover:bg-[#a6790a] text-white font-bold px-7 py-3 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 rounded-full bg-[#B8860B]/10 blur-2xl pointer-events-none" />
          </div>
        </section>

        {/* ───── 8. SUBMIT AN OPPORTUNITY CTA ───── */}
        <section className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 sm:p-8 text-left space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-[#001a54]">Know of an opportunity for graduate students?</h3>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-xl">
              GRASAG-UPSA curates verified opportunities for our members. Submit a listing for the executive team to review before publication.
            </p>
          </div>
          <button
            onClick={() => setIsSubmitOpen(true)}
            className="bg-[#001a54] hover:bg-[#0b2b73] text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Submit an Opportunity
          </button>
        </section>

        {/* ───── 9. TRUST DISCLAIMER ───── */}
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-left">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed font-medium">
            <strong>Important notice:</strong> GRASAG-UPSA shares opportunities for informational purposes only. Always confirm requirements, eligibility and deadlines directly on the official organisation's website before applying. GRASAG-UPSA bears no responsibility for outcomes arising from third-party listings.
          </p>
        </section>

      </div>

      {/* ───── DETAIL MODAL ───── */}
      {activeOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-fade-in p-4 sm:p-6">
          <div className="bg-white rounded-3xl w-full max-w-2xl h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-slide-in text-left">
            {/* Header */}
            <div className="bg-[#FAF6EC] p-6 border-b border-[#F5EAD2] flex justify-between items-start gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-full bg-[#001a54]/5 border border-[#001a54]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#001a54] uppercase tracking-wider">
                    {activeOpportunity.category}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border uppercase tracking-wider ${
                    isArchived(activeOpportunity) ? statusColors['Application Closed'] : statusColors['Open']
                  }`}>
                    {isArchived(activeOpportunity) ? 'Application Closed' : getOppStatus(activeOpportunity)}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#001a54] leading-tight">
                  {activeOpportunity.title}
                </h3>
                <span className="text-sm font-semibold text-neutral-500 flex items-center gap-1">
                  <Building className="w-4 h-4 text-[#B8860B]" /> {activeOpportunity.company}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleShare(activeOpportunity)}
                  title="Copy link"
                  className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-neutral-500 border border-neutral-200 flex items-center justify-center transition-colors cursor-pointer"
                >
                  {copiedShareId === activeOpportunity.id ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setReportId(activeOpportunity.id)}
                  title="Report expired listing"
                  className="w-8 h-8 rounded-full bg-white/80 hover:bg-red-50 text-neutral-400 hover:text-red-500 border border-neutral-200 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Flag className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveOpportunity(null)}
                  className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-neutral-600 border border-neutral-200 flex items-center justify-center transition-colors cursor-pointer font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">
              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-5 rounded-2xl border border-neutral-100 text-xs font-medium text-neutral-600">
                {[
                  { icon: MapPin, label: 'Location', value: activeOpportunity.location || 'Accra' },
                  { icon: DollarSign, label: 'Funding / Type', value: activeOpportunity.type || 'See details' },
                  { icon: GraduationCap, label: 'Eligibility', value: 'Graduate students & recent graduates' },
                  { icon: Calendar, label: 'Deadline', value: getDaysLeftLabel((activeOpportunity as any).deadline) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2">
                    <Icon className="w-4 h-4 text-[#B8860B] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 block uppercase tracking-wider">{label}</span>
                      <span className="text-neutral-700">{value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* About the Opportunity */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#001a54] border-b pb-2">About this Opportunity</h4>
                <div
                  className="text-xs sm:text-sm text-neutral-600 leading-relaxed space-y-2"
                  dangerouslySetInnerHTML={{ __html: activeOpportunity.description || '<p>No description provided.</p>' }}
                />
              </div>

              {/* Requirements */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#001a54] border-b pb-2">Key Requirements</h4>
                <ul className="list-disc list-inside text-xs text-neutral-600 space-y-2">
                  <li>Applicants must be currently enrolled or recently graduated postgraduate students at UPSA.</li>
                  <li>A strong academic record or relevant professional background is required.</li>
                  <li>Prepare your CV, personal statement and references before applying.</li>
                </ul>
              </div>

              {/* Application process */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#001a54] border-b pb-2">Application Process</h4>
                <ol className="list-decimal list-inside text-xs text-neutral-600 space-y-2">
                  <li>Review the full requirements on the official organisation's website.</li>
                  <li>Prepare all required documents.</li>
                  <li>Submit your application using the Apply Now button below before the deadline.</li>
                </ol>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Always verify eligibility, deadline and requirements directly on the{' '}
                  {activeOpportunity.apply_url ? (
                    <a href={activeOpportunity.apply_url} target="_blank" rel="noopener noreferrer" className="underline font-bold">
                      official organisation's website
                    </a>
                  ) : (
                    "official organisation's website"
                  )}{' '}
                  before applying. GRASAG-UPSA curates listings for informational purposes only.
                </p>
              </div>

              {/* Report confirmation */}
              {reportId === activeOpportunity.id && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-center justify-between">
                  <p className="text-xs text-red-700 font-medium">Thanks — this listing has been flagged for review.</p>
                  <button onClick={() => setReportId(null)} className="text-red-400 hover:text-red-700 text-xs font-bold">Dismiss</button>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-neutral-100 flex flex-wrap justify-between items-center gap-3 bg-neutral-50/60">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setReportId(activeOpportunity.id); }}
                  className="text-xs text-neutral-400 hover:text-red-500 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5" /> Report expired listing
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveOpportunity(null)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-500 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
                {!isArchived(activeOpportunity) && activeOpportunity.apply_url && (
                  <a
                    href={activeOpportunity.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#001a54] hover:bg-[#B8860B] text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5"
                  >
                    Apply now <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {isArchived(activeOpportunity) && (
                  <span className="bg-neutral-100 text-neutral-400 font-bold px-5 py-2.5 rounded-xl text-xs">
                    Application Closed
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───── SUBMIT OPPORTUNITY MODAL ───── */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 space-y-5 relative text-left">
            <button
              onClick={() => setIsSubmitOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-[#001a54]">Submit an Opportunity</h3>
              <p className="text-xs text-neutral-500">The GRASAG executive team will review your submission before it is published.</p>
            </div>
            <form
              onSubmit={e => { e.preventDefault(); setIsSubmitOpen(false); alert('Opportunity submitted for review. Thank you!'); }}
              className="space-y-3"
            >
              <input type="text" placeholder="Opportunity Title" required className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs outline-none" />
              <input type="text" placeholder="Organisation / Company" required className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs outline-none" />
              <select className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs outline-none text-neutral-700">
                <option value="">Category</option>
                {categoriesList.filter(c => c.name !== 'All').map(c => <option key={c.name}>{c.name}</option>)}
              </select>
              <input type="date" placeholder="Application Deadline" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs outline-none" />
              <input type="url" placeholder="Official Application URL (https://…)" required className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs outline-none" />
              <textarea rows={3} placeholder="Brief description (2–3 sentences)" required className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs outline-none" />
              <input type="email" placeholder="Your email (for follow-up)" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs outline-none" />
              <button type="submit" className="w-full bg-[#001a54] hover:bg-[#0b2b73] text-white font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer">
                Submit for Review
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
