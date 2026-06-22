import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import slugify from '@/utils/slugify';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabase.from('programs').select('id, name, slug');
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: 'Program name is required' }, { status: 400 });
  const slug = slugify(name);
  const { data, error } = await supabase.from('programs').insert({ name, slug }).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
