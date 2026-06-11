import React from 'react';

export default function ResearchOpportunitiesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 bg-background text-foreground">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider shadow-sm">
          Research &amp; Opportunities
        </span>
        <h1 className="text-4xl font-extrabold text-primary sm:text-5xl">
          Scholarships, Grants, Calls, Publications, Career Opportunities
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
          Shares academic and professional opportunities for graduate students.
        </p>
      </div>

      {/* Content Sections */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-primary">Scholarships &amp; Grants</h2>
        <p className="text-sm text-neutral-600">
          Explore a curated list of funding opportunities, scholarship programs, and research grants available to graduate students at UPSA and beyond.
        </p>
        {/* Placeholder for dynamic list – can be populated via Supabase or CMS */}
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-primary">Calls for Proposals &amp; Papers</h2>
        <p className="text-sm text-neutral-600">
          Stay updated on upcoming conference calls, journal special issues, and competition announcements.
        </p>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-primary">Publications</h2>
        <p className="text-sm text-neutral-600">
          Access recent publications, theses, and research outputs from GRASAG members.
        </p>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-semibold text-primary">Career Opportunities</h2>
        <p className="text-sm text-neutral-600">
          Browse internship programs, job listings, and fellowship opportunities tailored for graduate students.
        </p>
      </section>
    </div>
  );
}
