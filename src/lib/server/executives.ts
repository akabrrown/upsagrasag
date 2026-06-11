// lib/server/executives.ts
import { supabase } from "../supabase";
import { Executive } from "../../types/admin";
import { getPaginationParams, PaginatedResult } from "../pagination";

export async function getExecutivesPaginated(page: number = 1, limit: number = 20): Promise<PaginatedResult<Executive>> {
  const { offset, limit: pageSize } = getPaginationParams(page, limit);
  const { data, count, error } = await supabase
    .from<Executive>('executives')
    .select('*', { count: 'exact' })
    .order('display_order', { ascending: true })
    .range(offset, offset + pageSize - 1);
  if (error) throw error;
  return {
    data: data || [],
    total: count ?? 0,
    page,
    limit: pageSize,
  };
}

// other CRUD helpers remain unchanged – you can import them as needed
export async function getExecutiveById(id: string): Promise<Executive | null> {
  const { data, error } = await supabase
    .from<Executive>('executives')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function createExecutive(payload: Executive): Promise<Executive> {
  const { data, error } = await supabase.from<Executive>('executives').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function updateExecutive(id: string, payload: Partial<Executive>): Promise<Executive> {
  const { data, error } = await supabase.from<Executive>('executives').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteExecutive(id: string): Promise<void> {
  const { error } = await supabase.from('executives').delete().eq('id', id);
  if (error) throw error;
}
