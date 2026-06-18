import { supabase } from '@/lib/supabase/browser';
import type { Partner } from '@/types/admin';

export const partnerService = {
  async list(): Promise<Partner[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('partners').select('*').order('display_order');
    if (error) throw error;
    return data as Partner[];
  },
  async create(payload: Partial<Partner>) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('partners').insert(payload);
    if (error) throw error;
  },
  async update(id: string | number, payload: Partial<Partner>) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('partners').update(payload).eq('id', id);
    if (error) throw error;
  },
  async delete(id: string | number) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('partners').delete().eq('id', id);
    if (error) throw error;
  },
  async bulkDelete(ids: (string | number)[]) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('partners').delete().in('id', ids);
    if (error) throw error;
  },
};
