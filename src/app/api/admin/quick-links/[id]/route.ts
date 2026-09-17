// src/app/api/admin/quick-links/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import supabaseAdmin from '@/lib/supabaseAdmin';

/** Delete a quick link by ID passed in URL */
export async function DELETE(request: NextRequest) {
  // Extract ID from pathname, e.g., /api/admin/quick-links/123
  const pathname = request.nextUrl.pathname;
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];
  if (!id) {
    return NextResponse.json({ error: 'Missing quick link ID' }, { status: 400 });
  }
  const { error } = await supabaseAdmin.from('quick_links').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
