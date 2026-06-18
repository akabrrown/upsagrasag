import { NextResponse } from 'next/server';
import { serviceMap, schemaMap } from '@/lib/supabase/admin/index';
import { requireAdmin } from '@/lib/authHelpers';
import { ZodError } from 'zod';

// GET a single record (already covered elsewhere – optional)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ entity: string; id: string }> }
) {
  const { entity, id } = await params;
  const authError = await requireAdmin();
  if (authError) return authError;

  const service = serviceMap[entity];
  if (!service) return NextResponse.json({ error: 'Entity not found' }, { status: 404 });

  try {
    const data = await service.get(id);
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH – partial update with validation
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ entity: string; id: string }> }
) {
  const { entity, id } = await params;
  const authError = await requireAdmin();
  if (authError) return authError;

  const service = serviceMap[entity];
  const schema = schemaMap[entity];
  if (!service || !schema) return NextResponse.json({ error: 'Entity not found' }, { status: 404 });

  // Build a partial version of the schema, omitting immutable fields like id
  const partialSchema = schema.partial().omit({ id: true } as const);

  try {
    const body = await request.json();
    const validated = partialSchema.parse(body);
    const updated = await service.update(id, validated);
    return NextResponse.json(updated);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
    }
    // Fallback for other errors
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE – remove a record, return 204 No Content on success
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ entity: string; id: string }> }
) {
  const { entity, id } = await params;
  const authError = await requireAdmin();
  if (authError) return authError;

  const service = serviceMap[entity];
  if (!service) return NextResponse.json({ error: 'Entity not found' }, { status: 404 });

  try {
    await service.delete(id);
    // Return 204 No Content – clean, lightweight response
    return new Response(null, { status: 204 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
