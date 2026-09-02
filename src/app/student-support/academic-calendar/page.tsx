import React from 'react';
import { academicCalendarService } from '@/lib/supabase/admin';
import CalendarTabs from './CalendarTabs';

export const dynamic = 'force-dynamic';

export default async function StudentSupportAcademicCalendarPage() {
  let events: any[] = [];
  let fetchError = false;
  let errorMessage = '';

  try {
    events = await academicCalendarService.list('sort_order', true);
  } catch (err: any) {
    console.error('[academic-calendar] Failed to load events:', err);
    fetchError = true;
    errorMessage = err.message || String(err);
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-24 sm:py-32">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] rounded-full bg-blue-500/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[30rem] h-[30rem] rounded-full bg-indigo-500/20 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white ring-1 ring-inset ring-white/20 backdrop-blur-sm">
            Official Schedule
          </span>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl drop-shadow-sm">
            Academic Calendar
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-blue-100">
            View the official academic timeline for Master's and PhD programs for the 2026/2027 academic year.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {fetchError && (
          <div className="text-center bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 shadow-sm">
            <p className="font-semibold">Unable to load calendar events.</p>
            <p className="text-sm mt-2 font-mono bg-white/50 p-2 rounded inline-block">{errorMessage}</p>
          </div>
        )}

        {!fetchError && (
          <CalendarTabs events={events} />
        )}
      </section>
    </div>
  );
}
