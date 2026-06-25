/* src/app/news-updates/NewsCard.tsx */
"use client";

import Image from "next/image";
import Link from "next/link";
import type { NewsUpdate } from "@/types/admin";

export default function NewsCard({ item }: { item: NewsUpdate }) {
  const contentClass = "prose prose-sm prose-blue max-w-none text-gray-600 break-words whitespace-pre-wrap line-clamp-4";

  return (
    <article className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {item.image_url ? (
        <div className="relative w-full h-56 bg-gray-200">
          <Image src={item.image_url} alt={item.title} fill className="object-cover" />
        </div>
      ) : (
        <div className="relative w-full h-56 bg-gradient-to-br from-[#0c2340] to-[#1d447a] flex items-center justify-center p-6">
          <h3 className="text-white text-xl font-bold opacity-80 text-center">{item.title}</h3>
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
              year: "numeric"
            })}
          </time>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
          {item.title}
        </h2>

        <div className={contentClass}>
          {(() => {
            const cleanContent = (item.content || "")
              .replace(/\u00a0/g, " ")
              .replace(/&nbsp;/g, " ");
            
            return cleanContent.trim().startsWith('<') ? (
              <div dangerouslySetInnerHTML={{ __html: cleanContent }} />
            ) : (
              cleanContent
                .split('\n')
                .filter(Boolean)
                .map((para, idx) => (
                  <p key={idx} className="mb-2">
                    {para}
                  </p>
                ))
            );
          })()}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <Link
            href={`/news-updates/${item.id ?? item.slug}`}
            className="text-[#0c2340] font-bold text-sm hover:text-[#d4af37] transition-colors flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read more
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
