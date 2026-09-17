import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { PlatformSettings } from '@/types/admin';

export const siteSettingsService = {
  async get(): Promise<PlatformSettings | null> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('site_settings').select('*').single();
    if (error && error.code !== 'PGRST116') throw error; // ignore not found
    return data as PlatformSettings | null;
  },
  async upsert(payload: Partial<PlatformSettings>) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('site_settings').upsert(payload, { onConflict: 'id' });
    if (error) throw error;
  },
  async delete() {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('site_settings').delete().eq('id', 1);
    if (error) throw error;
  },
};
