import { createServerSupabaseClient } from '../server';

export class AdminCrudService<T extends { id?: string }> {
  constructor(private tableName: string) {}

  async list(orderCol: string = 'created_at', ascending: boolean = false): Promise<T[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order(orderCol, { ascending });
    if (error) {
      console.error(`[AdminCrudService list ${this.tableName}] error:`, error);
      throw new Error(error.message);
    }
    return data as T[];
  }

  async get(id: string): Promise<T | null> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') {
      console.error(`[AdminCrudService get ${this.tableName}] error:`, error);
      throw new Error(error.message);
    }
    return data as T | null;
  }

  async create(item: Partial<T>): Promise<T> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(item as any)
      .select()
      .single();
    if (error) {
      console.error(`[AdminCrudService create ${this.tableName}] error:`, error);
      throw new Error(error.message);
    }
    return data as T;
  }


  async update(id: string, item: Partial<T>): Promise<T> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from(this.tableName)
      .update(item as any)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error(`[AdminCrudService update ${this.tableName}] error:`, error);
      throw new Error(error.message);
    }
    return data as T;
  }

  async delete(id: string): Promise<void> {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);
    if (error) {
      console.error(`[AdminCrudService delete ${this.tableName}] error:`, error);
      throw new Error(error.message);
    }
  }
}

// Export pre-configured services for each table
import type { 
  AdminUser, 
  President, 
  CongressEvent, 
  Partner, 
  ConstitutionFile, 
  Leadership, 
  Executive, 
  Opportunity, 
  Resource, 
  PastQuestion, 
  Tutorial, 
  EventProgramme, 
  ResearchOpportunity, 
  NewsUpdate, 
  PlatformSettings 
} from '@/types/admin';

export const adminUserService = new AdminCrudService<AdminUser>('admin_users');
export const presidentService = new AdminCrudService<President>('homepage_president');
export const congressService = new AdminCrudService<CongressEvent>('congress_events');
export const partnerService = new AdminCrudService<Partner>('partners');
export const constitutionService = new AdminCrudService<ConstitutionFile>('constitution_files');
export const leadershipService = new AdminCrudService<Leadership>('leadership');
export const executiveService = new AdminCrudService<Executive>('executives');
export const opportunityService = new AdminCrudService<Opportunity>('opportunities');
export const resourceService = new AdminCrudService<Resource>('resources');
export const pastQuestionService = new AdminCrudService<PastQuestion>('past_questions');
export const tutorialService = new AdminCrudService<Tutorial>('tutorials');
export const eventProgrammeService = new AdminCrudService<EventProgramme>('events_programmes');
export const researchOpportunityService = new AdminCrudService<ResearchOpportunity>('research_opportunities');
export const newsUpdateService = new AdminCrudService<NewsUpdate>('news_updates');

// PlatformSettings is special, only 1 row
export const platformSettingsService = {
  async getSettings(): Promise<PlatformSettings | null> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('platform_settings').select('*').limit(1).single();
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data as PlatformSettings | null;
  },
  async updateSettings(settings: Partial<PlatformSettings>): Promise<PlatformSettings> {
    const supabase = await createServerSupabaseClient();
    const current = await this.getSettings();
    if (!current) throw new Error("Settings row not initialized");
    const { data, error } = await supabase
      .from('platform_settings')
      .update(settings)
      .eq('id', current.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as PlatformSettings;
  }
};

// Map strings to services for dynamic API routes
export const serviceMap: Record<string, AdminCrudService<any>> = {
  'users': adminUserService,
  'president': presidentService,
  'congress': congressService,
  'partners': partnerService,
  'constitution': constitutionService,
  'leadership': leadershipService,
  'executives': executiveService,
  'opportunities': opportunityService,
  'resources': resourceService,
  'past_questions': pastQuestionService,
  'tutorials': tutorialService,
  'events_programmes': eventProgrammeService,
  'research_opportunities': researchOpportunityService,
  'news_updates': newsUpdateService,
};

import {
  adminUserSchema,
  presidentSchema,
  congressSchema,
  partnerSchema,
  constitutionSchema,
  leadershipSchema,
  executiveSchema,
  opportunitySchema,
  resourceSchema,
  pastQuestionSchema,
  tutorialSchema,
  eventProgrammeSchema,
  researchOpportunitySchema,
  newsUpdateSchema
} from '@/types/admin';

export const schemaMap: Record<string, any> = {
  'users': adminUserSchema,
  'president': presidentSchema,
  'congress': congressSchema,
  'partners': partnerSchema,
  'constitution': constitutionSchema,
  'leadership': leadershipSchema,
  'executives': executiveSchema,
  'opportunities': opportunitySchema,
  'resources': resourceSchema,
  'past_questions': pastQuestionSchema,
  'tutorials': tutorialSchema,
  'events_programmes': eventProgrammeSchema,
  'research_opportunities': researchOpportunitySchema,
  'news_updates': newsUpdateSchema,
};
