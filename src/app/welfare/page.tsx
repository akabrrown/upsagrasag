import React from 'react';
import { Home, HeartPulse, ShieldAlert, Award } from 'lucide-react';

export default function WelfarePage() {
  const schemes = [
    { title: 'Accommodation Matching', desc: 'Listing verified hostels near UPSA campus and offering roommate matching services.', icon: Home },
    { title: 'Health & Medical Clinic', desc: 'Subsidized postgrad health cover cards and referrals to the campus clinic.', icon: HeartPulse },
    { title: 'Hardship Funds', desc: 'Micro-grants and tuition interest-free loans for students in sudden financial difficulties.', icon: Award },
    { title: 'Academic Grievances', desc: 'An anonymous escalations desk for grading disputes, advisor clashes, or registration issues.', icon: ShieldAlert }
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 bg-background text-foreground">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="badge-accent">
          Support
        </span>
        <h1 className="text-4xl font-extrabold text-primary sm:text-5xl">
          Student Welfare Schemes
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
          We ensure graduate life at UPSA is comfortable, secure, and conductive for academic rigor.
        </p>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {schemes.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="site-card-light bg-white flex gap-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Icon className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-primary text-base">
                  {s.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
