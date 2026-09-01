import { NextResponse } from 'next/server';
import { supabaseAdminClient } from '@/lib/supabase/admin'; // using service role for read-only since RLS might not be perfect yet

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const session = searchParams.get('session');
    const program = searchParams.get('program');

    let query = supabaseAdminClient.from('academic_timetables').select('*').order('created_at', { ascending: false });

    if (session) {
      query = query.eq('session_type', session);
    }
    if (program) {
      query = query.eq('program', program);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
