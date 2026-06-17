'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { resourceService } from '@/lib/supabase/admin';
import type { Resource } from '@/types/admin';

export default function CreateResource() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [fileType, setFileType] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload: Partial<Resource> = {
        title,
        file_type: fileType,
        description,
        display_order: displayOrder,
      };
      await resourceService.create(payload);
      router.push('/admin/resources');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Create Resource</h1>
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
          <label className="block mb-1 font-medium">File Type</label>
          <input
            type="text"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Display Order</label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
            className="w-full border rounded p-2"
          />
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
