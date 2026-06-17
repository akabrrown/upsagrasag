'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { opportunityService } from '@/lib/supabase/admin';

export default function CreateOpportunity() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'internship' | 'full-time' | 'contract'>('internship');
  const [location, setLocation] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [deadline, setDeadline] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('folder', 'opportunities');
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (!uploadRes.ok) throw new Error('Failed to upload image');
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }
      await opportunityService.create({
        title,
        description,
        type,
        location,
        apply_url: applyUrl,
        image_url: imageUrl,
        deadline,
        display_order: displayOrder,
        is_active: true,
      });
      router.push('/admin/opportunities');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Create Opportunity</h1>
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
          <label className="block mb-1 font-medium">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'internship' | 'full-time' | 'contract')}
            className="w-full border rounded p-2"
          >
            <option value="internship">Internship</option>
            <option value="full-time">Full‑time</option>
            <option value="contract">Contract</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Apply URL</label>
          <input
            type="url"
            value={applyUrl}
            onChange={(e) => setApplyUrl(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Display Order</label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
            min={0}
            className="w-24 border rounded p-2"
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
