import { NextResponse } from 'next/server';
import { supabaseAdminClient } from '@/lib/supabase/admin/index';
import { requireAdmin } from '@/lib/authHelpers';

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

    const supabaseAdmin = supabaseAdminClient;

    // Check if user already exists in Auth
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingAuth = existingUsers?.users?.find(
      (u: any) => u.email?.toLowerCase() === email.toLowerCase()
    );

    let authUid: string;
    let tempPassword: string | null = null;

    if (existingAuth) {
      // User already exists in Auth — just use their ID
      authUid = existingAuth.id;

      // Check if they already have an admin_users record
      const { data: existingAdmin } = await supabaseAdmin
        .from('admin_users')
        .select('id')
        .eq('auth_uid', authUid)
        .maybeSingle();

      if (existingAdmin) {
        return NextResponse.json(
          { error: `An admin with email ${email} already exists.` },
          { status: 400 }
        );
      }
    } else {
      // Generate a strong temporary password
      const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
      let pwd = '';
      for (let i = 0; i < 12; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      tempPassword = pwd + 'Aa1!';

      // Create user in Supabase Auth
      const { data: authData, error: authErrorResult } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { role: role || 'admin' }
      });

      if (authErrorResult) {
        console.error('[create-admin] Auth error:', authErrorResult);
        return NextResponse.json({ error: authErrorResult.message }, { status: 400 });
      }

      authUid = authData.user.id;
    }

    // Create the admin_users record
    const { data: adminRecord, error: dbError } = await supabaseAdmin
      .from('admin_users')
      .insert({
        auth_uid: authUid,
        role: role || 'admin',
        must_change_password: !!tempPassword
      })
      .select()
      .single();

    if (dbError) {
      // Only rollback if we created the auth user (not if they pre-existed)
      if (tempPassword) {
        await supabaseAdmin.auth.admin.deleteUser(authUid);
      }
      console.error('[create-admin] DB error:', dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    const adminUserResult = {
      id: adminRecord.id,
      email: email,
      role: adminRecord.role,
      created_at: adminRecord.created_at,
      updated_at: adminRecord.updated_at
    };

    return NextResponse.json({
      admin: adminUserResult,
      tempPassword: tempPassword || '(existing auth user — no new password generated)'
    }, { status: 201 });

  } catch (error: any) {
    console.error('[create-admin] Unexpected error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
  }
}
