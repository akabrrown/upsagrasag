import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import slugify from '@/utils/slugify';

export const dynamic = 'force-dynamic';

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { error } = await supabase.from('programs').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { name } = await request.json();
  if (!name) return NextResponse.json({ error: 'Program name is required' }, { status: 400 });
  const slug = slugify(name);
  const { data, error } = await supabase.from('programs').update({ name, slug }).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
