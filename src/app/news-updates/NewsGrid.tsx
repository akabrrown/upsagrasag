"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NewsUpdate } from "@/types/admin";
import NewsCard from "./NewsCard";

export default function NewsGrid({ news }: { news: NewsUpdate[] }) {
  const [activeCat, setActiveCat] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    news.forEach((n) => { if (n.category) set.add(n.category); });
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
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  );
}
