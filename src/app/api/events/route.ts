import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseClient } from '@/lib/supabaseClient';

// GET all events (admin only)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const { data: events, error } = await supabaseClient.from('event').select('*');
  if (error) throw error;
  return NextResponse.json(events);
}

// POST create a new event (admin only)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const data = await request.json();
  const { data: newEvent, error } = await supabaseClient.from('event').insert(data).single();
  if (error) throw error;
  return NextResponse.json(newEvent, { status: 201 });
}

// PUT update an existing event (admin only)
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const { id, ...updates } = await request.json();
  const { data: updated, error } = await supabaseClient.from('event').update(updates).eq('id', id).single();
  if (error) throw error;
  return NextResponse.json(updated);
}

// DELETE an event by id (admin only)
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const { id } = await request.json();
  const { error } = await supabaseClient.from('event').delete().eq('id', id);
  if (error) throw error;
  return new NextResponse(null, { status: 204 });
}
