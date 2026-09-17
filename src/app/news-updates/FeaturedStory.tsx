/* src/app/news-updates/FeaturedStory.tsx */
"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import type { NewsUpdate } from "@/types/admin";
import {
  DEFAULT_AUTHOR,
  buildExcerpt,
  categoryLabel,
  publishedDateLong,
  readingTime,
} from "./utils";

export default function FeaturedStory({ item }: { item: NewsUpdate }) {
  const href = `/news-updates/${item.id ?? item.slug}`;

  return (
    <section aria-label="Featured story" className="mb-12">
      <p className="text-xs font-extrabold text-[#0c2340] uppercase tracking-[0.2em] mb-4">
        <span className="text-[#d4af37]">★</span> Featured Story
      </p>
      <Link
        href={href}
        className="group flex flex-col lg:flex-row bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c2340]"
      >
        <div className="relative w-full lg:w-3/5 aspect-[16/10] lg:aspect-auto lg:min-h-[380px] bg-gray-200 overflow-hidden">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0c2340] to-[#1d447a] flex items-center justify-center p-8">
              <span className="text-white text-2xl font-bold opacity-80 text-center line-clamp-4">
                {item.title}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#d4af37] bg-[#0c2340] rounded-full">
              {categoryLabel(item.category)}
            </span>
            <time className="text-sm font-semibold text-gray-500">
              {publishedDateLong(item)}
            </time>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              {readingTime(item.content)} min read
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-4 line-clamp-3 group-hover:text-[#0c2340] transition-colors">
            {item.title}
          </h2>

          <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
            {buildExcerpt(item.content, 260)}
          </p>

          <div className="mt-auto pt-4 border-t border-gray-100 text-sm text-gray-500">
            <span className="font-medium">By {DEFAULT_AUTHOR}</span>
          </div>

          <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0c2340] group-hover:text-[#d4af37] transition-colors w-fit">
            Read the full story
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </Link>
    </section>
  );
}