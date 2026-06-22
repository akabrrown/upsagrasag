import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Video, BookOpen } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function extractYouTubeId(url: string): string {
  const reg = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
  const match = url.match(reg);
  return match ? match[1] : '';
}

interface Params {
  id: string;
}

export default async function TutorialDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  const supabase = await createServerSupabaseClient();
  const { data: tutorial, error } = await supabase
    .from('tutorials')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !tutorial) {
    console.error('Tutorial fetch error:', error?.message);
    notFound();
    return null;
  }

  const isYouTube = tutorial.video_url && (tutorial.video_url.includes('youtube.com') || tutorial.video_url.includes('youtu.be'));
  const youtubeId = isYouTube ? extractYouTubeId(tutorial.video_url) : null;
  const displayImage = tutorial.image_url || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link 
          href="/academics/tutorials" 
          className="inline-flex items-center text-sm font-medium text-accent hover:text-[#d4af37] transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Tutorials
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Video Player Area */}
          <div className="bg-black w-full aspect-video flex items-center justify-center relative">
            {tutorial.video_url ? (
              isYouTube ? (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                  title={tutorial.title}
                  className="w-full h-full absolute inset-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video 
                  src={tutorial.video_url} 
                  controls 
                  autoPlay
                  className="w-full h-full absolute inset-0 object-contain" 
                  poster={displayImage || undefined} 
                />
              )
            ) : displayImage ? (
              <img src={displayImage} alt={tutorial.title} className="w-full h-full absolute inset-0 object-cover" />
            ) : (
              <div className="text-white opacity-50 flex flex-col items-center">
                <BookOpen className="h-16 w-16 mb-4" />
                <p>No video available for this tutorial</p>
              </div>
            )}
          </div>

          {/* Details Area */}
          <div className="p-8 space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{tutorial.title}</h1>
            <div className="flex items-center text-sm text-slate-500 font-medium">
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full flex items-center gap-2">
                {tutorial.title.toLowerCase().includes('video') || tutorial.video_url ? (
                  <Video className="w-4 h-4" />
                ) : (
                  <BookOpen className="w-4 h-4" />
                )}
                Tutorial Session
              </span>
            </div>
            
            {tutorial.description && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">About this tutorial</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {tutorial.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
