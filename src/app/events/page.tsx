import React from 'react';
import EventsClient from './EventsClient';
import { supabase } from '@/lib/supabase/browser';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  let dbEvents: any[] = [];
  try {
    const { data } = await supabase
      .from('events_programmes')
      .select('*')
      .eq('display_on_page', true)
      .order('start_date', { ascending: true });
    if (data) dbEvents = data;
  } catch (error) {
    console.error("Failed to load events from DB:", error);
  }

  return <EventsClient initialEvents={dbEvents} />;
}
