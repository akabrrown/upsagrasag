// src/lib/supabase/pageService.ts
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Page } from '@/types/page';
import { z } from 'zod';

export const pageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  content: z.string().optional(),
  image_url: z.string().url().optional(),
  status: z.enum(['draft', 'published']).optional(),
});

type PageInsert = z.infer<typeof pageSchema>;

export async function getPages({ includeDraft = false }: { includeDraft?: boolean } = {}) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('created_at', { ascending: false })
    .maybeSingle();
  // Actually we want list, so remove maybeSingle
  const { data: list, error: listErr } = await supabase
    .from('pages')
    .select('*')
    .order('created_at', { ascending: false });
  if (listErr) {
    console.error('[Supabase getPages Error]:', listErr);
    return [];
  }
  if (!includeDraft) {
    return list.filter((p) => p.status === 'published');
  }
  return list;
}

export async function getPageBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data as Page;
}

export async function createPage(input: PageInsert) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('pages').insert(input).select().single();
  if (error) throw error;
  return data as Page;
}

export async function updatePage(slug: string, input: Partial<PageInsert>) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('pages')
    .update(input)
    .eq('slug', slug)
    .select()
    .single();
  if (error) throw error;
  return data as Page;
}

export async function deletePage(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('pages').delete().eq('slug', slug);
  if (error) throw error;
}

export async function togglePublish(slug: string, publish: boolean) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('pages')
    .update({ status: publish ? 'published' : 'draft' })
    .eq('slug', slug)
    .select()
    .single();
  if (error) throw error;
  return data as Page;
}
