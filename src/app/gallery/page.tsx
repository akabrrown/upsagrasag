"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import './gallery.css';

interface GalleryImage {
  url: string;
  title: string;
  description?: string;
  uploaded_at: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/api/gallery');
        if (!res.ok) throw new Error('Failed to fetch gallery');
        const data = await res.json();
        setImages(data);
      } catch (e: any) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (loading) return <p className="text-center py-8">Loading gallery...</p>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Gallery</h1>
      {images.length === 0 ? (
        <p className="text-center">No images available.</p>
      ) : (
        <div className="gallery-grid">
          {images.map((img) => (
            <div
              key={img.url}
              className="gallery-item"
              onClick={() => setSelected(img)}
            >
              <Image
                src={img.url}
                alt={img.title}
                width={400}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="gallery-modal" onClick={() => setSelected(null)}>
          <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="gallery-modal-close" onClick={() => setSelected(null)}>&times;</button>
            <Image src={selected.url} alt={selected.title} width={1200} height={800} className="w-full h-auto" />
            {selected.title && selected.title.trim().toLowerCase() !== 'untitled' && <h2 className="p-4 text-xl font-semibold">{selected.title}</h2>}
            {selected.description && <p className="p-4 text-gray-600">{selected.description}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
