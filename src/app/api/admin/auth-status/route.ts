import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdminClient } from '@/lib/supabase/admin/index';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createServerSupabaseClient();
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try with must_change_password column first
    let adminRecord: any = null;
    let dbError: any = null;

    const result = await supabaseAdminClient
      .from('admin_users')
      .select('role, must_change_password, auth_uid')
      .eq('auth_uid', user.id)
      .maybeSingle();

    adminRecord = result.data;
    dbError = result.error;

    // If the column doesn't exist yet, fall back to querying without it
    if (dbError && dbError.message?.includes('must_change_password')) {
      const fallback = await supabaseAdminClient
        .from('admin_users')
        .select('role, auth_uid')
        .eq('auth_uid', user.id)
        .maybeSingle();

      adminRecord = fallback.data ? { ...fallback.data, must_change_password: false } : null;
      dbError = fallback.error;
    }

    if (dbError) {
      console.error('[auth-status] DB error:', dbError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!adminRecord) {
      console.log('[auth-status] No admin record for auth_uid:', user.id, user.email);
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 });
    }

    return NextResponse.json({
      role: adminRecord.role,
      must_change_password: adminRecord.must_change_password ?? false
    });

  } catch (err: any) {
    console.error('[auth-status] Unexpected error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
