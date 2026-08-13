import { NextResponse, NextRequest } from 'next/server';
import supabaseAdmin from '@/lib/supabaseAdmin';
import { z } from 'zod';

// Validation schema for welfare service payloads
const welfareServiceSchema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().min(1, 'Description required'),
  action: z.string().min(1, 'Action required'),
  href: z.string().optional(),
  icon: z.string().min(1, 'Icon name required'),
  display_order: z.number().int().optional().default(0)
});

// GET all services
export async function GET(_request: NextRequest) {
  const { data, error } = await supabaseAdmin
    .from('welfare_services')
    .select('id, title, description, action, href, icon, display_order')
    .order('display_order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

// POST new service
export async function POST(request: NextRequest) {
  const payload = await request.json();
  const result = welfareServiceSchema.safeParse(payload);
  if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 400 });
  const { title, description, action, href, icon, display_order } = result.data;
  const { data, error } = await supabaseAdmin
    .from('welfare_services')
    .insert({ title, description, action, href, icon, display_order })
    .select();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data[0]);
}

// PATCH update service
export async function PATCH(request: NextRequest) {
  const { id, ...updates } = await request.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const validation = welfareServiceSchema.partial().safeParse(updates);
  if (!validation.success) return NextResponse.json({ error: validation.error.message }, { status: 400 });
  const { data, error } = await supabaseAdmin
    .from('welfare_services')
    .update(validation.data)
    .eq('id', id)
    .select();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data[0]);
}

// DELETE service
export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { error } = await supabaseAdmin.from('welfare_services').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
