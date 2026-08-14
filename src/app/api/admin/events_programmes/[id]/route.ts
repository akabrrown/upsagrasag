import { NextResponse } from 'next/server';
import { supabaseAdminClient as supabase } from '@/lib/supabase/admin';
import { eventProgrammeSchema } from '@/types/admin';
import { eventProgrammeService } from '@/services/admin/eventProgrammeService';

// GET a single event programme by id
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { data, error } = await supabase
      .from('events_programmes')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      // Return 404 if not found, otherwise 500
      const status = error.code === 'PGRST116' ? 404 : 500;
      return NextResponse.json({ error: error.message }, { status });
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error('GET event programme error', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST a new event programme
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parse = eventProgrammeSchema.safeParse(body);
    if (!parse.success) return NextResponse.json({ error: parse.error.format() }, { status: 400 });
    const created = await eventProgrammeService.create(parse.data);
    return NextResponse.json(created);
  } catch (e) {
    console.error('POST event programme error', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// UPDATE an event programme by id (PATCH)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const parse = eventProgrammeSchema.safeParse({ id, ...body });
    if (!parse.success) return NextResponse.json({ error: parse.error.format() }, { status: 400 });
    const updated = await eventProgrammeService.update(id, parse.data);
    return NextResponse.json(updated);
  } catch (e) {
    console.error('PATCH event programme error', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE an event programme by id
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error } = await supabase.from('events_programmes').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
