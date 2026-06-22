"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NewsUpdate } from "@/types/admin";

export default function NewsGrid({ news }: { news: NewsUpdate[] }) {
  const [activeCat, setActiveCat] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    news.forEach((n) => set.add(n.category));
    return Array.from(set);
  }, [news]);

  const filtered = useMemo(() => {
    if (activeCat === "All") return news;
    return news.filter((n) => n.category === activeCat);
  }, [activeCat, news]);

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium ${activeCat === "All" ? "bg-[#0c2340] text-white" : "bg-gray-200 text-gray-800"}`}
          onClick={() => setActiveCat("All")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full text-sm font-medium ${activeCat === cat ? "bg-[#0c2340] text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => setActiveCat(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">No news updates for the selected category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.map((item) => (
            <article key={item.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
              {item.image_url ? (
                <div className="relative w-full h-56 bg-gray-200">
                  <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="relative w-full h-56 bg-gradient-to-br from-[#0c2340] to-[#1d447a] flex items-center justify-center p-6 text-center">
                  <h3 className="text-white text-xl font-bold opacity-80">{item.title}</h3>
                </div>
              )}

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#d4af37] bg-[#0c2340] rounded-full">
                    {item.category}
                  </span>
                  <time className="text-sm text-gray-500 font-medium">
                    {new Date(item.published_at ?? item.created_at ?? "").toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
                  {item.title}
                </h2>

                <div
                  className="prose prose-sm prose-blue max-w-none text-gray-600 line-clamp-4 flex-grow mb-4"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <Link
                    href={`/news-updates/${item.slug}`}
                    className="text-[#0c2340] font-bold text-sm hover:text-[#d4af37] transition-colors flex items-center gap-1"
                  >
                    Read more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
