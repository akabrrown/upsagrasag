"use client";
import React, { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';

type GalleryImage = {
  url: string;
  title: string;
  description?: string;
  uploaded_at: string;
};

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    const fileInput = form.querySelector('input[name="image"]') as HTMLInputElement | null;
    if (!fileInput) return;
    const titleInput = form.querySelector('input[name="title"]') as HTMLInputElement | null;
    const descInput = form.querySelector('textarea[name="description"]') as HTMLTextAreaElement | null;
    const files = fileInput.files ? Array.from(fileInput.files) : [];
    if (files.length === 0) return;
    // Ensure title and description inputs exist
    const titleValue = titleInput ? titleInput.value : null;
    const descValue = descInput ? descInput.value : null;

    setLoading(true);
    try {
      // 1. Upload all files directly to Cloudinary from the browser
      const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'grasag';
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dldph7uzu';

      const uploadedUrls: string[] = [];
      for (const file of files) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('upload_preset', preset);

        const resourceType = file.type.startsWith('video') ? 'video' : 'image';
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

        const res = await fetch(url, { method: 'POST', body: uploadData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || 'Upload to Cloudinary failed');
        
        uploadedUrls.push(data.secure_url);
      }

      // 2. Submit the uploaded URLs and metadata to the Next.js API
      const payload = uploadedUrls.map((url) => ({
        url,
        title: titleValue || 'Untitled',
        description: descValue || null,
      }));

      const apiRes = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: payload }),
      });

      if (!apiRes.ok) throw new Error('Database insert failed');

      await fetchImages();
      form.reset();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Gallery</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleUpload} className="mb-8 space-y-4 border p-4 rounded-lg">
        <h2 className="text-xl font-semibold">Upload New Image</h2>
        <div>
          <label className="block mb-1">Title (Optional)</label>
          <input type="text" name="title" className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block mb-1">Description (Optional)</label>
          <textarea name="description" rows={3} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block mb-1">Image File</label>
          <input type="file" name="image" accept="image/*" multiple required />
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
              <Image src={img.url} alt={img.title || 'Gallery image'} width={400} height={300} className="object-cover w-full h-48" />
              <div className="p-2">
                <h3 className="font-semibold">{img.title || 'Untitled'}</h3>
                <p className="text-sm text-gray-500">{new Date(img.uploaded_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
