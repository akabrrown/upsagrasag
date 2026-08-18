/* src/app/news-updates/NewsCard.tsx */
"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import type { NewsUpdate } from "@/types/admin";
import {
  DEFAULT_AUTHOR,
  buildExcerpt,
  categoryLabel,
  publishedDate,
  readingTime,
} from "./utils";

export default function NewsCard({ item }: { item: NewsUpdate }) {
  const href = `/news-updates/${item.id ?? item.slug}`;

  return (
    <Link
      href={href}
      className="group flex flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c2340]"
    >
      <div className="relative w-full aspect-[16/10] bg-gray-200 overflow-hidden">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c2340] to-[#1d447a] flex items-center justify-center p-6">
            <span className="text-white text-lg font-bold opacity-80 text-center line-clamp-3">
              {item.title}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#d4af37] bg-[#0c2340] rounded-full">
            {categoryLabel(item.category)}
          </span>
          <time className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {publishedDate(item)}
          </time>
        </div>

        <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2 line-clamp-3 group-hover:text-[#0c2340] transition-colors">
          {item.title}
        </h3>

        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
          {buildExcerpt(item.content, 200)}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
            <span className="truncate font-medium">{DEFAULT_AUTHOR}</span>
            <span className="flex items-center gap-1 shrink-0">
              <Clock className="h-3.5 w-3.5" />
              {readingTime(item.content)} min read
            </span>
          </div>
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#0c2340] group-hover:text-[#d4af37] transition-colors">
            Read story
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
