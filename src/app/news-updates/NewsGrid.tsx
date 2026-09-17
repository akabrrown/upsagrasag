/* src/app/news-updates/NewsGrid.tsx */
"use client";

import React, { useState, useMemo } from "react";
import { Search, SortAsc, AlertTriangle, ArrowRight } from "lucide-react";
import type { NewsUpdate } from "@/types/admin";
import NewsCard from "./NewsCard";
import FeaturedStory from "./FeaturedStory";
import {
  PREFERRED_CATEGORIES,
  categoryLabel,
  getDateValue,
  publishedDate,
  stripHtml,
} from "./utils";

const PAGE_SIZE = 9;

export default function NewsGrid({ news }: { news: NewsUpdate[] }) {
  const [activeCat, setActiveCat] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [visible, setVisible] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches ? 9 : 6
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    news.forEach((n) => {
      if (n.category) set.add(categoryLabel(n.category));
    });
    return PREFERRED_CATEGORIES.filter((c) => set.has(c));
  }, [news]);

  const latest = useMemo(
    () =>
      [...news].sort((a, b) => getDateValue(b) - getDateValue(a))[0] ?? null,
    [news]
  );

  const urgent = useMemo(() => {
    return [...news]
      .filter((n) => categoryLabel(n.category) === "Announcements")
      .sort((a, b) => getDateValue(b) - getDateValue(a))[0] ?? null;
  }, [news]);

  const filtered = useMemo(() => {
    let list = news.filter((n) => n.id !== latest?.id);

    if (activeCat !== "All") {
      list = list.filter((n) => categoryLabel(n.category) === activeCat);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((n) => {
        const haystack = [
          n.title,
          stripHtml(n.content),
          categoryLabel(n.category),
          publishedDate(n),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }

    const sorted = [...list].sort((a, b) => {
      const diff = getDateValue(b) - getDateValue(a);
      return sort === "newest" ? diff : -diff;
    });

    return sorted;
  }, [news, activeCat, query, sort, latest]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;
  const showFilters = categories.length > 1;
  const isFeaturedLatest = !!(latest && news.length > 0);

  return (
    <div>
      {/* Important announcements strip */}
      {urgent && (
        <div className="mb-10 bg-gradient-to-r from-[#0c2340] to-[#1d447a] text-white rounded-2xl px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <AlertTriangle className="h-5 w-5 text-[#d4af37]" />
            <span className="font-extrabold text-sm uppercase tracking-wider">Important</span>
          </div>
          <p className="text-sm text-white/90 flex-1 line-clamp-1 sm:line-clamp-none">
            {urgent.title}
          </p>
          <a
            href={`/news-updates/${urgent.id ?? urgent.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#d4af37] hover:text-white transition-colors shrink-0"
          >
            View announcement
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      )}

      {/* Featured story */}
      {isFeaturedLatest && latest && <FeaturedStory item={latest} />}

      {/* Search + sort */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_SIZE); }}
            placeholder="Search news and updates..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2340]/20 focus:border-[#0c2340] transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort:</span>
          <div className="relative inline-flex">
            <button
              onClick={() => setSort(sort === "newest" ? "oldest" : "newest")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-[#0c2340] transition-colors"
            >
              {sort === "newest" ? <SortAsc className="h-4 w-4" /> : <SortDescIcon />}
              {sort === "newest" ? "Newest first" : "Oldest first"}
            </button>
          </div>
        </div>
      </div>

      {/* Category filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => setActiveCat("All")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCat === "All" ? "bg-[#0c2340] text-white shadow" : "bg-white text-gray-800 border border-gray-200 hover:border-[#0c2340]"}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCat(cat); setVisible(PAGE_SIZE); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCat === cat ? "bg-[#0c2340] text-white shadow" : "bg-white text-gray-800 border border-gray-200 hover:border-[#0c2340]"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Latest stories grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">No news updates match your search.</p>
          <p className="text-sm text-gray-400 mt-2">Try a different term or category.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {shown.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-sm text-gray-500">
              Showing 1–{Math.min(visible, filtered.length)} of <span className="font-semibold text-gray-800">{filtered.length}</span> stories
            </p>
            {hasMore && (
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="px-8 py-3 rounded-full bg-[#0c2340] text-white font-bold text-sm hover:bg-[#1d447a] transition-colors shadow-lg shadow-[#0c2340]/20"
              >
                Load More Stories
              </button>
            )}
          </div>
        </>
      )}

      {/* Subscribe / share section */}
      <SubscribeSection />
    </div>
  );
}

function SortDescIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <SortAsc className={`${className} rotate-180`} />;
}

/* ── Stay informed / sharing ── */
function SubscribeSection() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  };

  return (
    <section className="mt-20 bg-[#0c2340] rounded-3xl overflow-hidden">
      <div className="px-8 py-12 md:px-12 text-center">
        <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Stay informed</h3>
        <p className="text-white/80 max-w-xl mx-auto mb-8">
          Receive important GRASAG-UPSA announcements, events and opportunities by email.
        </p>

        {done ? (
          <p className="inline-block px-6 py-3 bg-[#d4af37] text-[#0c2340] font-bold rounded-full">
            Thanks for subscribing — watch your inbox!
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-[#d4af37] text-[#0c2340] font-bold hover:bg-white transition-colors"
            >
              Subscribe
            </button>
          </form>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-sm">
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            {SocialIcons.whatsapp} WhatsApp channel
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            {SocialIcons.x} X
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            {SocialIcons.facebook} Facebook
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            {SocialIcons.linkedin} LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}

const SocialIcons = {
  whatsapp: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/></svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
  ),
};
