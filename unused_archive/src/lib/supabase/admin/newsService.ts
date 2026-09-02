import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { NewsUpdate } from '@/types/admin';

export const newsService = {
  async list(): Promise<NewsUpdate[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('news_updates').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data as NewsUpdate[];
  },
  async get(id: string | number): Promise<NewsUpdate | null> {
    const supabase = await createServerSupabaseClient();
    // Convert to number if needed
    const idValue = typeof id === 'string' ? Number(id) : id;
    if (Number.isNaN(idValue)) {
      // Invalid id format – treat as not found
      return null;
    }
    const { data, error } = await supabase
      .from('news_updates')
      .select('*')
      .eq('id', idValue)
      .single();
    if (error) {
      // PGRST102 = Not Found
      if (error.code === 'PGRST102') return null;
      throw error;
    }
    return data as NewsUpdate;
  },
  async create(payload: Partial<NewsUpdate>) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('news_updates').insert(payload);
    if (error) throw error;
  },
  async update(id: string | number, payload: Partial<NewsUpdate>) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('news_updates').update(payload).eq('id', id);
    if (error) throw error;
  },
  async delete(id: string | number) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('news_updates').delete().eq('id', id);
    if (error) throw error;
  },
  async bulkDelete(ids: (string | number)[]) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('news_updates').delete().in('id', ids);
    if (error) throw error;
  },
};
