import React from 'react';
import { ProfileCard } from './ProfileCard';
import { leadershipService } from '@/lib/supabase/admin';

export default async function LeadershipPage() {
  // Fetch leaders and patrons from Supabase
  const allLeaders = await leadershipService.list();
  
  const authorities = allLeaders.filter(l => l.type === 'authority').sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  const executives = allLeaders.filter(l => l.type === 'executive').sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16 bg-background text-foreground">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="badge-accent">Governance</span>
        <h1 className="text-4xl font-extrabold text-primary sm:text-5xl">Leadership & Executives</h1>
        <p className="text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
          Meet the leaders and executives dedicated to serving your academic, welfare, and career interests.
        </p>
      </div>

      {/* Authorities Section */}
      {authorities.length > 0 && (
        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-center text-primary border-b pb-2">Authorities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {authorities.map((leader) => (
              <ProfileCard
                key={leader.id}
                name={leader.name}
                role={leader.role}
                image={leader.image_url ?? '/default-avatar.png'}
                email={(leader as any).email ?? ''}
                bio={leader.bio ?? ''}
              />
            ))}
          </div>
        </section>
      )}

      {/* Executives Section */}
      {executives.length > 0 && (
        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-center text-primary border-b pb-2">Executives</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {executives.map((leader) => (
              <ProfileCard
                key={leader.id}
                name={leader.name}
                role={leader.role}
                image={leader.image_url ?? '/default-avatar.png'}
                email={(leader as any).email ?? ''}
                bio={leader.bio ?? ''}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
