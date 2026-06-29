import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authHelpers';
import { supabaseClient } from '@/lib/supabaseClient';

// GET all settings (key-value pairs)
export async function GET() {
  const { data: settings, error } = await supabaseClient
    .from('setting')
    .select('*');
  if (error) throw error;
  return NextResponse.json(settings);
}

// POST create or update a setting { key, value }
export async function POST(req: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { key, value } = await req.json();
  const { data: existing, error: getErr } = await supabaseClient
    .from('setting')
    .select('*')
    .eq('key', key)
    .single();
  if (getErr && getErr.code !== 'PGRST116') throw getErr; // ignore not found
  if (existing) {
    const { data: updated, error: updErr } = await supabaseClient
      .from('setting')
      .update({ value })
      .eq('key', key)
      .single();
    if (updErr) throw updErr;
    return NextResponse.json(updated);
  }
  const { data: created, error: insErr } = await supabaseClient
    .from('setting')
    .insert({ key, value })
    .single();
  if (insErr) throw insErr;
  return NextResponse.json(created, { status: 201 });
}

// PUT update a setting (same as POST but forces update)
export async function PUT(req: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { key, value } = await req.json();
  const { data: updated, error } = await supabaseClient
    .from('setting')
    .update({ value })
    .eq('key', key)
    .single();
  if (error) throw error;
  return NextResponse.json(updated);
}

// DELETE a setting by key
export async function DELETE(req: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const { key } = await req.json();
  const { error } = await supabaseClient
    .from('setting')
    .delete()
    .eq('key', key);
  if (error) throw error;
  return NextResponse.json({ success: true });
}
