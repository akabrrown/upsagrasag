import { createServerSupabaseClient } from '../server';
import { createClient } from '@supabase/supabase-js';

// Dedicated admin client that runs with service role privileges, bypassing RLS.
// This is safe because all admin API routes are pre-validated using requireAdmin().
const supabaseAdminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
export { supabaseAdminClient };

export class AdminCrudService<T extends { id?: string | number }> {
  private static columnsCache: Record<string, string[]> = {};

  constructor(protected tableName: string) {}

  private async getTableColumns(): Promise<string[]> {
    const tableName = this.tableName;
    if (AdminCrudService.columnsCache[tableName]) {
      return AdminCrudService.columnsCache[tableName];
    }
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!supabaseUrl || !supabaseKey) return [];
      const res = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Accept': 'application/openapi+json'
        }
      });
      if (res.ok) {
        const schema = await res.json();
        const definition = schema.definitions && schema.definitions[tableName];
        if (definition && definition.properties) {
          const cols = Object.keys(definition.properties);
          AdminCrudService.columnsCache[tableName] = cols;
          return cols;
        }
      }
    } catch (err) {
      console.error(`Failed to fetch columns for table ${tableName}:`, err);
    }
    return [];
  }

  protected async filterPayload(item: any): Promise<any> {
    const cols = await this.getTableColumns();
    if (cols.length === 0) return item;
    const filtered: any = {};
    for (const k of Object.keys(item)) {
      if (cols.includes(k)) {
        filtered[k] = item[k];
      }
    }
    return filtered;
  }

  async list(orderCol: string = 'created_at', ascending: boolean = false): Promise<T[]> {
    const supabase = supabaseAdminClient;
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order(orderCol, { ascending });
      if (error) {
        console.error(`[AdminCrudService list ${this.tableName}] error:`, error);
        const errMsg = (error as any).message || 'Supabase list error';
        throw new Error(errMsg);
      }
    return data as T[];
  }

  async get(id: string): Promise<T | null> {
    const supabase = supabaseAdminClient;
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
    const supabase = supabaseAdminClient;
    const filtered = await this.filterPayload(item);
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(filtered as any)
      .select()
      .single();
    if (error) {
      console.error(`[AdminCrudService create ${this.tableName}] error:`, error);
      throw new Error(error.message);
    }
    return data as T;
  }

  async update(id: string, item: Partial<T>): Promise<T> {
    const supabase = supabaseAdminClient;
    const filtered = await this.filterPayload(item);
    const { data, error } = await supabase
      .from(this.tableName)
      .update(filtered as any)
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
    const supabase = supabaseAdminClient;
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

// Custom subclasses to handle database mismatches

export class ExecutiveCrudService extends AdminCrudService<Executive> {
  constructor() {
    super('executives');
  }

  async list(orderCol: string = 'created_at', ascending: boolean = false): Promise<Executive[]> {
    const supabase = supabaseAdminClient;
    const orderColumn = (orderCol === 'created_at' || orderCol === 'display_order') ? 'order' : orderCol;
    const { data, error } = await supabase
      .from('executives')
      .select('*')
      .order(orderColumn, { ascending: true });
    if (error) {
      console.error(`[ExecutiveCrudService list] error:`, error);
      throw new Error(error.message);
    }
    return (data || []).map((item: any) => ({
      ...item,
      id: String(item.id),
      display_order: item.order ?? 0
    })) as Executive[];
  }

  async get(id: string): Promise<Executive | null> {
    const supabase = supabaseAdminClient;
    const parsedId = isNaN(Number(id)) ? id : Number(id);
    const { data, error } = await supabase
      .from('executives')
      .select('*')
      .eq('id', parsedId)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error(`[ExecutiveCrudService get] error:`, error);
      throw new Error(error.message);
    }
    return {
      ...data,
      id: String(data.id),
      display_order: data.order ?? 0
    } as Executive;
  }

  async create(item: Partial<Executive>): Promise<Executive> {
    const supabase = supabaseAdminClient;
    const { display_order, id, ...rest } = item;
    const dbPayload: any = {
      ...rest,
      order: display_order ?? 0
    };
    const filtered = await this.filterPayload(dbPayload);
    const { data, error } = await supabase
      .from('executives')
      .insert(filtered)
      .select()
      .single();
    if (error) {
      console.error(`[ExecutiveCrudService create] error:`, error);
      throw new Error(error.message);
    }
    return {
      ...data,
      id: String(data.id),
      display_order: data.order ?? 0
    } as Executive;
  }

  async update(id: string, item: Partial<Executive>): Promise<Executive> {
    const supabase = supabaseAdminClient;
    const parsedId = isNaN(Number(id)) ? id : Number(id);
    const { display_order, id: itemId, ...rest } = item;
    const dbPayload: any = { ...rest };
    if (display_order !== undefined) {
      dbPayload.order = display_order;
    }
    const filtered = await this.filterPayload(dbPayload);
    const { data, error } = await supabase
      .from('executives')
      .update(filtered)
      .eq('id', parsedId)
      .select()
      .single();
    if (error) {
      console.error(`[ExecutiveCrudService update] error:`, error);
      throw new Error(error.message);
    }
    return {
      ...data,
      id: String(data.id),
      display_order: data.order ?? 0
    } as Executive;
  }

  async delete(id: string): Promise<void> {
    const supabase = supabaseAdminClient;
    const parsedId = isNaN(Number(id)) ? id : Number(id);
    const { error } = await supabase
      .from('executives')
      .delete()
      .eq('id', parsedId);
    if (error) {
      console.error(`[ExecutiveCrudService delete] error:`, error);
      throw new Error(error.message);
    }
  }
}

export class PastQuestionCrudService extends AdminCrudService<PastQuestion> {
  constructor() {
    super('past_questions');
  }

  async list(orderCol: string = 'created_at', ascending: boolean = false): Promise<PastQuestion[]> {
    const supabase = supabaseAdminClient;
    const { data, error } = await supabase
      .from('past_questions')
      .select('*')
      .order('created_at', { ascending });
    if (error) {
      console.error(`[PastQuestionCrudService list] error:`, error);
      throw new Error(error.message);
    }
    return (data || []).map((item: any) => {
      return {
        id: String(item.id),
        programSlug: item.program_slug,
        course_code: item.course_code,
        course_title: item.course_title,
        year: String(item.year ?? ''),
        title: item.title,
        file_url: item.file_path || '',
        created_at: item.created_at,
        updated_at: item.updated_at
      };
    }) as PastQuestion[];
  }

  async get(id: string): Promise<PastQuestion | null> {
    const supabase = supabaseAdminClient;
    const parsedId = isNaN(Number(id)) ? id : Number(id);
    const { data, error } = await supabase
      .from('past_questions')
      .select('*')
      .eq('id', parsedId)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error(`[PastQuestionCrudService get] error:`, error);
      throw new Error(error.message);
    }
    return {
      id: String(data.id),
      programSlug: data.program_slug,
      course_code: data.course_code,
      course_title: data.course_title,
      year: String(data.year ?? ''),
      title: data.title,
      file_url: data.file_path || '',
      created_at: data.created_at,
      updated_at: data.updated_at
    } as PastQuestion;
  }

  async create(item: Partial<PastQuestion>): Promise<PastQuestion> {
    const supabase = supabaseAdminClient;
    const dbPayload: any = {
      program_slug: (item as any).programSlug,
      title: item.title,
      course_code: item.course_code,
      course_title: item.course_title,
      year: item.year ? parseInt(item.year, 10) : null,
      file_path: item.file_url
    };
    const filtered = await this.filterPayload(dbPayload);
    const { data, error } = await supabase
      .from('past_questions')
      .insert(filtered)
      .select()
      .single();
    if (error) {
      console.error(`[PastQuestionCrudService create ${this.tableName}] error:`, error);
      throw new Error(error.message);
    }
    return {
      id: String(data.id),
      programSlug: data.program_slug,
      course_code: data.course_code,
      course_title: data.course_title,
      year: String(data.year ?? ''),
      title: data.title,
      file_url: data.file_path,
      created_at: data.created_at,
      updated_at: data.updated_at
    } as PastQuestion;
  }

  async update(id: string, item: Partial<PastQuestion>): Promise<PastQuestion> {
    const supabase = supabaseAdminClient;
    const parsedId = isNaN(Number(id)) ? id : Number(id);
    
    const existing = await this.get(id);
    if (!existing) throw new Error("Item not found");
    
    const dbPayload: any = {};
    if (item.programSlug !== undefined) dbPayload.program_slug = item.programSlug;
    if (item.title !== undefined) dbPayload.title = item.title;
    if (item.course_code !== undefined) dbPayload.course_code = item.course_code;
    if (item.course_title !== undefined) dbPayload.course_title = item.course_title;
    if (item.year !== undefined) dbPayload.year = parseInt(item.year, 10);
    if (item.file_url !== undefined) dbPayload.file_path = item.file_url;
    
    const filtered = await this.filterPayload(dbPayload);
    const { data, error } = await supabase
      .from('past_questions')
      .update(filtered)
      .eq('id', parsedId)
      .select()
      .single();
    if (error) {
      console.error(`[PastQuestionCrudService update] error:`, error);
      throw new Error(error.message);
    }
    return {
      id: String(data.id),
      programSlug: data.program_slug,
      course_code: data.course_code,
      course_title: data.course_title,
      year: String(data.year ?? ''),
      title: data.title,
      file_url: data.file_path,
      created_at: data.created_at,
      updated_at: data.updated_at
    } as PastQuestion;
  }

  async delete(id: string): Promise<void> {
    const supabase = supabaseAdminClient;
    const parsedId = isNaN(Number(id)) ? id : Number(id);
    const { error } = await supabase
      .from('past_questions')
      .delete()
      .eq('id', parsedId);
    if (error) {
      console.error(`[PastQuestionCrudService delete] error:`, error);
      throw new Error(error.message);
    }
  }
}

export class AdminUserCrudService extends AdminCrudService<AdminUser> {
  constructor() {
    super('admin_users');
  }

  async list(orderCol: string = 'created_at', ascending: boolean = false): Promise<AdminUser[]> {
    const supabase = supabaseAdminClient;
    const { data: dbUsers, error: dbError } = await supabase
      .from('admin_users')
      .select('*');
    if (dbError) {
      console.error(`[AdminUserCrudService list] error:`, dbError);
      throw new Error(dbError.message);
    }
    
    let authUsers: any[] = [];
    try {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) {
        console.error(`[AdminUserCrudService list] auth error:`, error);
      } else {
        authUsers = data.users || [];
      }
    } catch (err) {
      console.error(`[AdminUserCrudService list] failed to list auth users:`, err);
    }

    return (dbUsers || []).map((dbUser: any) => {
      const authUser = authUsers.find((u: any) => u.id === dbUser.auth_uid);
      return {
        id: dbUser.id,
        email: authUser?.email || 'unknown@example.com',
        role: dbUser.role || 'admin',
        created_at: dbUser.created_at,
        updated_at: dbUser.updated_at
      };
    }) as AdminUser[];
  }

  async get(id: string): Promise<AdminUser | null> {
    const supabase = supabaseAdminClient;
    const { data: dbUser, error: dbError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .single();
    if (dbError) {
      if (dbError.code === 'PGRST116') return null;
      throw new Error(dbError.message);
    }
    
    let email = 'unknown@example.com';
    if (dbUser.auth_uid) {
      try {
        const { data, error } = await supabase.auth.admin.getUserById(dbUser.auth_uid);
        if (!error && data && data.user) {
          email = data.user.email || email;
        }
      } catch (err) {
        console.error(`[AdminUserCrudService get] getUserById error:`, err);
      }
    }

    return {
      id: dbUser.id,
      email,
      role: dbUser.role || 'admin',
      created_at: dbUser.created_at,
      updated_at: dbUser.updated_at
    } as AdminUser;
  }

  async create(item: Partial<AdminUser>): Promise<AdminUser> {
    const supabase = supabaseAdminClient;
    
    let authUsers: any[] = [];
    try {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;
      authUsers = data.users || [];
    } catch (err: any) {
      throw new Error(`Auth listing failed: ${err.message}`);
    }
    
    const authUser = authUsers.find((u: any) => u.email?.toLowerCase() === item.email?.toLowerCase());
    if (!authUser) {
      throw new Error(`No auth user found with email ${item.email}. Please register this user in Auth first.`);
    }

    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        auth_uid: authUser.id,
        role: item.role || 'admin'
      })
      .select()
      .single();
      
    if (error) {
      console.error(`[AdminUserCrudService create] error:`, error);
      throw new Error(error.message);
    }

    return {
      id: data.id,
      email: authUser.email || item.email!,
      role: data.role || 'admin',
      created_at: data.created_at,
      updated_at: data.updated_at
    } as AdminUser;
  }

  async update(id: string, item: Partial<AdminUser>): Promise<AdminUser> {
    const supabase = supabaseAdminClient;
    
    const { data, error } = await supabase
      .from('admin_users')
      .update({
        role: item.role
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`[AdminUserCrudService update] error:`, error);
      throw new Error(error.message);
    }

    let email = item.email || 'unknown@example.com';
    if (data.auth_uid) {
      try {
        const { data: { user }, error: authError } = await supabase.auth.admin.getUserById(data.auth_uid);
        if (!authError && user) {
          email = user.email || email;
        }
      } catch (err) {
        console.error(`[AdminUserCrudService update] getUserById error:`, err);
      }
    }

    return {
      id: data.id,
      email,
      role: data.role || 'admin',
      created_at: data.created_at,
      updated_at: data.updated_at
    } as AdminUser;
  }

  async delete(id: string): Promise<void> {
    const supabase = supabaseAdminClient;
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', id);
    if (error) {
      console.error(`[AdminUserCrudService delete] error:`, error);
      throw new Error(error.message);
    }
  }
}

export const adminUserService = new AdminUserCrudService();
export const presidentService = new AdminCrudService<President>('homepage_president');
export const congressService = new AdminCrudService<CongressEvent>('congress_events');
export const partnerService = new AdminCrudService<Partner>('partners');
export const constitutionService = new AdminCrudService<ConstitutionFile>('constitution_files');
export const leadershipService = new AdminCrudService<Leadership>('leadership');
export const executiveService = new ExecutiveCrudService();
export const opportunityService = new AdminCrudService<Opportunity>('opportunities');
export const resourceService = new AdminCrudService<Resource>('resources');
export const pastQuestionService = new PastQuestionCrudService();
export const tutorialService = new AdminCrudService<Tutorial>('tutorials');
export const eventProgrammeService = new AdminCrudService<EventProgramme>('events_programmes');
export const researchOpportunityService = new AdminCrudService<ResearchOpportunity>('research_opportunities');
export const newsUpdateService = new AdminCrudService<NewsUpdate>('news_updates');

// PlatformSettings is special, only 1 row
export const platformSettingsService = {
  async getSettings(): Promise<PlatformSettings | null> {
    const supabase = supabaseAdminClient;
    const { data, error } = await supabase.from('platform_settings').select('*').limit(1).single();
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data as PlatformSettings | null;
  },
  async updateSettings(settings: Partial<PlatformSettings>): Promise<PlatformSettings> {
    const supabase = supabaseAdminClient;
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

// Utility to normalize records with image URLs across different tables
export const normalizeRecord = (record: any) => ({
  ...record,
  imageUrl: record.photo_url || record.logo_url || record.image_url || ''
});

import { adminUserSchema } from '@/types/page';
import {
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
