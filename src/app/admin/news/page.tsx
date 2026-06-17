// app/admin/news/page.tsx
import React from 'react';
import { CrudTable } from '@/components/admin/CrudTable';
import { newsService } from '@/lib/supabase/admin';
import type { News, ColumnConfig } from '@/types/admin';

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  const news = await newsService.list();

  const columns: ColumnConfig<News>[] = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'slug', label: 'Slug' },
    { key: 'draft', label: 'Draft' },
  ];

  if (!news) return <p className="text-center text-gray-500">Loading...</p>;
  if (news.length === 0) return <p className="text-center text-gray-500">No news items.</p>;

  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-4">News & Updates</h1>
      <CrudTable<News & { id: string }> 
        data={news as (News & { id: string })[]} 
        columns={columns as any} 
        entity="news" 
      />
    </section>
  );
}
