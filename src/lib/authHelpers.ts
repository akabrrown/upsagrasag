import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  // Use getUser for server‑side verification (avoids insecure getSession warning)
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    // In development allow unauthenticated access for easier testing
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if role is admin in app_metadata (or fallback to a role column if you store it elsewhere)
  const role = user.app_metadata?.role;
  if (role !== 'admin') {
    // In development allow any authenticated user
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
  }
  // All good, allow request to continue
  return null;
}
