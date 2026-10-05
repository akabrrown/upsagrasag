import { supabaseAdminClient } from './index';
import { AcademicProgramme } from '@/types/admin';

export const academicProgrammeService = {
  async getAll() {
    const { data, error } = await supabaseAdminClient
      .from('academic_programmes')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as AcademicProgramme[];
  },

  async create(programmeData: Partial<AcademicProgramme>) {
    const { data, error } = await supabaseAdminClient
      .from('academic_programmes')
      .insert([programmeData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as AcademicProgramme;
  },

  async update(id: string, updates: Partial<AcademicProgramme>) {
    const { data, error } = await supabaseAdminClient
      .from('academic_programmes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as AcademicProgramme;
  },

  async delete(id: string) {
    const { error } = await supabaseAdminClient
      .from('academic_programmes')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  }
};
