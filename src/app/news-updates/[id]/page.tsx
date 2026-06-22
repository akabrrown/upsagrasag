import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { NewsUpdate } from '@/types/admin';

export const dynamic = 'force-dynamic';

interface Params {
  id: string; // slug
}

export default async function NewsDetailPage({ params }: { params: Promise<Params> }) {
  const { id: slugParam } = await params;
  const slug = decodeURIComponent(slugParam);
  console.log('--- DEBUG ---');
  console.log('slugParam:', slugParam);
  console.log('decoded slug:', slug);

  const supabase = await createServerSupabaseClient();
  const { data: newsItems, error } = await supabase
    .from('news_updates')
    .select('*')
    .or(`slug.ilike.${slug.trim()},title.ilike.${slug.trim()}`)
    .limit(1);

  console.log('query error:', error);
  console.log('newsItems count:', newsItems?.length);
  console.log('--- END DEBUG ---');

  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message);
  }

  const newsItem = newsItems?.[0];

  if (!newsItem) {
    notFound();
    return null;
  }

  return (
    <main className="flex-1 bg-gray-50 min-h-screen py-12">
      <section className="max-w-4xl mx-auto px-4 lg:px-8">
        {newsItem.image_url && (
          <div className="relative w-full h-64 md:h-96 mb-8">
            <Image src={newsItem.image_url} alt={newsItem.title} fill className="object-cover rounded-lg" />
          </div>
        )}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{newsItem.title}</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#d4af37] bg-[#0c2340] rounded-full">
            {newsItem.category}
          </span>
          <time dateTime={newsItem.published_at ?? newsItem.created_at}>
            {new Date(newsItem.published_at ?? newsItem.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </time>
        </div>
        <div
          className="prose prose-lg max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: newsItem.content }}
        />
      </section>
    </main>
  );
}
