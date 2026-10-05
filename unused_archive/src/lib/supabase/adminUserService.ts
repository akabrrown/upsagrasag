import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AdminUser } from '@/types/admin';
import { randomBytes } from 'crypto';

/** Retrieve all admin users */
export async function getAdminUsers(): Promise<AdminUser[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[Supabase getAdminUsers Error]:', error);
    return [];
  }
  return data as AdminUser[];
}

/** Generate a random temporary password */
function generateTempPassword(length = 12): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
  let pwd = '';
  while (pwd.length < length) {
    const byte = randomBytes(1)[0];
    const idx = byte % chars.length;
    pwd += chars.charAt(idx);
  }
  return pwd;
}

/** Create an admin user (auth + admin_users row) and return temporary password */
export async function createAdminUser(email: string) {
  const supabase = await createServerSupabaseClient();
  const tempPassword = generateTempPassword();

  // Create auth user using service role key
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: false,
  });
  if (authError) throw authError;

  // Insert admin user row with must_change_password flag
  const { data, error } = await supabase
    .from('admin_users')
    .insert({
      email,
      auth_uid: authUser.user.id,
      role: 'admin',
      must_change_password: true,
    })
    .select()
    .single();
  if (error) throw error;

  return { admin: data as AdminUser, tempPassword };
}

/** Delete an admin user */
export async function deleteAdminUser(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('admin_users').delete().eq('id', id);
  if (error) throw error;
}

/** Reset must_change_password after successful password change */
export async function resetMustChangePassword(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from('admin_users')
    .update({ must_change_password: false })
    .eq('id', id);
  if (error) throw error;
}
