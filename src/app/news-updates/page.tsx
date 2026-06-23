import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { NewsUpdate } from '@/types/admin';

export const dynamic = 'force-dynamic';

import NewsGrid from './NewsGrid';
export default async function NewsUpdatesPage() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('news_updates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch news:', error);
  }
  const news: NewsUpdate[] = data || [];

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">News & Updates</h1>
          <p className="text-lg md:text-xl text-gray-600">
            Stay informed with the latest announcements, articles, and activities from GRASAG‑UPSA.
          </p>
        </div>
        {/* Filtering UI and grid */}
        <NewsGrid news={news} />
      </section>
    </main>
  );
}
