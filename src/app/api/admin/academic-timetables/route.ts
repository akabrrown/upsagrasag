import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authHelpers';
import { supabaseAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();

    // Check if it's a bulk upload
    if (Array.isArray(payload)) {
      const { data, error } = await supabaseAdminClient
        .from('academic_timetables')
        .insert(payload)
        .select();

      if (error) {
        console.error('Bulk upload error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }

    // Otherwise, single insert
    const { data, error } = await supabaseAdminClient
      .from('academic_timetables')
      .insert(payload)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

export async function DELETE(req: Request) {
  // Clear all for a specific program/session if bulk deleting
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const session = searchParams.get('session');
    const program = searchParams.get('program');

    if (!session || !program) {
        return NextResponse.json({ error: 'Session and Program are required for bulk delete' }, { status: 400 });
    }

    const { error } = await supabaseAdminClient
      .from('academic_timetables')
      .delete()
      .eq('session_type', session)
      .eq('program', program);

    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
