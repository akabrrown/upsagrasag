// app/admin/events/page.tsx
import React from 'react';
import { CrudTable } from '@/components/admin/CrudTable';
import { eventService } from '@/lib/supabase/admin';
import type { Event, ColumnConfig } from '@/types/admin';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const events = await eventService.list();

  const columns: ColumnConfig<Event>[] = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'startDt', label: 'Start' },
    { key: 'endDt', label: 'End' },
  ];

  if (!events) return <p className="text-center text-gray-500">Loading…</p>;
  if (events.length === 0)
    return <p className="text-center text-gray-500">No events found.</p>;

  return (
    <section className="p-4">
      <h2 className="text-xl font-semibold mb-4">Events</h2>
      <CrudTable<Event & { id: string }> 
        data={events as (Event & { id: string })[]} 
        columns={columns as any} 
        entity="events" 
      />
    </section>
  );
}
