import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { NewsUpdate } from '@/types/admin';

import ShareBar from './ShareBar';
import CommentsSection from './CommentsSection';
import {
  DEFAULT_AUTHOR,
  buildExcerpt,
  categoryLabel,
  publishedDateLong,
  readingTime,
} from '../utils';

export const dynamic = 'force-dynamic';

/**
 * Helper to render news content.
 * If the content contains HTML tags, it will be rendered as raw HTML.
 * Otherwise, plain text is split into paragraphs (by newlines) and each
 * paragraph gets a margin-bottom for proper spacing.
 */
function formatContent(content: string) {
  const hasHtml = /<[a-z][\s\S]*>/i.test(content);
  if (hasHtml) {
    return <div className="break-words whitespace-normal" dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return (
    <>
      {content.split(/\r?\n/).map((para, idx) =>
        para.trim() ? (
          <p key={idx} className="mb-6">
            {para}
          </p>
        ) : (
          <br key={idx} />
        )
      )}
    </>
  );
}

interface Params {
  id: string; // slug
}

export default async function NewsDetailPage({ params }: { params: Promise<Params> }) {
  const { id: slugParam } = await params;
  const slug = decodeURIComponent(slugParam);

  const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(slug);

  const supabase = await createServerSupabaseClient();

  // Fetch current article
  let query = supabase.from('news_updates').select('*').limit(1);
  if (isUuid) {
    query = query.eq('id', slug);
  } else {
    const safeSlug = slug.trim().replace(/"/g, '');
    query = query.or(`slug.ilike."${safeSlug}",title.ilike."${safeSlug}"`);
  }

  const { data: newsItems, error } = await query;

  if (error && error.code !== 'PGRST116') {
    console.error('Supabase fetch error:', error);
  }

  const newsItem = newsItems?.[0] as NewsUpdate | undefined;

  if (!newsItem) {
    notFound();
    return null;
  }

  // Fetch all articles ordered by published_at to determine prev/next
  const { data: allArticles } = await supabase
    .from('news_updates')
    .select('id, title, category, image_url, published_at, created_at')
    .order('published_at', { ascending: false });

  const articles = (allArticles || []) as Pick<NewsUpdate, 'id' | 'title' | 'category' | 'image_url' | 'published_at' | 'created_at'>[];
  const currentIndex = articles.findIndex(a => a.id === newsItem.id);
  const prevPost = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? articles[currentIndex - 1] : null;

  const related = (articles
    .filter(a => a.id !== newsItem.id && a.category === newsItem.category)
    .slice(0, 3));

  const publishedDate = publishedDateLong(newsItem);

  return (
    <main className="flex-1 bg-gray-50 min-h-screen py-12">
      <section className="max-w-4xl mx-auto px-4 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-6">
          <Link href="/" className="hover:text-[#0c2340] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/news-updates" className="hover:text-[#0c2340] transition-colors">News & Updates</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#0c2340] truncate max-w-[200px]">{newsItem.title}</span>
        </nav>

        {/* Title, Date, Category and Share Button Container */}
        <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-2xl mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight flex-1">
              {newsItem.title}
            </h1>
            <div className="flex-shrink-0 self-start">
              <ShareBar title={newsItem.title} />
            </div>
          </div>

          <p className="text-lg text-gray-600 leading-relaxed mb-6 border-l-4 border-[#d4af37] pl-4">
            {buildExcerpt(newsItem.content, 240)}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#d4af37] bg-[#0c2340] rounded-full shadow-sm">
              {categoryLabel(newsItem.category)}
            </span>
            <time className="font-medium flex items-center gap-1" dateTime={newsItem.published_at ?? newsItem.created_at}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {publishedDate}
            </time>
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {DEFAULT_AUTHOR}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {readingTime(newsItem.content)} min read
            </span>
          </div>
        </div>

        {/* Cover Image */}
        {newsItem.image_url && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            <div className="relative w-full h-64 md:h-[450px]">
              <Image
                src={newsItem.image_url}
                alt={newsItem.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white p-6 md:p-10 shadow-sm border border-gray-100 rounded-2xl">
          <div className="prose prose-lg max-w-none text-gray-800 prose-headings:text-[#0c2340] prose-a:text-[#d4af37] hover:prose-a:text-[#0c2340] prose-img:rounded-xl leading-relaxed">
            {formatContent(newsItem.content ?? "")}
          </div>
        </div>

        {/* ── Related Stories ── */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-extrabold text-gray-900 mb-5">Related stories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/news-updates/${r.id}`}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#0c2340]/25 transition-all duration-200"
                >
                  {r.image_url ? (
                    <div className="relative w-full aspect-video bg-gray-200">
                      <Image src={r.image_url} alt={r.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="relative w-full aspect-video bg-gradient-to-br from-[#0c2340] to-[#1d447a]" />
                  )}
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#0c2340] transition-colors">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Post Navigation (Prev / Next) ── */}
        {(prevPost || nextPost) && (
          <nav
            aria-label="Post navigation"
            className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* Previous post — chronologically older */}
            {prevPost ? (
              <Link
                href={`/news-updates/${prevPost.id}`}
                className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#0c2340]/25 transition-all duration-200 text-left"
              >
                <div className="w-9 h-9 rounded-full bg-[#0c2340]/8 flex items-center justify-center shrink-0 group-hover:bg-[#0c2340] transition-colors">
                  <ChevronLeft className="w-5 h-5 text-[#0c2340] group-hover:text-white transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-0.5">Previous</p>
                  <p className="text-sm font-extrabold text-[#0c2340] leading-snug line-clamp-2 group-hover:text-[#d4af37] transition-colors">
                    {prevPost.title}
                  </p>
                  {prevPost.category && (
                    <span className="text-[10px] font-bold text-gray-400 mt-1 block">{categoryLabel(prevPost.category)}</span>
                  )}
                </div>
              </Link>
            ) : (
              <div /> /* spacer keeps Next on the right */
            )}

            {/* Next post — chronologically newer */}
            {nextPost ? (
              <Link
                href={`/news-updates/${nextPost.id}`}
                className="group flex items-center justify-end gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#0c2340]/25 transition-all duration-200 text-right sm:col-start-2"
              >
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-0.5">Next</p>
                  <p className="text-sm font-extrabold text-[#0c2340] leading-snug line-clamp-2 group-hover:text-[#d4af37] transition-colors">
                    {nextPost.title}
                  </p>
                  {nextPost.category && (
                    <span className="text-[10px] font-bold text-gray-400 mt-1 block">{categoryLabel(nextPost.category)}</span>
                  )}
                </div>
                <div className="w-9 h-9 rounded-full bg-[#0c2340]/8 flex items-center justify-center shrink-0 group-hover:bg-[#0c2340] transition-colors">
                  <ChevronRight className="w-5 h-5 text-[#0c2340] group-hover:text-white transition-colors" />
                </div>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}

        {/* ── Comments Section ── */}
        <CommentsSection articleId={newsItem.id ?? ""} />

        {/* Back to all news */}
        <div className="mt-8 text-center">
          <Link
            href="/news-updates"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0c2340] hover:text-[#d4af37] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to News & Updates
          </Link>
        </div>

      </section>
    </main>
  );
}
