import React from 'react';

export const dynamic = 'force-dynamic';

export default async function NewsUpdatesPage() {
  const categories = [
    'View Notices',
    'View Press Releases',
    'Read Reports',
    'View Accountability Updates',
    'View Gallery',
  ];

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center mb-8">News & Updates</h1>
        <p className="text-center text-lg text-neutral-600 mb-12">Keeps students informed and documents activities.</p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {categories.map((c) => (
            <button key={c} className="inline-block bg-primary text-white px-5 py-2 rounded-md hover:bg-primary/90 transition">
              {c}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
