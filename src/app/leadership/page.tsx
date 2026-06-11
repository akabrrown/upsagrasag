import React from 'react';
import { ProfileCard } from './ProfileCard';

export default function LeadershipPage() {
  const executives = [
    {
      name: 'Kofi Adu-Gyamfi',
      role: 'President',
      image: '/president_headshot.png',
      email: 'president.grasag@upsamail.edu.gh',
    },
    {
      name: 'Abena Mansa Osei',
      role: 'Vice President',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&auto=format',
      email: 'vp.grasag@upsamail.edu.gh',
    },
    {
      name: 'Emmanuel Kwesi Boakye',
      role: 'General Secretary',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&auto=format',
      email: 'secretary.grasag@upsamail.edu.gh',
    },
    {
      name: 'Fatima Alhasan',
      role: 'Treasurer',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&auto=format',
      email: 'treasurer.grasag@upsamail.edu.gh',
    },
  ];

  // Patrons & Authorities
  const patrons = [
    {
      name: 'Prof. Kwame Mensah',
      role: 'Patron',
      image: 'https://images.unsplash.com/photo-1590487982363-5a1c90d3b6ed?w=300&h=300&fit=crop&auto=format',
      email: 'patron.grasag@upsamail.edu.gh',
    },
    {
      name: 'Dr. Ama Owusu',
      role: 'Authority Representative',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&auto=format',
      email: 'authority.grasag@upsamail.edu.gh',
    },
  ];

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
            key={exec.name}
            name={exec.name}
            role={exec.role}
            image={exec.image}
            email={exec.email}
          />
        ))}
      </div>

      {/* Patrons & Authorities Grid */}
      <h2 className="text-3xl font-semibold text-primary mt-12 mb-6 text-center">
        Patrons & Authorities
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {patrons.map((p) => (
          <ProfileCard
            key={p.name}
            name={p.name}
            role={p.role}
            image={p.image}
            email={p.email}
          />
        ))}
      </div>
    </div>
  );
}
