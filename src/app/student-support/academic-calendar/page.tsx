import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { getPageData } from '@/lib/pages';

export const dynamic = 'force-dynamic';

export default async function StudentSupportAcademicCalendarPage() {
  const data = await getPageData('academic-calendar');
  if (!data) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-xl">
          <h1 className="text-2xl font-bold mb-4">Academic Calendar</h1>
          <p className="text-neutral-600">Failed to load content. Please configure the "academic-calendar" page in the CMS.</p>
        </div>
      </section>
    );
  }
  
  const { title = 'Academic Calendar', content = '', imageUrl = '' } = data;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 bg-background text-foreground">
      <div className="text-center space-y-3">
        <span className="badge-accent">{title}</span>
        <h1 className="text-4xl font-extrabold text-primary sm:text-5xl">{title}</h1>
        {imageUrl && (
          <Image src={imageUrl} alt={title} width={800} height={400} className="mx-auto rounded-lg" />
        )}
        <div className="prose mx-auto max-w-3xl mt-8">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
