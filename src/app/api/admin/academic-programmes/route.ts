import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { academicProgrammeService } from '@/lib/supabase/admin/academicProgrammeService';
import { academicProgrammeSchema } from '@/types/admin';

export async function GET() {
  try {
    const programmes = await academicProgrammeService.getAll();
    return NextResponse.json(programmes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const validatedData = academicProgrammeSchema.parse(body);

    const newProgramme = await academicProgrammeService.create(validatedData);
    return NextResponse.json(newProgramme, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
