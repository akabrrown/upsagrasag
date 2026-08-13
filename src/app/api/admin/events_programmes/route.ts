import { NextResponse } from 'next/server';
import { supabaseAdminClient as supabase } from '@/lib/supabase/admin';
import { eventProgrammeSchema } from '@/types/admin';

// GET all event programmes or filter by event_id
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('event_id');
  let query = supabase.from('events_programmes').select('*');
  if (eventId) {
    query = query.eq('event_id', eventId);
  }
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// CREATE a new event programme
export async function POST(request: Request) {
  const body = await request.json();
  const parse = eventProgrammeSchema.safeParse(body);
  if (!parse.success) return NextResponse.json({ error: parse.error.format() }, { status: 400 });
  const { data, error } = await supabase.from('events_programmes').insert([parse.data]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ? data[0] : null);
}

// UPDATE an existing event programme; requires id field
export async function PATCH(request: Request) {
  const { id, ...rest } = await request.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const parse = eventProgrammeSchema.safeParse({ id, ...rest });
  if (!parse.success) return NextResponse.json({ error: parse.error.format() }, { status: 400 });
  const { data, error } = await supabase.from('events_programmes').update(parse.data).eq('id', id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ? data[0] : null);
}

// DELETE an event programme by id
export async function DELETE(request: Request) {
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { error } = await supabase.from('events_programmes').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
