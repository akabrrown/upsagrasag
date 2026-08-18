import { NextResponse } from 'next/server';
import { academicCalendarService } from '@/lib/supabase/admin';

export async function GET(req: Request) {
  try {
    const data = await academicCalendarService.list('event_date', true);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await academicCalendarService.create(body);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
