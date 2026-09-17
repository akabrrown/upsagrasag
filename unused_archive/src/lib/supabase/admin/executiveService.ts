import { supabase } from '@/lib/supabase/browser';
import type { Executive } from '@/types/admin';

export const executiveService = {
  async list(): Promise<Executive[]> {
    const { data, error } = await supabase.from('executives').select('*').order('order', { ascending: true });
    if (error) throw error;
    // Map DB "order" column to the expected display_order property
    const executives = (data as any[]).map((item) => ({
      ...item,
      display_order: item.order,
    }));
    return executives as Executive[];
  },
  async create(payload: Partial<Executive>) {
    const { error } = await supabase.from('executives').insert(payload);
    if (error) throw error;
  },
  async update(id: string | number, payload: Partial<Executive>) {
    const { error } = await supabase.from('executives').update(payload).eq('id', id);
    if (error) throw error;
  },
  async delete(id: string | number) {
    const { error } = await supabase.from('executives').delete().eq('id', id);
    if (error) throw error;
  },
  async bulkDelete(ids: (string | number)[]) {
    const { error } = await supabase.from('executives').delete().in('id', ids);
    if (error) throw error;
  },
};
