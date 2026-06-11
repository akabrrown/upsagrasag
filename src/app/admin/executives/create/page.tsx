// src/app/admin/executives/create/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { executiveService } from '@/lib/supabase/admin';

export default function CreateExecutive() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await executiveService.create({
        name,
        title,
        bio,
        photo_url: photoUrl,
        display_order: displayOrder,
      });
      router.push('/admin/executives');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Create Executive</h1>
      {error && <p className="text-red-600 mb-2">Error: {error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
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
          <label className="block mb-1 font-medium">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Photo URL</label>
          <input
            type="url"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            required
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

// src/app/admin/executives/[id]/page.tsx
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { executiveService } from '@/lib/supabase/admin';
import type { Executive } from '@/types/admin';

export default function EditExecutive() {
  const router = useRouter();
  const params = useSearchParams();
  const id = Number(params.get('id'));
  const [executive, setExecutive] = useState<Executive | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    executiveService.get(id).then(setExecutive).catch((e) => setError(e.message));
  }, [id]);

  const handleChange = (field: keyof Executive, value: any) => {
    if (!executive) return;
    setExecutive({ ...executive, [field]: value } as Executive);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!executive) return;
    setSubmitting(true);
    setError(null);
    try {
      const { id: execId, ...payload } = executive;
      await executiveService.update(execId as number, payload);
      router.push('/admin/executives');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!executive) return <p className="p-6">Loading…</p>;

  return (
    <section className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Edit Executive</h1>
      {error && <p className="text-red-600 mb-2">Error: {error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            value={executive.name ?? ''}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={executive.title ?? ''}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Bio</label>
          <textarea
            value={executive.bio ?? ''}
            onChange={(e) => handleChange('bio', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Photo URL</label>
          <input
            type="url"
            value={executive.photo_url ?? ''}
            onChange={(e) => handleChange('photo_url', e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Display Order</label>
          <input
            type="number"
            value={executive.display_order ?? 0}
            onChange={(e) => handleChange('display_order', parseInt(e.target.value, 10) || 0)}
            min={0}
            className="w-24 border rounded p-2"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {submitting ? 'Saving…' : 'Update'}
        </button>
      </form>
    </section>
  );
}

// src/app/api/admin/executives/route.ts
import { NextResponse } from 'next/server';
import { executiveService } from '@/lib/supabase/admin';
import { executiveSchema } from '@/types/admin';

export async function GET() {
  const data = await executiveService.list();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = executiveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }
  const result = await executiveService.create(parsed.data);
  return NextResponse.json(result, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...rest } = body;
  if (typeof id !== 'number') {
    return NextResponse.json({ error: 'Missing numeric id' }, { status: 400 });
  }
  const parsed = executiveSchema.omit({ id: true }).safeParse(rest);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }
  const updated = await executiveService.update(id, parsed.data);
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  if (typeof id !== 'number') {
    return NextResponse.json({ error: 'Missing numeric id' }, { status: 400 });
  }
  await executiveService.delete(id);
  return NextResponse.json({ success: true });
}

// src/app/admin/opportunities/create/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { opportunityService } from '@/lib/supabase/admin';
import { uploadImage } from '@/lib/cloudinary';

export default function CreateOpportunity() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('internship');
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
        const buffer = await imageFile.arrayBuffer();
        imageUrl = (await uploadImage(Buffer.from(buffer), 'opportunities')) as string;
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
            onChange={(e) => setType(e.target.value)}
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

// src/app/api/admin/opportunities/route.ts
import { NextResponse } from 'next/server';
import { opportunityService } from '@/lib/supabase/admin';
import { opportunitySchema } from '@/types/admin';

export async function GET() {
  const data = await opportunityService.list();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = opportunitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }
  const result = await opportunityService.create(parsed.data);
  return NextResponse.json(result, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...rest } = body;
  if (typeof id !== 'number') {
    return NextResponse.json({ error: 'Missing numeric id' }, { status: 400 });
  }
  const parsed = opportunitySchema.omit({ id: true }).safeParse(rest);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }
  const updated = await opportunityService.update(id, parsed.data);
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  if (typeof id !== 'number') {
    return NextResponse.json({ error: 'Missing numeric id' }, { status: 400 });
  }
  await opportunityService.delete(id);
  return NextResponse.json({ success: true });
}
