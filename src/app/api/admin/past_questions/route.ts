import { NextResponse, NextRequest } from 'next/server';
import { supabaseAdminClient } from '@/lib/supabase/admin';
import { PastQuestion } from '@/types/admin';
type PastQuestionRecord = {
  id: number;
  program_slug: string;
  course_code: string;
  course_title: string;
  year: string;
  title: string | null;
  file_path: string;
  created_at: string;
};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const programSlug = url.searchParams.get('programSlug');
  const supabase = supabaseAdminClient;
  let query = supabase
    .from('past_questions')
    .select('id, program_slug, course_code, course_title, year, title, file_path, created_at');

  if (programSlug) {
    // Directly filter on program_slug column
    query = query.eq('program_slug', programSlug);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Transform to public URLs
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `http://localhost:${process.env.PORT || 3000}`;
  const items: PastQuestion[] = (data as PastQuestionRecord[]).map((item) => ({
    id: item.id,
    programSlug: item.program_slug,
    course_code: item.course_code,
    course_title: item.course_title,
    year: item.year,
    title: item.title ?? undefined,
    file_url: `${baseUrl}/${item.file_path}`,
    created_at: item.created_at,
  }));
  return NextResponse.json(items);
}
