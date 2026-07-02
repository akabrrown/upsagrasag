'use client';
import React, { useState } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase/browser';
import type { EventProgrammeRecord } from '@/types/admin';

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<EventProgrammeRecord | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  React.useEffect(() => {
    supabase.from('events_programmes').select('*').then(({ data, error }) => {
  if (error) {
    console.error('Error fetching events:', error);
    setEvents([]);
  } else {
    console.log('Fetched events data:', data);
    setEvents(data ?? []);
  }
});
  }, []);

  const eventsToShow = events;

  return (
    <>
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
        <div className="space-y-8">
          {eventsToShow.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              No events scheduled at the moment. Please check back later.
            </div>
          ) : (
            eventsToShow.map((e) => (
              <div
                key={e.id || e.title}
                className="relative group flex flex-col md:flex-row gap-6 bg-white rounded-3xl p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedEvent(e)}
              >
                {console.log('Event item:', e)}
                {/* Image Section */}
                <div className="w-full md:w-1/3 h-56 md:h-auto relative overflow-hidden rounded-2xl bg-neutral-100 shrink-0">
                  {e.is_featured && (
                    <span className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded">Featured</span>
                  )}
                  {e.image_url ? (
                    <img 
                      src={e.image_url} 
                      alt={e.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                      <Calendar className="w-12 h-12 text-primary/20" />
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-2xl text-primary leading-tight group-hover:text-accent transition-colors duration-200">
                      {e.title}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed text-sm whitespace-pre-wrap">
                      {e.description || 'No description provided.'}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-100">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary bg-primary/5 px-3 py-1.5 rounded-lg">
                      <Calendar className="h-4 w-4 text-accent" /> 
                      <span suppressHydrationWarning>{new Date(e.event_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100">
                      <Clock className="h-4 w-4 text-neutral-400" /> 
                      <span suppressHydrationWarning>{new Date(e.event_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {e.location && (
                      <div className="flex items-center gap-2 text-sm text-neutral-600 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100">
                        <MapPin className="h-4 w-4 text-neutral-400" /> 
                        {e.location}
                      </div>
                    )}
                    {e.url && (
                      <a
                        href={e.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-primary text-white px-3 py-1 rounded hover:bg-primary/90 mt-2"
                      >
                        Learn More
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for selected event */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedEvent(null)}
            >
              &times;
            </button>
            {selectedEvent.image_url && (
              <img src={selectedEvent.image_url} alt={selectedEvent.title} className="w-full h-48 object-cover rounded-md mb-4" />
            )}
            <h2 className="text-2xl font-bold mb-2">{selectedEvent.title}</h2>
            <p className="text-sm text-gray-600 mb-2">
              {new Date(selectedEvent.event_date).toLocaleString()}
            </p>
            {selectedEvent.location && (
              <p className="flex items-center text-sm text-gray-600 mb-2">
                <span className="mr-1">📍</span>{selectedEvent.location}
              </p>
            )}
            <p className="text-gray-800 mb-4">{selectedEvent.description || 'No description provided.'}</p>
            {selectedEvent.url && (
              <a
                href={selectedEvent.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
              >
                Learn More
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
