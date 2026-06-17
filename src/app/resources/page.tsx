import React from 'react';
import { FileText, Download, Globe, ArrowUpRight } from 'lucide-react';
import { resourceService } from '@/lib/supabase/admin';
import type { Resource } from '@/types/admin';

export const dynamic = 'force-dynamic'; // ensure fresh data

export default async function ResourcesPage() {
  const resources: Resource[] = await resourceService.list();

  const downloads = resources.filter(r => r.file_type === 'download');
  const links = resources.filter(r => r.file_type === 'link');

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 bg-background text-foreground">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="badge-accent">Repository</span>
        <h1 className="text-4xl font-extrabold text-primary sm:text-5xl">Downloads & Useful Links</h1>
        <p className="text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
          Access constitutional files, administrative templates, research frameworks, and external student systems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Downloads */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" /> Available Downloads
          </h2>
          <div className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
            {downloads.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors duration-150">
                <div>
                  <h3 className="text-sm font-bold text-neutral-800 leading-tight">{d.title}</h3>
                  <p className="text-[10px] text-neutral-400 mt-1 font-medium">{d.file_type.toUpperCase()} • {d.display_order}KB</p>
                </div>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white hover:bg-accent hover:text-white text-neutral-600 transition-all duration-150 cursor-pointer">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Globe className="h-5 w-5 text-accent" /> Academic Portals & Links
          </h2>
          <div className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
            {links.map((l) => (
              <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors duration-150 group">
                <span className="text-sm font-bold text-neutral-800 group-hover:text-accent transition-colors duration-150">{l.title}</span>
                <ArrowUpRight className="h-4 w-4 text-neutral-400 group-hover:text-accent transition-colors duration-150" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
