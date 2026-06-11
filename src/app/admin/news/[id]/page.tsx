// app/admin/news/[id]/page.tsx
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TipTapEditor } from '@/components/TipTapEditor';
import { newsService } from '@/lib/supabase/admin';
import type { News } from '@/types/admin';

export default function EditNews() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [news, setNews] = useState<News | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsService.get(Number(id));
        if (!data) throw new Error('Not found');
        setNews(data);
        setTitle(data.title);
        setSlug(data.slug);
        setContent(data.content);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await newsService.update(Number(id), { title, slug, content });
      router.push('/admin/news');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-4">Loading…</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  return (
    <section className="bg-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Edit News</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Content</label>
          <TipTapEditor content={content} onChange={setContent} />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {submitting ? 'Saving…' : 'Save'}
        </button>
      </form>
    </section>
  );
}
