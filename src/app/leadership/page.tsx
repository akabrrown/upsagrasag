import React from 'react';
import { ProfileCard } from './ProfileCard';
import { executiveService } from '@/lib/supabase/admin';

export default async function LeadershipPage() {
  // Fetch executives from Supabase
  const executives = await executiveService.list();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 bg-background text-foreground">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="badge-accent">Governance</span>
        <h1 className="text-4xl font-extrabold text-primary sm:text-5xl">Executive Council Cabinet</h1>
        <p className="text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
          Meet the team dedicated to serving your academic, welfare, and career interests during the academic session.
        </p>
      </div>

      {/* Executives Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {executives.map((exec) => (
          <ProfileCard
            key={exec.id}
            name={exec.name}
            role={exec.title}
            image={exec.image ?? '/default-avatar.png'}
            email={exec.email}
          />
        ))}
      </div>
    </div>
  );
}
