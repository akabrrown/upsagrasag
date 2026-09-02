import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch all admin_users from the public schema
    let { data: adminUsers, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('*');

    if (adminError) throw adminError;

    // Fetch all auth users using the admin client
    const { data: authUsersData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) throw authError;

    const authUsers = authUsersData.users || [];

    // Auto-sync missing auth users to admin_users table
    const existingAuthUids = new Set((adminUsers || []).map((u: any) => u.auth_uid));
    const missingAuthUsers = authUsers.filter((au: any) => !existingAuthUids.has(au.id));
    
    if (missingAuthUsers.length > 0) {
      const inserts = missingAuthUsers.map((au: any) => ({
        auth_uid: au.id,
        role: 'admin' // default role
      }));
      
      const { data: newAdmins, error: insertError } = await supabaseAdmin
        .from('admin_users')
        .insert(inserts)
        .select('*');
        
      if (!insertError && newAdmins) {
        adminUsers = [...(adminUsers || []), ...newAdmins];
      }
    }

    // Map email to each admin_user record
    const usersWithEmail = (adminUsers || []).map((user: any) => {
      const matchedAuth = authUsers.find((au: any) => au.id === user.auth_uid);
      return {
        ...user,
        email: matchedAuth ? matchedAuth.email : (user.email || 'Unknown Email')
      };
    });

    return NextResponse.json(usersWithEmail);
  } catch (error: any) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const auth_uid = searchParams.get('auth_uid');

    if (!id || !auth_uid) {
      return NextResponse.json({ error: 'Missing id or auth_uid' }, { status: 400 });
    }

    // 1. Delete from admin_users
    const { error: dbError } = await supabaseAdmin
      .from('admin_users')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    // 2. Delete from auth.users so they aren't auto-synced again
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(auth_uid);
    
    if (authError) {
      console.error('Failed to delete auth user, but db record removed', authError);
      // We don't throw here to avoid failing the whole request if the auth user was already deleted
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
