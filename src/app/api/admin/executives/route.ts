// app/api/admin/executives/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Executive } from '@/types/admin';
import { requireAdmin } from '@/lib/api/helpers';
import { executiveSchema } from '@/lib/validation/admin';

export async function GET() {
  await requireAdmin();
  const { data, error } = await supabase.from<Executive>('executives').select('*').order('display_order');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  await requireAdmin();
  const json = await request.json();
  const parse = executiveSchema.safeParse(json);
  if (!parse.success) return NextResponse.json({ error: parse.error.errors }, { status: 400 });
  const { data, error } = await supabase.from<Executive>('executives').insert([parse.data]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: Request) {
  await requireAdmin();
  const json = await request.json();
  const { id, ...rest } = json;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const parse = executiveSchema.partial().safeParse(rest);
  if (!parse.success) return NextResponse.json({ error: parse.error.errors }, { status: 400 });
  const { data, error } = await supabase.from<Executive>('executives').update(parse.data).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  await requireAdmin();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { error } = await supabase.from('executives').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
