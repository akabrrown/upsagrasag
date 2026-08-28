'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Calendar, FileText, Info, Loader2, Link as LinkIcon, Command } from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: string;
  date?: string | null;
}

const RECOMMENDED_SEARCHES = [
  "Thesis Guidelines",
  "Registration",
  "Graduation",
  "Upcoming Events"
];

export default function GlobalSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle Cmd+K / Ctrl+K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        // Since we are inside the component that requires isOpen to mount, 
        // this handler might also need to live in the parent Navbar. 
        // We'll dispatch a custom event if we want global listening.
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input on mount
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Debounced Search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleResultClick = (url: string) => {
    onClose();
    router.push(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5 flex flex-col max-h-[75vh]">
        
        {/* Search Input Area */}
        <div className="flex items-center px-4 py-4 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
          <input 
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none"
            placeholder="Search for news, events, resources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          
          {/* Default State: Recommended Searches */}
          {!hasSearched && (
            <div className="px-4 py-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Command className="w-3.5 h-3.5" /> Recommended
              </h3>
              <div className="flex flex-wrap gap-2">
                {RECOMMENDED_SEARCHES.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(item)}
                    className="px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-[#003366] text-sm rounded-full border border-gray-200 hover:border-blue-200 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="py-14 flex flex-col items-center justify-center text-gray-400 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#B8860B]" />
              <p className="text-sm">Searching GRASAG-UPSA...</p>
            </div>
          )}

          {/* Empty Results */}
          {!isLoading && hasSearched && results.length === 0 && (
            <div className="py-14 text-center">
              <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-900 font-medium">No results found</p>
              <p className="text-gray-500 text-sm mt-1">We couldn't find anything matching "{query}"</p>
            </div>
          )}

          {/* Render Results */}
          {!isLoading && results.length > 0 && (
            <div className="py-2">
              <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Search Results</h3>
              <div className="space-y-1">
                {results.map((result) => {
                  
                  let Icon = FileText;
                  if (result.type === 'News') Icon = Info;
                  if (result.type === 'Event') Icon = Calendar;
                  if (result.type === 'Resource') Icon = LinkIcon;

                  return (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.url)}
                      className="w-full flex items-start text-left p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                    >
                      <div className="bg-gray-100 group-hover:bg-blue-100 text-gray-500 group-hover:text-[#003366] p-2 rounded-lg mr-4 shrink-0 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {result.title}
                          </p>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 shrink-0">
                            {result.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          {result.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 px-4 py-3 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><kbd className="bg-white border border-gray-200 px-1.5 py-0.5 rounded shadow-sm text-gray-500">esc</kbd> to close</span>
          </div>
          <span>GRASAG-UPSA Search</span>
        </div>

      </div>
    </div>
  );
}
