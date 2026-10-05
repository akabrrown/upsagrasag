// src/app/api/admin/quick-links/route.ts
import { NextResponse, NextRequest } from 'next/server';
import supabaseAdmin from '@/lib/supabaseAdmin';
import { z } from 'zod';

// Validation schema for quick link payloads
const quickLinkSchema = z.object({
  title: z.string().min(1, 'Title required'),
  url: z.string().url('Invalid URL').optional(),
  description: z.string().optional(),
  display_order: z.number().int().optional()
});

// GET: list all quick links ordered by display_order
export async function GET(_request: NextRequest) {
  const { data, error } = await supabaseAdmin
    .from('quick_links')
    .select('id, title, url, description, display_order')
    .order('display_order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

// POST: create a new quick link
export async function POST(request: NextRequest) {
  const payload = await request.json();
  const result = quickLinkSchema.safeParse(payload);
  if (!result.success) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }
  const { title, url, description, display_order } = result.data;
  const { data, error } = await supabaseAdmin
    .from('quick_links')
    .insert({ title, url, description, display_order })
    .select();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data[0]);
}

// PATCH: update an existing quick link by ID
export async function PATCH(request: NextRequest) {
  const { id, ...updates } = await request.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const validation = quickLinkSchema.partial().safeParse(updates);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.message }, { status: 400 });
  }
  const { data, error } = await supabaseAdmin
    .from('quick_links')
    .update(validation.data)
    .eq('id', id)
    .select();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data[0]);
}

// DELETE: remove a quick link by ID
export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { error } = await supabaseAdmin.from('quick_links').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
