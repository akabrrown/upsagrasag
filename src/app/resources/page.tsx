import React from 'react';
import { Download, FileText, Globe, ArrowUpRight } from 'lucide-react';

export default function ResourcesPage() {
  const downloads = [
    { name: 'GRASAG-UPSA Constitution', size: '2.4 MB', type: 'PDF' },
    { name: 'Senate Committee Nomination Form', size: '320 KB', type: 'DOCX' },
    { name: 'Academic Hardship Fund Guidelines', size: '540 KB', type: 'PDF' },
    { name: 'Thesis Formatting Word Template', size: '1.2 MB', type: 'DOCX' }
  ];

  const externalLinks = [
    { name: 'UPSA Student Portal', href: 'https://portal.upsa.edu.gh' },
    { name: 'School of Graduate Studies Admissions', href: 'https://sogs.upsa.edu.gh' },
    { name: 'National GRASAG Headquarters', href: 'https://grasaghq.org' },
    { name: 'JSTOR Online Academic Database', href: 'https://jstor.org' }
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 bg-background text-foreground">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="badge-accent">
          Repository
        </span>
        <h1 className="text-4xl font-extrabold text-primary sm:text-5xl">
          Downloads & Useful Links
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
          Access constitutional files, administrative templates, research frameworks, and external student systems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column: Downloads */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" /> Available Downloads
          </h2>
          
          <div className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
            {downloads.map((d) => (
              <div key={d.name} className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors duration-150">
                <div>
                  <h3 className="text-sm font-bold text-neutral-800 leading-tight">
                    {d.name}
                  </h3>
                  <p className="text-[10px] text-neutral-400 mt-1 font-medium">
                    {d.type} &bull; {d.size}
                  </p>
                </div>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white hover:bg-accent hover:text-white text-neutral-600 transition-all duration-150 cursor-pointer">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Links */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Globe className="h-5 w-5 text-accent" /> Academic Portals & Links
          </h2>
          
          <div className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
            {externalLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors duration-150 group"
              >
                <span className="text-sm font-bold text-neutral-800 group-hover:text-accent transition-colors duration-150">
                  {link.name}
                </span>
                <ArrowUpRight className="h-4 w-4 text-neutral-400 group-hover:text-accent transition-colors duration-150" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
