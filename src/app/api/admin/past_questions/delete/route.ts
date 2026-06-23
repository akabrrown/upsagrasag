import { NextResponse } from 'next/server';
import { supabaseAdminClient } from '@/lib/supabase/admin';
import { promises as fs } from 'fs';
import path from 'path';

export async function DELETE(req: Request) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  // Get record to know file path
  const { data: record, error: fetchErr } = await supabaseAdminClient
    .from('past_questions')
    .select('file_path')
    .eq('id', id)
    .single();
  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 400 });

  // Delete DB row
  const { error: delErr } = await supabaseAdminClient.from('past_questions').delete().eq('id', id);
  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 400 });

  // Delete file from disk
  const absolutePath = path.join(process.cwd(), 'public', record.file_path);
  try {
    await fs.unlink(absolutePath);
  } catch (_) {
    // If file missing, ignore
  }

  return NextResponse.json({ success: true });
}
