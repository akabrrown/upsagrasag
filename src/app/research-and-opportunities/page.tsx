import React from 'react';
import { opportunityService } from '@/lib/supabase/admin';
import type { Opportunity } from '@/types/admin';

export const dynamic = 'force-dynamic';

export default async function ResearchOpportunitiesPage() {
  const opportunities: Opportunity[] = await opportunityService.list();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 bg-background text-foreground">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider shadow-sm">
          Research & Opportunities
        </span>
        <h1 className="text-4xl font-extrabold text-primary sm:text-5xl">
          Scholarships, Grants, Calls, Publications, Career Opportunities
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
          Shares academic and professional opportunities for graduate students.
        </p>
      </div>

      {/* Opportunities List */}
      <section className="space-y-8">
        {opportunities.map((opp) => (
          <article key={opp.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-bold text-primary mb-2">{opp.title}</h2>
            <p className="text-sm text-neutral-500 mb-2">
              {new Date(opp.start_date ?? '').toLocaleDateString()} - {new Date(opp.end_date ?? '').toLocaleDateString()}
            </p>
            <p className="text-neutral-700" dangerouslySetInnerHTML={{ __html: opp.description ?? '' }} />
          </article>
        ))}
      </section>
    </div>
  );
}
