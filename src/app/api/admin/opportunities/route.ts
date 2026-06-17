import { NextResponse } from 'next/server';
import { opportunityService } from '@/lib/supabase/admin';
import { opportunitySchema } from '@/types/admin';

export async function GET() {
  const data = await opportunityService.list();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = opportunitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }
  const result = await opportunityService.create(parsed.data);
  return NextResponse.json(result, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...rest } = body;
  if (typeof id !== 'number') {
    return NextResponse.json({ error: 'Missing numeric id' }, { status: 400 });
  }
  const parsed = opportunitySchema.omit({ id: true }).safeParse(rest);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }
  const updated = await opportunityService.update(id, parsed.data);
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  if (typeof id !== 'number') {
    return NextResponse.json({ error: 'Missing numeric id' }, { status: 400 });
  }
  await opportunityService.delete(id);
  return NextResponse.json({ success: true });
}
