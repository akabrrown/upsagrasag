import React from 'react';
import { Mail } from 'lucide-react';

export default function LeadershipPage() {
  const executives = [
    {
      name: 'Kofi Adu-Gyamfi',
      role: 'President',
      image: '/president_headshot.png',
      email: 'president.grasag@upsamail.edu.gh'
    },
    {
      name: 'Abena Mansa Osei',
      role: 'Vice President',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&auto=format',
      email: 'vp.grasag@upsamail.edu.gh'
    },
    {
      name: 'Emmanuel Kwesi Boakye',
      role: 'General Secretary',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&auto=format',
      email: 'secretary.grasag@upsamail.edu.gh'
    },
    {
      name: 'Fatima Alhasan',
      role: 'Treasurer',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&auto=format',
      email: 'treasurer.grasag@upsamail.edu.gh'
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 bg-background text-foreground">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="badge-accent">
          Governance
        </span>
        <h1 className="text-4xl font-extrabold text-primary sm:text-5xl">
          Executive Council Cabinet
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
          Meet the team dedicated to serving your academic, welfare, and career interests during the academic session.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {executives.map((exec) => (
          <div
            key={exec.name}
            className="group site-card-light bg-white p-5 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-64 w-full overflow-hidden rounded-xl bg-neutral-50 border border-neutral-100">
                <img
                  src={exec.image}
                  alt={exec.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="mt-5 space-y-2">
                <h3 className="font-bold text-neutral-900 text-lg group-hover:text-accent transition-colors duration-200">
                  {exec.name}
                </h3>
                <p className="text-xs font-bold text-accent uppercase tracking-wide">
                  {exec.role}
                </p>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-neutral-150 flex items-center gap-2 text-xs text-neutral-500">
              <Mail className="h-4 w-4 shrink-0 text-neutral-400" />
              <a href={`mailto:${exec.email}`} className="hover:text-accent truncate transition-colors">
                {exec.email}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
