import React from 'react';
import { academicCalendarService } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function StudentSupportAcademicCalendarPage() {
  let events: { id: string; title: string; date: string; description?: string }[] = [];
  let fetchError = false;

  try {
    events = await academicCalendarService.getAll();
  } catch {
    fetchError = true;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 bg-background text-foreground">
      <div className="text-center space-y-3">
        <span className="badge-accent">Academic Calendar</span>
        <h1 className="text-4xl font-extrabold text-primary sm:text-5xl">Academic Calendar</h1>
      </div>

      {fetchError && (
        <p className="text-center text-red-500">
          Unable to load calendar events. Please try again later.
        </p>
      )}

      {!fetchError && events.length === 0 && (
        <p className="text-center text-gray-500">No calendar events found.</p>
      )}

      {events.length > 0 && (
        <div className="space-y-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="text-lg font-semibold text-gray-900">{event.title}</h2>
                <time className="text-sm text-gray-500 whitespace-nowrap">
                  {new Date(event.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </div>
              {event.description && (
                <p className="mt-2 text-gray-600">{event.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

