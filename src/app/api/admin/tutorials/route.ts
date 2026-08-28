// src/app/api/admin/tutorials/route.ts
import { NextResponse, NextRequest } from 'next/server';
import supabaseAdmin from '@/lib/supabaseAdmin';
import { tutorialSchema } from '@/types/admin';

async function parseBody(request: NextRequest) {
  try {
    const json = await request.json();
    return { data: json, error: null };
  } catch {
    return { data: null, error: new Error('Invalid JSON') };
  }
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('tutorials')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { data: body, error: parseError } = await parseBody(request);
  if (parseError) return NextResponse.json({ error: parseError.message }, { status: 400 });
  const validation = tutorialSchema.safeParse(body);
  if (!validation.success) return NextResponse.json({ error: validation.error.message }, { status: 400 });
  const { data, error } = await supabaseAdmin.from('tutorials').insert(validation.data).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  
  if (body._send_notification) {
    import('@/lib/notifications').then(({ sendPushNotificationToAll }) => {
      sendPushNotificationToAll('New Tutorial', body.title || 'A new tutorial has been posted.', '/academics/tutorials');
    }).catch(err => console.error(err));
  }
  
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { data: body, error: parseError } = await parseBody(request);
  if (parseError) return NextResponse.json({ error: parseError.message }, { status: 400 });
  const validation = tutorialSchema.partial().safeParse(body);
  if (!validation.success) return NextResponse.json({ error: validation.error.message }, { status: 400 });
  const { data, error } = await supabaseAdmin.from('tutorials').update(validation.data).eq('id', id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { error } = await supabaseAdmin.from('tutorials').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
