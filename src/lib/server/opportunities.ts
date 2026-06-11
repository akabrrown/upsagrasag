// lib/server/opportunities.ts
import { supabase } from "../supabase";
import { Opportunity } from "../../types/admin";

export async function getOpportunities(): Promise<Opportunity[]> {
  const { data, error } = await supabase
    .from<Opportunity>('opportunities')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getOpportunityById(id: string): Promise<Opportunity | null> {
  const { data, error } = await supabase
    .from<Opportunity>('opportunities')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function createOpportunity(payload: Opportunity): Promise<Opportunity> {
  const { data, error } = await supabase
    .from<Opportunity>('opportunities')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateOpportunity(id: string, payload: Partial<Opportunity>): Promise<Opportunity> {
  const { data, error } = await supabase
    .from<Opportunity>('opportunities')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteOpportunity(id: string): Promise<void> {
  const { error } = await supabase.from('opportunities').delete().eq('id', id);
  if (error) throw error;
}
