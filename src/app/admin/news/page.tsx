// app/admin/news/page.tsx
import React from 'react';
import { CrudTable } from '@/components/admin/CrudTable';
import { getNews } from '@/lib/supabase/admin';
import type { News, ColumnConfig } from '@/types/admin';

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  const news = await getNews();

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
      <h2 className="text-xl font-semibold mb-4">News</h2>
      <CrudTable data={news} columns={columns} entity="news" />
    </section>
  );
}
