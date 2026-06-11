// lib/server/pastQuestions.ts
import { supabase } from "../supabase";
import { PastQuestion } from "../../types/admin";

export async function getPastQuestions(): Promise<PastQuestion[]> {
  const { data, error } = await supabase
    .from<PastQuestion>('past_questions')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getPastQuestionById(id: string): Promise<PastQuestion | null> {
  const { data, error } = await supabase
    .from<PastQuestion>('past_questions')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function createPastQuestion(payload: PastQuestion): Promise<PastQuestion> {
  const { data, error } = await supabase
    .from<PastQuestion>('past_questions')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePastQuestion(id: string, payload: Partial<PastQuestion>): Promise<PastQuestion> {
  const { data, error } = await supabase
    .from<PastQuestion>('past_questions')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePastQuestion(id: string): Promise<void> {
  const { error } = await supabase.from('past_questions').delete().eq('id', id);
  if (error) throw error;
}
