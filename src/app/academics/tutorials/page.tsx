"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Video } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

import Link from 'next/link';

// Helper: given a YouTube URL (full or short), return the video ID
function extractYouTubeId(url: string): string {
  const reg = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
  const match = url.match(reg);
  return match ? match[1] : '';
}


export default function TutorialsPage() {
  const [items, setItems] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('tutorials')
        .select('id, title, description, video_url, image_url')
        .order('created_at', { ascending: false });
      console.log('Fetched tutorials:', data);
      if (error) {
  console.error('Supabase error:', error.message ?? error);
} else if (data) {
  setItems(data);
}
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 bg-background text-foreground">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider shadow-sm">
          Tutorials & Resources
        </span>
        <h1 className="text-4xl font-extrabold text-accent sm:text-5xl">
            Tutorials
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
          Access a curated collection of past exam questions and tutorial videos to support your studies.
        </p>
      </div>

      {loading ? (
        <p className="text-center text-neutral-600">Loading...</p>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => {
            const isYouTube = item.video_url && (item.video_url.includes('youtube.com') || item.video_url.includes('youtu.be'));
            const youtubeId = isYouTube ? extractYouTubeId(item.video_url) : null;
            const displayImage = item.image_url || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : null);

            return (
              <Link href={`/academics/tutorials/${item.id}`} key={idx} className="block group">
                <div className="site-card-light bg-white p-6 space-y-4 h-full flex flex-col transition-all duration-200 group-hover:shadow-lg">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    {item.title.toLowerCase().includes('video') ? (
                      <Video className="h-5 w-5" />
                    ) : (
                      <BookOpen className="h-5 w-5" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-accent line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-neutral-600 line-clamp-3 flex-grow">{item.description}</p>
                  
                  {displayImage ? (
                    <div className="relative mt-4 w-full h-48 overflow-hidden rounded bg-gray-100">
                      <img src={displayImage} alt={item.title} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
                      {item.video_url && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                          <div className="bg-white/90 p-3 rounded-full shadow-lg">
                            <Video className="h-6 w-6 text-accent" fill="currentColor" />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : item.video_url ? (
                    <div className="relative mt-4 w-full h-48 rounded bg-gradient-to-br from-[#0c2340] to-[#1d447a] flex items-center justify-center">
                       <div className="bg-white/20 p-4 rounded-full">
                         <Video className="h-8 w-8 text-white" fill="currentColor" />
                       </div>
                    </div>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );
}
