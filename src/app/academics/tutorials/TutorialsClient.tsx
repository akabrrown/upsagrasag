"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Video, 
  BookOpen, 
  Clock, 
  User, 
  GraduationCap, 
  Play, 
  Filter, 
  X, 
  CheckCircle, 
  FileText, 
  Calendar, 
  ArrowRight,
  HelpCircle,
  ThumbsUp,
  Download,
  Bookmark
} from 'lucide-react';

interface TutorialItem {
  id: string;
  title: string;
  course: string;
  level: string;
  tutor: string;
  duration: string;
  updated_at: string;
  type: 'Video' | 'Written' | 'Revision';
  video_url?: string;
  image_url?: string;
  description: string;
  slides_url?: string;
}

// Removed hardcoded default tutorials

function extractYouTubeId(url: string): string {
  const reg = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
  const match = url.match(reg);
  return match ? match[1] : '';
}

export default function TutorialsClient({ dbTutorials = [] }: { dbTutorials?: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Video' | 'Written' | 'Revision'>('All');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'az'>('newest');
  
  // Pagination / Load More state
  const [visibleCount, setVisibleCount] = useState(9);
  
  // Modal State for Video Player
  const [activeVideoModal, setActiveVideoModal] = useState<TutorialItem | null>(null);
  const [isHelpfulFeedback, setIsHelpfulFeedback] = useState<boolean | null>(null);

  // Combine DB tutorials with defaults if needed
  const tutorialsList = useMemo(() => {
    if (!dbTutorials || dbTutorials.length === 0) return [];

    const formattedDB: TutorialItem[] = dbTutorials.map(t => {
      const isVideo = t.video_url && t.video_url.length > 0;
      return {
        id: t.id,
        title: t.title,
        course: (t as any).course || 'Postgraduate Course',
        level: (t as any).level || 'Level 600',
        tutor: (t as any).tutor || 'GRASAG Tutor',
        duration: (t as any).duration || (isVideo ? '20:00' : '15 min read'),
        updated_at: 'Recently Updated',
        type: isVideo ? 'Video' : 'Written',
        video_url: t.video_url,
        image_url: t.image_url,
        description: t.description || 'Comprehensive graduate tutorial session.'
      };
    });

    return formattedDB;
  }, [dbTutorials]);

  // Unique dropdown options
  const coursesList = useMemo(() => {
    const set = new Set<string>();
    tutorialsList.forEach(t => set.add(t.course));
    return ['All', ...Array.from(set)];
  }, [tutorialsList]);

  const levelsList = useMemo(() => {
    const set = new Set<string>();
    tutorialsList.forEach(t => set.add(t.level));
    return ['All', ...Array.from(set)];
  }, [tutorialsList]);

  // Featured exam-focused tutorials (top 3)
  const featuredTutorials = useMemo(() => {
    return tutorialsList.slice(0, 3);
  }, [tutorialsList]);

  // Filtering & Sorting
  const filteredTutorials = useMemo(() => {
    return tutorialsList
      .filter(t => {
        const matchesSearch = 
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.tutor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTab = activeTab === 'All' || t.type === activeTab;
        const matchesCourse = selectedCourse === 'All' || t.course === selectedCourse;
        const matchesLevel = selectedLevel === 'All' || t.level === selectedLevel;

        return matchesSearch && matchesTab && matchesCourse && matchesLevel;
      })
      .sort((a, b) => {
        if (sortBy === 'az') return a.title.localeCompare(b.title);
        return 0; // Default newest
      });
  }, [tutorialsList, searchQuery, activeTab, selectedCourse, selectedLevel, sortBy]);

  const visibleTutorials = useMemo(() => {
    return filteredTutorials.slice(0, visibleCount);
  }, [filteredTutorials, visibleCount]);

  const resetFilters = () => {
    setSearchQuery('');
    setActiveTab('All');
    setSelectedCourse('All');
    setSelectedLevel('All');
    setSortBy('newest');
    setVisibleCount(9);
  };

  return (
    <div className="w-full bg-background text-foreground pb-20">
      
      {/* 1. Simple Hero Section with Breadcrumb */}
      <section className="w-full bg-[#001a54] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-left space-y-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-blue-200/80">
            <Link href="/" className="hover:text-white transition-colors">Student Support</Link>
            <span>/</span>
            <span className="text-white">Tutorials</span>
          </nav>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Tutorials & Study Support
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 max-w-2xl font-medium leading-relaxed">
              Search tutorial videos, revision materials and study guides by course or topic.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-10">

        {/* 6. Featured / Exam-Focused Section */}
        <section className="bg-[#FAF6EC] border border-[#F5EAD2] rounded-3xl p-6 sm:p-8 text-left space-y-6">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#B8860B]/10 px-2.5 py-1 text-[10px] font-extrabold text-[#B8860B] uppercase tracking-wider">
              Exam Preparation
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#001a54]">
              Preparing for end-of-semester examinations?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-medium">
              Top curated revision sessions to help you master core graduate modules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredTutorials.map((ft) => (
              <div 
                key={ft.id}
                onClick={() => {
                  if (ft.video_url) setActiveVideoModal(ft);
                }}
                className="bg-white border border-[#E8E8E8] rounded-2xl p-4 flex flex-col justify-between space-y-3 cursor-pointer hover:shadow-md transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#B8860B]">
                    <span>{ft.course}</span>
                    <span>{ft.duration}</span>
                  </div>
                  <h3 className="font-bold text-[#001a54] text-sm line-clamp-2 group-hover:text-[#B8860B] transition-colors">
                    {ft.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#001a54] pt-2 border-t border-neutral-100">
                  <Play className="w-3.5 h-3.5 text-[#B8860B] fill-current" />
                  <span>Watch featured tutorial →</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* 2. Search & Filter Bar */}
        <div className="space-y-6 text-left">
          
          {/* Search bar */}
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by course, topic or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E8E8E8] rounded-2xl pl-12 pr-4 py-3.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-[#001a54] focus:border-transparent shadow-xs transition-all"
            />
          </div>

          {/* 3. Resource Type Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-200">
            {(['All', 'Video', 'Written', 'Revision'] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 text-xs font-bold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
                    isActive
                      ? 'border-[#001a54] text-[#001a54]'
                      : 'border-transparent text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  {tab === 'All' ? 'All Resources' : tab === 'Video' ? 'Video Tutorials' : tab === 'Written' ? 'Study Guides' : 'Revision Sessions'}
                </button>
              );
            })}
          </div>

          {/* Select Dropdown Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block mb-1">Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full bg-white border border-[#E8E8E8] rounded-xl px-3.5 py-2 text-xs font-bold text-neutral-700 outline-none focus:ring-2 focus:ring-[#001a54]"
              >
                <option value="All">Select course: All</option>
                {coursesList.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block mb-1">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full bg-white border border-[#E8E8E8] rounded-xl px-3.5 py-2 text-xs font-bold text-neutral-700 outline-none focus:ring-2 focus:ring-[#001a54]"
              >
                <option value="All">Select level: All</option>
                {levelsList.filter(l => l !== 'All').map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block mb-1">Sort</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-white border border-[#E8E8E8] rounded-xl px-3.5 py-2 text-xs font-bold text-neutral-700 outline-none focus:ring-2 focus:ring-[#001a54]"
              >
                <option value="newest">Sort: Newest</option>
                <option value="az">Sort: A – Z</option>
              </select>
            </div>
          </div>

          {/* Result Count */}
          <div className="flex justify-between items-center text-xs font-semibold text-neutral-500 pt-2">
            <span>Showing 1–{Math.min(visibleCount, filteredTutorials.length)} of {filteredTutorials.length} tutorials</span>
            {(searchQuery || activeTab !== 'All' || selectedCourse !== 'All' || selectedLevel !== 'All') && (
              <button 
                onClick={resetFilters}
                className="text-[#B8860B] font-bold hover:underline cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Empty Filter State */}
        {filteredTutorials.length === 0 && (
          <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-neutral-200/70 space-y-3">
            <HelpCircle className="w-10 h-10 text-neutral-400 mx-auto" />
            <h3 className="text-base font-bold text-neutral-800">No tutorials match your filters</h3>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              Try adjusting your search keywords or clearing course filters.
            </p>
            <button
              onClick={resetFilters}
              className="text-[#B8860B] font-bold text-xs hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* 4. Redesigned Tutorial Cards Grid (16:9 Thumbnail, clean metadata, max 2 lines title) */}
        {visibleTutorials.length > 0 && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch text-left">
            {visibleTutorials.map((item) => {
              const youtubeId = item.video_url ? extractYouTubeId(item.video_url) : null;
              const thumbnail = item.image_url || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : null);

              return (
                <article
                  key={item.id}
                  onClick={() => {
                    if (item.video_url) setActiveVideoModal(item);
                  }}
                  className="group bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-[#001a54]/30 transition-all duration-300 cursor-pointer"
                >
                  <div>
                    {/* 16:9 Aspect Ratio Video Thumbnail */}
                    <div className="relative w-full aspect-video bg-neutral-900 flex items-center justify-center overflow-hidden">
                      {thumbnail ? (
                        <Image 
                          src={thumbnail} 
                          alt={item.title} 
                          fill
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#001a54] to-[#0b2b73] flex items-center justify-center text-white/50">
                          <BookOpen className="w-10 h-10" />
                        </div>
                      )}

                      {/* Play Overlay & Duration Badge */}
                      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 text-[#001a54] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>

                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                        {item.duration}
                      </div>

                      <div className="absolute top-2 left-2 bg-[#001a54] text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                        {item.type}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500">
                        <span className="text-[#B8860B] font-bold truncate max-w-[160px]">{item.course}</span>
                        <span>{item.level}</span>
                      </div>

                      {/* Max 2 Lines Title */}
                      <h3 className="font-extrabold text-[#001a54] text-base leading-snug line-clamp-2 group-hover:text-[#B8860B] transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed font-normal">
                        {item.description}
                      </p>

                      <div className="text-[11px] text-neutral-400 font-medium flex items-center justify-between pt-1">
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {item.tutor}</span>
                        <span>{item.updated_at}</span>
                      </div>
                    </div>
                  </div>

                  {/* Single Action Footer */}
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-[#001a54] group-hover:text-[#B8860B] transition-colors">
                      <span>Watch tutorial</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {/* 5. Load More Button */}
        {visibleCount < filteredTutorials.length && (
          <div className="text-center pt-4">
            <button
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="bg-[#001a54] hover:bg-[#0b2b73] text-white font-bold px-8 py-3.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer"
            >
              Load More Tutorials
            </button>
          </div>
        )}

        {/* 6. Request a Tutorial & Become a Tutor CTAs */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left pt-6">
          <div className="bg-[#FAF6EC] border border-[#F5EAD2] rounded-3xl p-8 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-[#001a54]">Can’t find the topic you need?</h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
                Submit a tutorial request and tell our academic committee which module or topic needs coverage.
              </p>
            </div>
            <div>
              <a
                href="/contact"
                className="inline-block bg-[#001a54] hover:bg-[#0b2b73] text-white font-bold px-6 py-3 rounded-xl text-xs transition-all"
              >
                Request a Tutorial
              </a>
            </div>
          </div>

          <div className="bg-[#001a54] text-white rounded-3xl p-8 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white">Interested in supporting graduate students?</h3>
              <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed font-medium">
                Are you a qualified postgraduate student or alumnus? Volunteer as a peer tutor for GRASAG-UPSA.
              </p>
            </div>
            <div>
              <a
                href="/contact"
                className="inline-block bg-[#B8860B] hover:bg-[#a6790a] text-white font-bold px-6 py-3 rounded-xl text-xs transition-all"
              >
                Volunteer as a Tutor
              </a>
            </div>
          </div>
        </section>

        {/* 6. Related Academic Resources */}
        <section className="border-t border-neutral-200 pt-10 text-left space-y-4">
          <h3 className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest">
            Related Academic Resources
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold text-[#001a54]">
            <Link href="/academics/past-questions" className="p-4 bg-white border border-[#E8E8E8] rounded-xl hover:border-[#001a54] transition-colors flex items-center justify-between">
              <span>Past Questions Bank</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B8860B]" />
            </Link>
            <Link href="/student-support/academic-calendar" className="p-4 bg-white border border-[#E8E8E8] rounded-xl hover:border-[#001a54] transition-colors flex items-center justify-between">
              <span>Academic Calendar</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B8860B]" />
            </Link>
            <Link href="/resources" className="p-4 bg-white border border-[#E8E8E8] rounded-xl hover:border-[#001a54] transition-colors flex items-center justify-between">
              <span>Research Proposal Guide</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B8860B]" />
            </Link>
            <Link href="/resources" className="p-4 bg-white border border-[#E8E8E8] rounded-xl hover:border-[#001a54] transition-colors flex items-center justify-between">
              <span>Student Resources</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B8860B]" />
            </Link>
          </div>
        </section>

      </div>

      {/* 7. On-Page Video Modal with Helpful Feedback */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col text-left">
            {/* Modal Video Header */}
            <div className="bg-[#001a54] text-white p-4 px-6 flex justify-between items-center">
              <div className="truncate pr-4">
                <span className="text-[10px] text-[#B8860B] font-bold uppercase tracking-wider block">{activeVideoModal.course}</span>
                <h3 className="font-bold text-sm sm:text-base truncate">{activeVideoModal.title}</h3>
              </div>
              <button
                onClick={() => {
                  setActiveVideoModal(null);
                  setIsHelpfulFeedback(null);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Area */}
            <div className="w-full aspect-video bg-black">
              {activeVideoModal.video_url ? (
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(activeVideoModal.video_url)}?autoplay=1`}
                  title={activeVideoModal.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/60">
                  <p>Video stream unavailable</p>
                </div>
              )}
            </div>

            {/* Modal Body & Feedback */}
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3 text-xs text-neutral-500 font-medium">
                  <span>Tutor: {activeVideoModal.tutor}</span>
                  <span>•</span>
                  <span>{activeVideoModal.level}</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  {activeVideoModal.description}
                </p>
              </div>

              {/* Feedback Row */}
              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold text-neutral-600">
                <span>Was this tutorial helpful?</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsHelpfulFeedback(true)}
                    className={`px-4 py-2 rounded-xl border flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isHelpfulFeedback === true
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Yes</span>
                  </button>
                  <button
                    onClick={() => setIsHelpfulFeedback(false)}
                    className={`px-4 py-2 rounded-xl border flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isHelpfulFeedback === false
                        ? 'bg-red-50 border-red-500 text-red-700'
                        : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <span>No</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
