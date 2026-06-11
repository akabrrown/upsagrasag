// app/api/admin/events/route.ts
import { NextResponse } from 'next/server';
import { eventService } from '@/lib/supabase/admin';
import type { Event } from '@/types/admin';

// GET /api/admin/events - list all events
export async function GET() {
  const events: Event[] = await eventService.list();
  return NextResponse.json(events);
}

// POST /api/admin/events - create new event
export async function POST(req: Request) {
  try {
    const payload: Partial<Event> = await req.json();
    const created = await eventService.create(payload);
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
