'use client';

// app/admin/events/[id]/page.tsx
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { eventService } from '@/lib/supabase/admin';
import type { Event } from '@/types/admin';

export default function EditEvent() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [event, setEvent] = useState<Event | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDt, setStartDt] = useState('');
  const [endDt, setEndDt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventService.get(Number(id));
        if (!data) throw new Error('Not found');
        setEvent(data);
        setTitle(data.title);
        setDescription(data.description ?? '');
        setStartDt(data.startDt);
        setEndDt(data.endDt);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload: Partial<Event> = { title, description, startDt, endDt };
      await eventService.update(Number(id), payload);
      router.push('/admin/events');
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
      <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
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
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Start Date/Time</label>
          <input
            type="datetime-local"
            value={startDt}
            onChange={(e) => setStartDt(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">End Date/Time</label>
          <input
            type="datetime-local"
            value={endDt}
            onChange={(e) => setEndDt(e.target.value)}
            required
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
