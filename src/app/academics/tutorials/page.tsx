"use client";
import React, { useEffect, useState } from 'react';
import { BookOpen, Video, Layers } from 'lucide-react';
import { createClient } from '@/lib/supabase';

export default function TutorialsPage() {
  const [items, setItems] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('page_contents')
        .select('title, body, image_url')
        .eq('slug', 'tutorials');
      if (!error && data) setItems(data);
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
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item, idx) => (
            <div key={idx} className="site-card-light bg-white p-6 space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                {item.title.toLowerCase().includes('video') ? (
                  <Video className="h-5 w-5" />
                ) : (
                  <BookOpen className="h-5 w-5" />
                )}
              </div>
              <h3 className="text-lg font-bold text-accent">{item.title}</h3>
              <p className="text-sm text-neutral-600" dangerouslySetInnerHTML={{ __html: item.body }} />
              {item.image_url && (
                <img src={item.image_url} alt={item.title} className="mt-2 rounded" />
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
