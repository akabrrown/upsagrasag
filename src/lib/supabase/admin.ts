// lib/supabase/admin.ts
import { supabaseClient as supabase } from '@/lib/supabaseClient';
import {
  Executive,
  News,
  Event,
  Opportunity,
  PastQuestion,
  Resource,
  Partner,
  NewsletterSubscriber,
  ChatbotLog,
  SiteSettings,
} from '@/types/admin';

/** Generic CRUD helpers */
export async function getNewsById(id: number): Promise<News | null> {
  const { data, error } = await supabase.from('news').select('*').eq('id', id).single();
  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw new Error(error.message);
  }
  return data as News;
}

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
  const { data, error } = await supabase.from(table).insert(payload).select();
  if (error) throw error;
  return data[0] as T;
}

async function update<T>(table: string, id: number, payload: Partial<T>) {
  const { data, error } = await supabase
    .from(table)
    .update(payload)
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
  list: () => fetchAll<News>('news'),
  get: (id: number) => fetchById<News>('news', id),
  create: (payload: Partial<News>) => insert<News>('news', payload),
  update: (id: number, payload: Partial<News>) => update<News>('news', id, payload),
  delete: (id: number) => remove('news', id),
};

/** Event */
export const eventService = {
  list: () => fetchAll<Event>('events'),
  get: (id: number) => fetchById<Event>('events', id),
  create: (payload: Partial<Event>) => insert<Event>('events', payload),
  update: (id: number, payload: Partial<Event>) => update<Event>('events', id, payload),
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
export const newsletterSubscriberService = {
  list: () => fetchAll<NewsletterSubscriber>('newsletter_subscribers'),
  get: (id: number) => fetchById<NewsletterSubscriber>('newsletter_subscribers', id),
  create: (payload: Partial<NewsletterSubscriber>) => insert<NewsletterSubscriber>('newsletter_subscribers', payload),
  update: (id: number, payload: Partial<NewsletterSubscriber>) =>
    update<NewsletterSubscriber>('newsletter_subscribers', id, payload),
  delete: (id: number) => remove('newsletter_subscribers', id),
};

/** Chatbot Log */
export const chatbotLogService = {
  list: () => fetchAll<ChatbotLog>('chatbot_logs'),
  get: (id: number) => fetchById<ChatbotLog>('chatbot_logs', id),
  create: (payload: Partial<ChatbotLog>) => insert<ChatbotLog>('chatbot_logs', payload),
  update: (id: number, payload: Partial<ChatbotLog>) => update<ChatbotLog>('chatbot_logs', id, payload),
  delete: (id: number) => remove('chatbot_logs', id),
};

/** Site Settings (singleton) */
export const siteSettingsService = {
  get: () => fetchById<SiteSettings>('site_settings', 1),
  update: (payload: Partial<SiteSettings>) => update<SiteSettings>('site_settings', 1, payload),
};

