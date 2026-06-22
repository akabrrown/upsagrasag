import { NextResponse } from 'next/server';

type Event = {
  id: number;
  title: string;
  date: string; // ISO string
  description: string;
};

// In-memory store (note: resets on server restart)
let events: Event[] = [];

export async function GET(req: Request) {
  return NextResponse.json(events);
}

export async function POST(req: Request) {
  try {
    const { title, date, description } = await req.json();
    if (!title || !date) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const newEvent: Event = {
      id: Date.now(),
      title,
      date,
      description: description ?? ''
    };
    events.push(newEvent);
    return NextResponse.json(newEvent, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, title, date, description } = await req.json();
    const idx = events.findIndex((e) => e.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    events[idx] = { id, title, date, description };
    return NextResponse.json(events[idx]);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const idx = events.findIndex((e) => e.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    events.splice(idx, 1);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
