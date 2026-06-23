import React from 'react';
import { Share } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { NewsUpdate } from '@/types/admin';

import ShareButton from './ShareButton';

export const dynamic = 'force-dynamic';

/**
 * Helper to render news content.
 * If the content contains HTML tags, it will be rendered as raw HTML.
 * Otherwise, plain text is split into paragraphs (by newlines) and each
 * paragraph gets a margin‑bottom for proper spacing.
 */
function formatContent(content: string) {
  const hasHtml = /<[a-z][\s\S]*>/i.test(content);
  if (hasHtml) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
  // Split on single line breaks – preserve empty lines as <br/>
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
  console.log('--- DEBUG ---');
  console.log('slugParam:', slugParam);
  console.log('decoded slug:', slug);

  const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(slug);

  const supabase = await createServerSupabaseClient();
  let query = supabase.from('news_updates').select('*').limit(1);
  if (isUuid) {
    query = query.eq('id', slug);
  } else {
    const safeSlug = slug.trim().replace(/"/g, ''); // remove quotes to avoid syntax errors
    query = query.or(`slug.ilike."${safeSlug}",title.ilike."${safeSlug}"`);
  }

  const { data: newsItems, error } = await query;

  console.log('query error:', error);
  console.log('newsItems count:', newsItems?.length);
  console.log('--- END DEBUG ---');

  if (error && error.code !== 'PGRST116') {
    console.error('Supabase fetch error:', error);
  }

  const newsItem = newsItems?.[0];

  if (!newsItem) {
    notFound();
    return null;
  }

  return (
    <main className="flex-1 bg-gray-50 min-h-screen py-12">
      <section className="max-w-4xl mx-auto px-4 lg:px-8">
        
        {/* Title, Date, Category and Share Button Container */}
        <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-2xl mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 uppercase leading-tight flex-1">
              {newsItem.title}
            </h1>
            <div className="flex-shrink-0 self-start">
              <ShareButton title={newsItem.title} text={newsItem.content.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...'} />
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#d4af37] bg-[#0c2340] rounded-full shadow-sm">
              {newsItem.category}
            </span>
            <time className="font-medium flex items-center gap-1" dateTime={newsItem.published_at ?? newsItem.created_at}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(newsItem.published_at ?? newsItem.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>
        </div>

        {/* Cover Image */}
        {newsItem.image_url && (
          <div className="relative w-full h-64 md:h-[450px] mb-10 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            <Image src={newsItem.image_url} alt={newsItem.title} fill className="object-cover" />
          </div>
        )}

        {/* Content */}
        <div className="bg-white p-6 md:p-10 shadow-sm border border-gray-100 rounded-2xl">
          <div className="prose prose-lg max-w-none text-gray-800 prose-headings:text-[#0c2340] prose-a:text-[#d4af37] hover:prose-a:text-[#0c2340] prose-img:rounded-xl leading-relaxed">
            {formatContent(newsItem.content)}
          </div>
        </div>

      </section>
    </main>
  );
}
