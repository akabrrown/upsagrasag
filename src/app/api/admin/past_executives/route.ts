import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authHelpers';
import { pastExecutiveService } from '@/lib/supabase/admin';
import { pastExecutiveSchema } from '@/types/admin';

export async function GET() {
  const adminError = await requireAdmin();
  if (adminError) return adminError;

  try {
    const records = await pastExecutiveService.list();
    return NextResponse.json(records);
  } catch (error: any) {
    console.error("GET past_executives error:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function POST(request: Request) {
  const adminError = await requireAdmin();
  if (adminError) return adminError;

  try {
    const body = await request.json();
    const parse = pastExecutiveSchema.safeParse(body);
    if (!parse.success) return NextResponse.json({ error: parse.error.format() }, { status: 400 });

    const created = await pastExecutiveService.create(parse.data);
    return NextResponse.json(created);
  } catch (error: any) {
    console.error("POST past_executives error:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
