import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authHelpers';
import { pastExecutiveService } from '@/lib/supabase/admin';
import { pastExecutiveSchema } from '@/types/admin';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminError = await requireAdmin();
  if (adminError) return adminError;

  try {
    const { id } = await params;
    const record = await pastExecutiveService.get(id);
    if (!record) return new NextResponse('Not found', { status: 404 });
    return NextResponse.json(record);
  } catch (error: any) {
    console.error("GET past_executives/[id] error:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminError = await requireAdmin();
  if (adminError) return adminError;

  try {
    const { id } = await params;
    const body = await request.json();
    const parse = pastExecutiveSchema.safeParse({ id, ...body });
    if (!parse.success) return NextResponse.json({ error: parse.error.format() }, { status: 400 });

    const updated = await pastExecutiveService.update(id, parse.data);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PATCH past_executives/[id] error:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminError = await requireAdmin();
  if (adminError) return adminError;

  try {
    const { id } = await params;
    await pastExecutiveService.delete(id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("DELETE past_executives/[id] error:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
