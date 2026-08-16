import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdminClient } from '@/lib/supabase/admin/index';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createServerSupabaseClient();
  
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use admin client to bypass any RLS on admin_users table for this check
    const { data: adminRecord, error: dbError } = await supabaseAdminClient
      .from('admin_users')
      .select('role, must_change_password')
      .eq('auth_uid', session.user.id)
      .maybeSingle();

    if (dbError || !adminRecord) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 });
    }

    return NextResponse.json({
      role: adminRecord.role,
      must_change_password: adminRecord.must_change_password
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
