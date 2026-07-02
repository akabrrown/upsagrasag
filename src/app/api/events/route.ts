import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/browser';

export async function GET() {
  try {
    const { data: events, error } = await supabase
      .from('events_programmes')
      .select('*, sub_events(*)')
      .order('event_date', { ascending: true });
    if (error) throw error;
    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
