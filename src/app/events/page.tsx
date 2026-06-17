import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { eventService } from '@/lib/supabase/admin';

export default async function EventsPage() {
  const events = await eventService.list();

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
        {events.map((e) => (
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
