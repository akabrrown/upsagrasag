"use client";
import React, { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type GalleryImage = {
  url: string;
  title: string;
  description?: string;
  uploaded_at: string;
};

export default function AdminGalleryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAdmin = session?.user?.role === 'admin';

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect non‑admin users
  useEffect(() => {
    if (status === 'loading') return;
    if (!isAdmin) router.replace('/about/gallery');
  }, [status, isAdmin, router]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery');
      if (!res.ok) throw new Error('Failed to fetch images');
      const data = await res.json();
      setImages(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.querySelector('input[name="image"]') as HTMLInputElement;
    const titleInput = form.querySelector('input[name="title"]') as HTMLInputElement;
    const descInput = form.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
    if (!fileInput.files?.[0]) return;
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('title', titleInput.value);
    formData.append('description', descInput.value);
    setLoading(true);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      await fetchImages();
      form.reset();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') return <p className="text-center py-4">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Gallery</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleUpload} className="mb-8 space-y-4 border p-4 rounded-lg">
        <h2 className="text-xl font-semibold">Upload New Image</h2>
        <div>
          <label className="block mb-1">Title</label>
          <input type="text" name="title" required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea name="description" rows={3} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block mb-1">Image File</label>
          <input type="file" name="image" accept="image/*" required />
        </div>
        <button type="submit" disabled={loading} className="bg-[#B8860B] hover:bg-[#9A7C1C] text-white py-2 px-4 rounded">
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {loading && images.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.url} className="border rounded overflow-hidden">
              <Image src={img.url} alt={img.title} width={400} height={300} className="object-cover w-full h-48" />
              <div className="p-2">
                <h3 className="font-semibold">{img.title}</h3>
                <p className="text-sm text-gray-500">{new Date(img.uploaded_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
