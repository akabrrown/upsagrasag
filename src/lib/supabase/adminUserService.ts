// src/lib/supabase/adminUserService.ts
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AdminUser } from '@/types/page';

export async function getAdminUsers() {
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

export async function createAdminUser(email: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('admin_users')
    .insert({ email, role: 'admin' })
    .select()
    .single();
  if (error) throw error;
  return data as AdminUser;
}

export async function deleteAdminUser(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('admin_users').delete().eq('id', id);
  if (error) throw error;
}
