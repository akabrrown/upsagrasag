import React from 'react';
import { Briefcase, ArrowUpRight } from 'lucide-react';

export default function OpportunitiesPage() {
  const jobs = [
    { title: 'Graduate Trainee Programme', company: 'KPMG Ghana', type: 'Full-time', category: 'Accounting & Finance' },
    { title: 'Research Assistant (Postgrad)', company: 'UPSA School of Graduate Studies', type: 'Contract', category: 'Research' },
    { title: 'Internal Audit Intern', company: 'PwC Ghana', type: 'Internship', category: 'Auditing' },
    { title: 'Corporate Relations Coordinator', company: 'Deloitte', type: 'Full-time', category: 'Management' }
  ];

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
          Connecting postgraduates to corporate graduate schemes, internships, academic assistantships, and international fellowships.
        </p>
      </div>

      {/* Grid of opportunities */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-accent" /> Active Openings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.title}
              className="group site-card-light bg-white flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="badge-accent py-0.5 px-2 text-[10px]">
                    {job.category}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-semibold">{job.type}</span>
                </div>
                <div>
                  <h3 className="font-bold text-primary text-base leading-snug group-hover:text-accent transition-colors duration-200">
                    {job.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">{job.company}</p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-1 text-xs font-semibold text-neutral-500 group-hover:text-accent transition-colors duration-200 cursor-pointer">
                Apply on Partner Site <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
