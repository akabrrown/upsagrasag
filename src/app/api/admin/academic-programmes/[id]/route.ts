import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authHelpers';
import { academicProgrammeService } from '@/lib/supabase/admin/academicProgrammeService';
import { academicProgrammeSchema } from '@/types/admin';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const validatedData = academicProgrammeSchema.partial().parse(body);

    const updatedProgramme = await academicProgrammeService.update(id, validatedData);
    return NextResponse.json(updatedProgramme);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await academicProgrammeService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
