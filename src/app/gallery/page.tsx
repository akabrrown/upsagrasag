'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ArrowRight } from 'lucide-react';
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selected]);

  return (
    <div className="min-h-screen bg-white text-neutral-900 pb-24 selection:bg-[#001a54] selection:text-white">
      {/* Editorial Hero Section - Zero Blur, High Contrast */}
      <section className="pt-32 pb-16 px-4 md:px-8 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="inline-block px-3 py-1 bg-neutral-900 text-white text-xs font-medium mb-6">
              Archive
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#001a54] max-w-2xl">
              Moments that define our community
            </h1>
          </div>
          <p className="text-lg text-neutral-600 max-w-md leading-relaxed md:pb-2">
            A curated visual record of events, initiatives, and the people driving GRASAG-UPSA forward.
          </p>
        </div>
      </section>

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        {loading ? (
          <div className="flex flex-col animate-pulse space-y-8">
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-neutral-100 mb-4 h-64 w-full"></div>
              ))}
            </div>
          </div>
        ) : images.length === 0 ? (
          <div className="py-24 border border-neutral-200 p-8 flex flex-col items-center text-center">
            <h3 className="text-xl font-bold text-neutral-900 mb-2">The archive is empty</h3>
            <p className="text-neutral-500 max-w-md">
              We haven't uploaded any moments yet. Check back soon for visual updates from our latest events.
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {images.map((img, idx) => {
              const hasTitle = img.title && img.title.trim().toLowerCase() !== 'untitled';
              
              return (
                <div
                  key={img.url + idx}
                  className="group relative cursor-pointer break-inside-avoid overflow-hidden bg-neutral-100"
                  onClick={() => setSelected(img)}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <Image
                    src={img.url}
                    alt={hasTitle ? img.title : 'Gallery image'}
                    width={600}
                    height={800}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    unoptimized
                  />
                  
                  {/* Subtle reveal on hover - No blur, no shadows */}
                  <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/10 transition-colors duration-300">
                    <div className="absolute top-4 right-4 bg-white text-[#001a54] w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
                      <ArrowRight className="w-4 h-4 -rotate-45" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Strict Minimalist Modal - True Black, No Blur */}
      {selected && (
        <div 
          className="fixed inset-0 z-50 flex flex-col bg-black animate-in fade-in duration-200"
          onClick={() => setSelected(null)}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 bg-black w-full" onClick={(e) => e.stopPropagation()}>
            <div className="text-white">
              {selected.title && selected.title.trim().toLowerCase() !== 'untitled' && (
                <h2 className="text-lg font-medium tracking-tight">
                  {selected.title}
                </h2>
              )}
            </div>
            <button 
              className="text-neutral-400 hover:text-white transition-colors p-2"
              onClick={() => setSelected(null)}
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Image Container */}
          <div 
            className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden relative"
            onClick={() => setSelected(null)}
          >
            <Image 
              src={selected.url} 
              alt={selected.title || 'Enlarged image'} 
              width={1600} 
              height={1200} 
              className="max-w-full max-h-full w-auto h-auto object-contain select-none animate-in zoom-in-95 duration-300" 
              unoptimized
              draggable={false}
            />
          </div>

          {/* Footer Bar for Description (only if it exists) */}
          {selected.description && (
            <div className="border-t border-white/10 p-4 md:p-6 bg-black" onClick={(e) => e.stopPropagation()}>
              <p className="text-neutral-400 text-sm max-w-4xl mx-auto leading-relaxed">
                {selected.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
