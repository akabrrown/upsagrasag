import React from 'react';
import { getResearchOpportunities } from '@/lib/services/researchOpportunities';
import type { ResearchOpportunity } from '@/types/admin';

export const dynamic = 'force-dynamic';

export default async function ResearchOpportunitiesPage() {
  const opportunities: ResearchOpportunity[] = await getResearchOpportunities();

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
          <article key={opp.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white site-card-light">
            <div className="flex justify-between items-start gap-4 mb-2">
              <span className="badge-accent py-0.5 px-2 text-[10px]">
                {opp.sub_type}
              </span>
              {(opp as any).deadline && (
                <span className="text-xs text-neutral-400">
                  Deadline: {(() => {
                    const parsed = Date.parse((opp as any).deadline);
                    return isNaN(parsed) ? (opp as any).deadline : new Date(parsed).toLocaleDateString();
                  })()}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-primary mb-1">{opp.title}</h2>
            {/* No company/type for research opportunities */}
            {(opp as any).description && (
              <p className="text-neutral-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: (opp as any).description }} />
            )}
            {opp.link_url && (
              <div className="mt-4 pt-4 border-t border-neutral-100 flex justify-end">
                <a
                  href={opp.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
                >
                  Apply Now →
                </a>
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
