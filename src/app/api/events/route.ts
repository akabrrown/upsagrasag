import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authHelpers';
import { supabaseClient } from '@/lib/supabaseClient';

// GET all events (admin only)
export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { data: events, error } = await supabaseClient.from('event').select('*');
  if (error) throw error;
  return NextResponse.json(events);
}

// POST create a new event (admin only)
export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const data = await request.json();
  const { data: newEvent, error } = await supabaseClient.from('event').insert(data).single();
  if (error) throw error;
  return NextResponse.json(newEvent, { status: 201 });
}

// PUT update an existing event (admin only)
export async function PUT(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { id, ...updates } = await request.json();
  const { data: updated, error } = await supabaseClient.from('event').update(updates).eq('id', id).single();
  if (error) throw error;
  return NextResponse.json(updated);
}

// DELETE an event by id (admin only)
export async function DELETE(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { id } = await request.json();
  const { error } = await supabaseClient.from('event').delete().eq('id', id);
  if (error) throw error;
  return new NextResponse(null, { status: 204 });
}
