import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/authHelpers';
import { adminUserService } from '@/lib/supabase/admin/index';

export async function POST(request: Request) {
  // 1. Enforce Admin Access
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { email, role } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 2. Generate a random temporary password
    const tempPassword = Math.random().toString(36).slice(-10) + 'Aa1!'; 

    const supabaseAdmin = await createServerSupabaseClient();

    // 3. Create the user in Supabase Auth
    const { data: authData, error: authErrorResult } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: { role: role || 'admin' }
    });

    if (authErrorResult) {
      return NextResponse.json({ error: authErrorResult.message }, { status: 400 });
    }

    const authUid = authData.user.id;

    // 4. Create the corresponding record in admin_users
    // (We bypass the adminUserService.create here because it currently expects the auth user to already exist, 
    // but doing it directly via supabaseAdmin is cleaner since we already have the auth_uid).
    const { data: adminRecord, error: dbError } = await supabaseAdmin
      .from('admin_users')
      .insert({
        auth_uid: authUid,
        role: role || 'admin'
      })
      .select()
      .single();

    if (dbError) {
      // Rollback Auth user if DB insert fails
      await supabaseAdmin.auth.admin.deleteUser(authUid);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Return the required structure { admin: AdminUser, tempPassword: string }
    const adminUserResult = {
      id: adminRecord.id,
      email: email,
      role: adminRecord.role,
      created_at: adminRecord.created_at,
      updated_at: adminRecord.updated_at
    };

    return NextResponse.json({ admin: adminUserResult, tempPassword }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
  }
}
