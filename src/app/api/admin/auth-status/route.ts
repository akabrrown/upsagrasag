import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdminClient } from '@/lib/supabase/admin/index';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createServerSupabaseClient();
  
  try {
    // Use getUser() instead of getSession() — more reliable server-side
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('[auth-status] getUser failed:', userError?.message);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[auth-status] Authenticated user:', user.id, user.email);

    // Use admin client to bypass any RLS on admin_users table for this check
    const { data: adminRecord, error: dbError } = await supabaseAdminClient
      .from('admin_users')
      .select('role, must_change_password, auth_uid')
      .eq('auth_uid', user.id)
      .maybeSingle();

    console.log('[auth-status] DB query result:', { adminRecord, dbError: dbError?.message });

    if (dbError) {
      console.error('[auth-status] DB error:', dbError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!adminRecord) {
      // Log all admin_users to see what auth_uids exist
      const { data: allAdmins } = await supabaseAdminClient
        .from('admin_users')
        .select('id, auth_uid, role');
      console.log('[auth-status] No match. User auth_uid:', user.id);
      console.log('[auth-status] All admin_users records:', JSON.stringify(allAdmins));
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
