'use client';

// app/admin/news/create/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TipTapEditor } from '@/components/TipTapEditor';
import { newsService } from '@/lib/supabase/admin';

export default function CreateNews() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await newsService.create({ title, slug, content });
      router.push('/admin/news');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Create News</h1>
      {error && <p className="text-red-600 mb-2">Error: {error}</p>}
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
          <TipTapEditor onChange={setContent} placeholder="Write news content..." />
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
