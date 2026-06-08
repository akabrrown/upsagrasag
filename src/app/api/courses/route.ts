import { NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const { data, error } = await supabaseClient
      .from('mba_courses')
      .select('id, name')
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({ courses: data });
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch courses' }, { status: 500 });
  }
}
