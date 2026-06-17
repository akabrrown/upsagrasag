import React from 'react';
import { newsService } from '@/lib/supabase/admin';
import type { News } from '@/types/admin';

export const dynamic = 'force-dynamic';

export default async function NewsUpdatesPage() {
  const news: News[] = await newsService.list();

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center mb-8">News & Updates</h1>
        <p className="text-center text-lg text-neutral-600 mb-12">Keeps students informed and documents activities.</p>
        <div className="space-y-6">
          {news.map((item) => (
            <article key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold text-primary mb-2">{item.title}</h2>
              <p className="text-sm text-neutral-500 mb-2">{new Date(item.published_at ?? '').toLocaleDateString()}</p>
              <p className="text-neutral-700">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
