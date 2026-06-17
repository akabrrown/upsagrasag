import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { News } from '@/types/admin';

export const newsService = {
  async list(): Promise<News[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data as News[];
  },
  async create(payload: Partial<News>) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('news').insert(payload);
    if (error) throw error;
  },
  async update(id: string | number, payload: Partial<News>) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('news').update(payload).eq('id', id);
    if (error) throw error;
  },
  async delete(id: string | number) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) throw error;
  },
  async bulkDelete(ids: (string | number)[]) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('news').delete().in('id', ids);
    if (error) throw error;
  },
};
