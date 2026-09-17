"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Resource } from '@/types/admin';
import { 
  Search, 
  FileText, 
  ExternalLink, 
  Download, 
  BookOpen, 
  Globe, 
  GraduationCap, 
  Calendar, 
  ShieldCheck, 
  Building,
  HelpCircle,
  ArrowUpRight
} from 'lucide-react';

interface ResourcesClientProps {
  initialResources: Resource[];
}

interface CuratedResourceItem {
  id: string;
  title: string;
  category: 'Documents' | 'Forms' | 'Academic' | 'Student Services';
  description: string;
  type: 'PDF' | 'DOCX' | 'Platform' | 'Link';
  fileInfo?: string; // e.g. "PDF · Updated July 2026 · 2.4 MB"
  url: string;
  isExternal: boolean;
  isFrequentlyUsed?: boolean;
  icon?: any;
}

const defaultCuratedResources: CuratedResourceItem[] = [
  // Frequently Used Platforms
  {
    id: 'freq-1',
    title: 'UPSA Student Portal',
    category: 'Student Services',
    description: 'Access course registration, examination results, fee statements and student records.',
    type: 'Platform',
    url: 'https://upsasis.com/student',
    isExternal: true,
    isFrequentlyUsed: true,
    icon: Globe
  },
  {
    id: 'freq-2',
    title: 'UPSA Virtual Learning Platform',
    category: 'Academic',
    description: 'Access online lectures, course materials, assignment submissions and academic activities.',
    type: 'Platform',
    url: 'https://join.upsavirtual.site',
    isExternal: true,
    isFrequentlyUsed: true,
    icon: BookOpen
  },
  {
    id: 'freq-3',
    title: 'Academic Calendar 2026/2027',
    category: 'Academic',
    description: 'Key dates for semester registration, lectures, revision weeks, and examination periods.',
    type: 'PDF',
    fileInfo: 'PDF · Updated Aug 2026 · 1.2 MB',
    url: '/student-support/academic-calendar',
    isExternal: false,
    isFrequentlyUsed: true,
    icon: Calendar
  },
  {
    id: 'freq-4',
    title: 'UPSA UFIS (Financial Portal)',
    category: 'Student Services',
    description: 'Access financial information, fee breakdown, and approved student finance services.',
    type: 'Platform',
    url: 'https://ufis.upsa.edu.gh',
    isExternal: true,
    isFrequentlyUsed: true,
    icon: Building
  },

  // Documents & Forms
  {
    id: 'doc-1',
    title: 'GRASAG-UPSA Constitution',
    category: 'Documents',
    description: 'Rules, governance framework, code of conduct and executive responsibilities of the association.',
    type: 'PDF',
    fileInfo: 'PDF · Updated July 2026 · 2.4 MB',
    url: '#',
    isExternal: false
  },
  {
    id: 'doc-2',
    title: 'Student Welfare Request Form',
    category: 'Forms',
    description: 'Official application form for emergency support, health assistance, and welfare guidance.',
    type: 'DOCX',
    fileInfo: 'DOCX · Updated June 2026 · 350 KB',
    url: '#',
    isExternal: false
  },
  {
    id: 'doc-3',
    title: 'Academic Grievance & Escalation Form',
    category: 'Forms',
    description: 'Formal submission form for academic disputes, grading queries, and supervisor escalations.',
    type: 'DOCX',
    fileInfo: 'DOCX · Updated July 2026 · 420 KB',
    url: '#',
    isExternal: false
  },
  {
    id: 'doc-4',
    title: 'Postgraduate Research Proposal Guide',
    category: 'Academic',
    description: 'Comprehensive methodology guidelines and thesis structure checklist for MPhil & PhD students.',
    type: 'PDF',
    fileInfo: 'PDF · Updated May 2026 · 1.8 MB',
    url: '#',
    isExternal: false
  },

  // Official UPSA Links
  {
    id: 'link-1',
    title: 'UPSA Official Website',
    category: 'Student Services',
    description: 'Main university portal for news, announcements, and university-wide directories.',
    type: 'Link',
    url: 'https://upsa.edu.gh',
    isExternal: true
  },
  {
    id: 'link-2',
    title: 'School of Graduate Studies',
    category: 'Academic',
    description: 'Postgraduate handbook, departmental contacts, and administrative guidelines.',
    type: 'Link',
    url: 'https://upsa.edu.gh/academics/graduate-school/',
    isExternal: true
  }
];

export default function ResourcesClient({ initialResources }: ResourcesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Documents', 'Forms', 'Academic', 'Student Services'];

  // Map initial DB resources to curated items format if present
  const allResources = useMemo(() => {
    if (!initialResources || initialResources.length === 0) return defaultCuratedResources;
    
    const convertedDB: CuratedResourceItem[] = initialResources.map(r => ({
      id: r.id || String(Math.random()),
      title: r.title,
      category: (r as any).category || (r.file_url ? 'Documents' : 'Student Services'),
      description: (r as any).description || 'Official student resource provided by GRASAG-UPSA.',
      type: r.file_url ? (r.file_url.endsWith('.docx') ? 'DOCX' : 'PDF') : 'Link',
      fileInfo: r.file_url ? `File · Added 2026` : undefined,
      url: r.file_url || r.link_url || '#',
      isExternal: !!r.link_url
    }));

    return [...defaultCuratedResources, ...convertedDB];
  }, [initialResources]);

  // Filtered resources based on Search and Tab Category
  const filteredResources = useMemo(() => {
    return allResources.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allResources, searchQuery, selectedCategory]);

  const frequentlyUsed = useMemo(() => {
    return filteredResources.filter(r => r.isFrequentlyUsed);
  }, [filteredResources]);

  const directoryResources = useMemo(() => {
    return filteredResources.filter(r => !r.isFrequentlyUsed);
  }, [filteredResources]);

  return (
    <div className="w-full bg-background text-foreground pb-20">
      
      {/* 1. Compact Hero Section with Breadcrumb */}
      <section className="w-full bg-[#001a54] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-left space-y-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-blue-200/80">
            <Link href="/" className="hover:text-white transition-colors">Student Support</Link>
            <span>/</span>
            <span className="text-white">Resources</span>
          </nav>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Student Resources
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 max-w-2xl font-medium leading-relaxed">
              Find official documents, forms, academic tools and frequently used UPSA platforms.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container max-w-6xl (~1200px) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-10">
        
        {/* 2. Search Bar & 3. Category Filter Chips */}
        <div className="space-y-6 text-left">
          {/* Search Input */}
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search resources, forms and student platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E8E8E8] rounded-2xl pl-12 pr-4 py-3.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-[#001a54] focus:border-transparent shadow-xs transition-all"
            />
          </div>

          {/* Horizontally scrollable Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#001a54] text-white shadow-xs'
                      : 'bg-neutral-100 hover:bg-neutral-200/70 text-neutral-600'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty Search State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-neutral-200/70 space-y-3">
            <HelpCircle className="w-10 h-10 text-neutral-400 mx-auto" />
            <h3 className="text-base font-bold text-neutral-800">No resources found</h3>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              We couldn&apos;t find anything matching your search. Try resetting the category filter.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="text-[#B8860B] font-bold text-xs hover:underline"
            >
              Reset Search & Filters
            </button>
          </div>
        )}

        {/* 4. Frequently Used Platforms (Shortcut Grid) */}
        {frequentlyUsed.length > 0 && (
          <section className="space-y-4 text-left">
            <h2 className="text-xs font-extrabold text-[#B8860B] uppercase tracking-widest">
              Frequently Used Platforms
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {frequentlyUsed.map((item) => {
                const Icon = item.icon || Globe;
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target={item.isExternal ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="group bg-white border border-[#E8E8E8] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md hover:border-[#001a54]/30 transition-all duration-300 cursor-pointer"
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF6EC] border border-[#F5EAD2] flex items-center justify-center text-[#B8860B] group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">{item.category}</span>
                        <h3 className="font-extrabold text-[#001a54] text-base group-hover:text-[#B8860B] transition-colors leading-snug">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-[#B8860B]">
                      <span>{item.isExternal ? 'Open platform' : 'View details'}</span>
                      {item.isExternal ? <ArrowUpRight className="w-4 h-4" /> : <ExternalLink className="w-3.5 h-3.5" />}
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* 5. Directory List of Documents & Links */}
        {directoryResources.length > 0 && (
          <section className="space-y-4 text-left pt-4">
            <h2 className="text-xs font-extrabold text-[#B8860B] uppercase tracking-widest">
              Documents & Official Links
            </h2>
            <div className="bg-white border border-[#E8E8E8] rounded-2xl divide-y divide-neutral-100 overflow-hidden shadow-xs">
              {directoryResources.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target={item.isExternal ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="group p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/80 transition-colors duration-200 cursor-pointer"
                >
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center rounded-md bg-[#FAF6EC] border border-[#F5EAD2] px-2 py-0.5 text-[9px] font-bold text-[#B8860B] uppercase tracking-wider">
                        {item.type}
                      </span>
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#001a54] text-base sm:text-lg group-hover:text-[#B8860B] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {item.description}
                    </p>
                    {item.fileInfo && (
                      <span className="text-[11px] font-medium text-neutral-400 block pt-0.5">
                        {item.fileInfo}
                      </span>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-[#001a54]/5 group-hover:bg-[#001a54] text-[#001a54] group-hover:text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-xs">
                      {item.type === 'PDF' || item.type === 'DOCX' ? (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </>
                      ) : (
                        <>
                          <span>Visit link</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 6. Can't find what you need? CTA */}
        <section className="pt-8">
          <div className="bg-[#FAF6EC] border border-[#F5EAD2] rounded-3xl p-8 sm:p-10 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#001a54]">
                Looking for a form or document that isn&apos;t listed?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
                Contact GRASAG-UPSA and our secretariat will assist you in acquiring the required administrative file.
              </p>
            </div>
            <a
              href="/contact"
              className="bg-[#001a54] hover:bg-[#0b2b73] text-white font-bold px-7 py-3 rounded-xl text-xs transition-all shadow-xs whitespace-nowrap shrink-0"
            >
              Request a Resource
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
