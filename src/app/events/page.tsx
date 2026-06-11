import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

export default function EventsPage() {
  const eventsList = [
    {
      title: '14th Annual GRASAG-UPSA General Congress',
      date: 'Nov 15, 2026',
      time: '9:00 AM - 5:00 PM',
      location: 'UPSA Auditorium',
      desc: 'Annual flagship assembly including research exhibitions, senate debates, professional development panels, and delegate networking sessions.'
    },
    {
      title: 'CV Writing & LinkedIn Professional Audit',
      date: 'Dec 03, 2026',
      time: '2:00 PM - 4:00 PM',
      location: 'Graduate School Block',
      desc: 'Practical workshop with corporate HR recruiters vetting and reviewing postgrad resumes and profile optimization tips.'
    }
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 bg-background text-foreground">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="badge-accent">
          Calendar
        </span>
        <h1 className="text-4xl font-extrabold text-primary sm:text-5xl">
          Events & Programmes
        </h1>
        <p className="text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
          Reserve your seat and access registration details for our flagship annual congress, seminars, and networking nights.
        </p>
      </div>

      {/* Events loop */}
      <div className="space-y-6">
        {eventsList.map((e) => (
          <div
            key={e.title}
            className="group grid grid-cols-1 md:grid-cols-12 gap-6 upsa-gold-card"
          >
            <div className="md:col-span-8 space-y-3">
              <h3 className="font-bold text-primary text-lg leading-tight group-hover:text-accent transition-colors duration-200">
                {e.title}
              </h3>
              <p className="text-sm !text-primary leading-relaxed">
                {e.desc}
              </p>
            </div>
            
            <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-neutral-200 pt-4 md:pt-0 md:pl-6 space-y-2.5 text-xs text-neutral-500">
              <div className="flex items-center gap-2 font-semibold !text-primary">
                <Calendar className="h-4 w-4 !text-primary" /> {e.date}
              </div>
              <div className="flex items-center gap-2 !text-primary">
                <Clock className="h-4 w-4 !text-primary" /> {e.time}
              </div>
              <div className="flex items-center gap-2 !text-primary">
                <MapPin className="h-4 w-4 !text-primary" /> {e.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
