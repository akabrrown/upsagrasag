import { NextResponse } from 'next/server';
import { serviceMap, schemaMap } from '@/lib/supabase/admin/index';
import { requireAdmin } from '@/lib/authHelpers';
import { ZodError } from 'zod';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ entity: string }> }
) {
  // Wait for params if needed in Next.js 15+, but in 14 it might be synchronous. Next 15+ expects async params
  const { entity } = await params;
  const service = serviceMap[entity];
  if (!service) {
    return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
  }

  // Optional: Allow public read access to certain endpoints if needed
  // But since this is /api/admin/*, we will enforce admin check for all standard routes here
  // If public routes are needed, they should be created outside /api/admin
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const data = await service.list();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ entity: string }> }
) {
  const { entity } = await params;
  const authError = await requireAdmin();
  if (authError) return authError;

  const service = serviceMap[entity];
  const schema = schemaMap[entity];

  if (!service || !schema) {
    return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const validatedData = schema.parse(body);
    const data = await service.create(validatedData);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
