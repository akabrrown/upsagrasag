import React from 'react';
import { Award, Gift, Heart, BadgeCheck } from 'lucide-react';

export default function MembershipPage() {
  const benefits = [
    { title: 'Academic Resources', desc: 'Unlimited access to the Past Question Bank, formatting templates, and Turnitin checking vouchers.', icon: Award },
    { title: 'Research & Funding', desc: 'Direct applications for internal research grants and support for external funding applications.', icon: BadgeCheck },
    { title: 'Welfare Schemes', desc: 'Subsidized health insurance, roommate matching, off-campus accommodation listings, and emergency hardship funding.', icon: Heart },
    { title: 'Career Acceleration', desc: 'Access to graduate internships, workshops, corporate recruitment fairs, and alumni mentorship programs.', icon: Gift }
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 bg-background text-foreground">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider shadow-sm">
          Benefits
        </span>
        <h1 className="text-4xl font-extrabold text-accent sm:text-5xl">
          Membership Benefits
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
          Every graduate student at UPSA is uniquely supported through our tailored association programs.
        </p>
      </div>

      {/* Grid of benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {benefits.map((b) => {
          const Icon = b.icon;
          return (
            <div
              key={b.title}
              className="site-card-light bg-white flex gap-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Icon className="h-6 w-6 text-accent" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-accent text-base">
                  {b.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
