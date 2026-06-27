import React from 'react';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { eventProgrammeService } from '@/lib/supabase/admin/index';

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  // In Next.js 16, params may be a Promise; resolve it safely
  const resolvedParams = await (params as unknown as Promise<{ id: string }>);
  const id = resolvedParams.id;
  let event;
  try {
    event = await eventProgrammeService.get(id);
  } catch (e) {
    console.error('Error fetching event by id:', e);
  }
  if (!event) {
    const list = await eventProgrammeService.list();
    event = list[0] || null;
  }
  if (!event) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">Event Not Found</h1>
        <p className="text-neutral-600">The requested event could not be found.</p>
      </div>
    );
  }


  return (
    <div className="mx-auto max-w-4xl px-4 py-12 space-y-8 bg-background text-foreground">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image */}
        <div className="w-full md:w-1/3 h-48 md:h-auto relative overflow-hidden rounded-2xl bg-neutral-100 shrink-0">
          {event.image_url ? (
            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/5">
              <Calendar className="w-12 h-12 text-primary/20" />
            </div>
          )}
        </div>
        {/* Content */}
        <div className="flex-1 flex flex-col space-y-4">
          <h1 className="text-3xl font-bold text-primary">{event.title}</h1>
          <p className="text-neutral-600 whitespace-pre-wrap">{event.description}</p>
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary bg-primary/5 px-3 py-1.5 rounded-lg">
              <Calendar className="h-4 w-4 text-accent" />
              <span suppressHydrationWarning>{new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100">
              <Clock className="h-4 w-4 text-neutral-400" />
              <span suppressHydrationWarning>{new Date(event.event_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2 text-sm text-neutral-600 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100">
                <MapPin className="h-4 w-4 text-neutral-400" />
                {event.location}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
