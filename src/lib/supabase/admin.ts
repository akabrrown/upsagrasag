import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseClient as supabase } from '@/lib/supabaseClient';
import {
  Executive,
  NewsUpdate,
  EventProgramme,
  Opportunity,
  PastQuestion,
  Resource,
  Partner,
  Leadership,
  PlatformSettings,
} from '@/types/admin';

async function fetchAll<T>(table: string): Promise<T[]> {
  const { data, error } = await supabase.from(table).select('*');
  if (error) throw error;
  return data as T[];
}

async function fetchById<T>(table: string, id: number): Promise<T | null> {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw error;
  }
  return data as T;
}

async function insert<T>(table: string, payload: Partial<T>) {
  const { data, error } = await supabase.from(table).insert(payload as any).select();
  if (error) throw error;
  return data[0] as T;
}

async function update<T>(table: string, id: number, payload: Partial<T>) {
  const { data, error } = await supabase
    .from(table)
    .update(payload as any)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data[0] as T;
}

async function remove(table: string, id: number) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  return true;
}

/** Executive */
export const executiveService = {
  list: () => fetchAll<Executive>('executives'),
  get: (id: number) => fetchById<Executive>('executives', id),
  create: (payload: Partial<Executive>) => insert<Executive>('executives', payload),
  update: (id: number, payload: Partial<Executive>) => update<Executive>('executives', id, payload),
  delete: (id: number) => remove('executives', id),
};

/** News */
export const newsService = {
  list: () => fetchAll<NewsUpdate>('news_updates'),

  create: (payload: Partial<NewsUpdate>) => insert<NewsUpdate>('news_updates', payload),
  update: (id: number, payload: Partial<NewsUpdate>) => update<NewsUpdate>('news_updates', id, payload),
  delete: (id: number) => remove('news_updates', id),
};

/** Event */
export const eventService = {
  list: () => fetchAll<EventProgramme>('events'),
  get: (id: number) => fetchById<EventProgramme>('events', id),
  create: (payload: Partial<EventProgramme>) => insert<EventProgramme>('events', payload),
  update: (id: number, payload: Partial<EventProgramme>) => update<EventProgramme>('events', id, payload),
  delete: (id: number) => remove('events', id),
};

/** Opportunity */
export const opportunityService = {
  list: () => fetchAll<Opportunity>('opportunities'),
  get: (id: number) => fetchById<Opportunity>('opportunities', id),
  create: (payload: Partial<Opportunity>) => insert<Opportunity>('opportunities', payload),
  update: (id: number, payload: Partial<Opportunity>) => update<Opportunity>('opportunities', id, payload),
  delete: (id: number) => remove('opportunities', id),
};

/** Past Question */
export const pastQuestionService = {
  list: () => fetchAll<PastQuestion>('past_questions'),
  get: (id: number) => fetchById<PastQuestion>('past_questions', id),
  create: (payload: Partial<PastQuestion>) => insert<PastQuestion>('past_questions', payload),
  update: (id: number, payload: Partial<PastQuestion>) => update<PastQuestion>('past_questions', id, payload),
  delete: (id: number) => remove('past_questions', id),
};

export const leadershipService = {
  list: () => fetchAll<Leadership>('leadership'),
  get: (id: number) => fetchById<Leadership>('leadership', id),
  create: (payload: Partial<Leadership>) => insert<Leadership>('leadership', payload),
  update: (id: number, payload: Partial<Leadership>) => update<Leadership>('leadership', id, payload),
  delete: (id: number) => remove('leadership', id),
};
/** Resource */
export const resourceService = {
  list: () => fetchAll<Resource>('resources'),
  get: (id: number) => fetchById<Resource>('resources', id),
  create: (payload: Partial<Resource>) => insert<Resource>('resources', payload),
  update: (id: number, payload: Partial<Resource>) => update<Resource>('resources', id, payload),
  delete: (id: number) => remove('resources', id),
};

/** Partner */
export const partnerService = {
  list: () => fetchAll<Partner>('partners'),
  get: (id: number) => fetchById<Partner>('partners', id),
  create: (payload: Partial<Partner>) => insert<Partner>('partners', payload),
  update: (id: number, payload: Partial<Partner>) => update<Partner>('partners', id, payload),
  delete: (id: number) => remove('partners', id),
};

/** Newsletter Subscriber */


/** Chatbot Log */
export const chatbotLogService = {
  list: () => fetchAll<any>('chatbot_logs'),
  get: (id: number) => fetchById<any>('chatbot_logs', id),
  create: (payload: Partial<any>) => insert<any>('chatbot_logs', payload),
  update: (id: number, payload: Partial<any>) => update<any>('chatbot_logs', id, payload),
  delete: (id: number) => remove('chatbot_logs', id),
};

/** Site Settings (singleton) */
export const siteSettingsService = {
  get: () => fetchById<PlatformSettings>('site_settings', 1),
  update: (payload: Partial<PlatformSettings>) => update<PlatformSettings>('site_settings', 1, payload),
};

import { serviceMap, schemaMap } from './admin/index';
export { serviceMap, schemaMap };
