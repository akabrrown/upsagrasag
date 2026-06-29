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

  // Determine admin role from possible locations
  const possibleRole =
    // Primary: app_metadata.role set by Supabase Auth
    user.app_metadata?.role ||
    // Fallback: user_metadata.role if stored there
    user.user_metadata?.role ||
    // Fallback: Treat as admin if authenticated (since there's no public sign up)
    'admin';

  if (possibleRole !== 'admin') {
    // In development allow any authenticated user for faster iteration
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
  }
  // All good, allow request to continue
  return null;
}
