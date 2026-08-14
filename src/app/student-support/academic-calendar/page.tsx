import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-dynamic';

export default async function StudentSupportAcademicCalendarPage() {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/admin/academic-calendar`);
  const data = await res.json();
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
