import React from 'react';
import { BookOpen, Layers, CheckSquare, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function AcademicsPage() {
  const supports = [
    { title: 'Thesis Guidelines', desc: 'Official word count limits, reference style manuals, formatting templates, and title page templates.', icon: BookOpen },
    { title: 'Plagiarism Checking (Turnitin)', desc: 'Access codes and submission instructions to check drafts before final supervisor signature.', icon: CheckSquare },
    { title: 'Supervisor Allocation', desc: 'Timelines, lists of faculty guides, specialization lists, and change-of-supervisor forms.', icon: Layers }
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 bg-background text-foreground">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="badge-accent">
          Academics
        </span>
        <h1 className="text-4xl font-extrabold text-primary sm:text-5xl">
          Academic Support & Research
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
          Equipping you with the right guides, thesis trackers, and libraries to ensure your graduate work meets high standards.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {supports.map((sup) => {
          const Icon = sup.icon;
          return (
            <div
              key={sup.title}
              className="site-card-light bg-white flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-primary text-base">
                    {sup.title}
                  </h3>
                  <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                    {sup.desc}
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-1 text-xs font-bold text-accent cursor-pointer hover:opacity-80 transition-opacity">
                Access resources <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick link banner to past questions */}
      <div className="site-card-dark flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="font-bold text-primary text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-accent" /> Seeking Past Examination Papers?
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed max-w-xl">
            Our digital question repository stores previous semesters' MBA, MPhil, and PhD exams. Filter by your specific course name and download them instantly.
          </p>
        </div>
        <Link
          href="/past-questions"
          className="btn-accent shrink-0 text-xs"
        >
          Open Past Question Bank <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
