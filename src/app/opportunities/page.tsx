import React from 'react';
import { getOpportunities } from '@/lib/services/opportunities';
import type { Opportunity } from '@/types/admin';
import { Briefcase, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OpportunitiesPage() {
  const opportunities: Opportunity[] = await getOpportunities();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 bg-background text-foreground">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="badge-accent">
          Careers Board
        </span>
        <h1 className="text-4xl font-extrabold text-primary sm:text-5xl">
          Graduate Opportunities
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
          Connecting postgraduates to corporate graduate schemes, internships, academic assistantships, and international fellowship.
        </p>
      </div>

      {/* Grid of opportunities */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-accent" /> Active Openings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.map((opp) => (
            <article key={opp.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white site-card-light">
              <div className="flex justify-between items-start gap-4 mb-2">
                <span className="badge-accent py-0.5 px-2 text-[10px]">
                  {opp.category}
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
              <h3 className="font-bold text-primary text-base mb-1">
                {opp.title}
              </h3>
              <p className="text-sm text-neutral-500 mb-2">
                {opp.company} • {opp.type}
              </p>
              {(opp as any).description && (
                <p className="text-neutral-700 text-sm" dangerouslySetInnerHTML={{ __html: (opp as any).description }} />
              )}
              {opp.apply_url && (
                <div className="mt-4 pt-4 border-t border-neutral-100 flex justify-end">
                  <a href={opp.apply_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline">
                    Apply Now →
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
