import { supabaseAdminClient as supabase } from '@/lib/supabase/admin';
import { EventProgramme } from '@/types/admin';

export const eventProgrammeService = {
  async create(data: EventProgramme) {
    const { data: created, error } = await supabase.from('events_programmes').insert([data]).single();
    if (error) throw error;
    return created;
  },
  async update(id: string, data: Partial<EventProgramme>) {
    const { data: updated, error } = await supabase.from('events_programmes').update(data).eq('id', id).single();
    if (error) throw error;
    return updated;
  },
  async get(id: string) {
    const { data, error } = await supabase.from('events_programmes').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async list() {
    const { data, error } = await supabase.from('events_programmes').select('*');
    if (error) throw error;
    return data;
  },
  async remove(id: string) {
    const { error } = await supabase.from('events_programmes').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};
