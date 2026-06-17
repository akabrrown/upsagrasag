// app/api/admin/[entity]/route.ts
import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseAdmin';
import { getPagination } from '@/lib/pagination';
import { z } from 'zod';

// Simple mapping of entity to Zod schema for validation (add more as needed)
const schemas: Record<string, z.ZodObject<any>> = {
  executives: z.object({
    name: z.string().min(1),
    title: z.string().min(1),
    bio: z.string().optional(),
    photo_url: z.string().url(),
    display_order: z.number().int().nonnegative().default(0),
  }),
  opportunities: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    type: z.enum(["internship", "full-time", "contract"]),
    location: z.string().optional(),
    apply_url: z.string().url().optional(),
    image_url: z.string().url().optional(),
    deadline: z.string().optional(),
    is_active: z.boolean().default(true),
    display_order: z.number().int().nonnegative().default(0),
    slug: z.string().optional(),
  }),
  past_questions: z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
    display_order: z.number().int().nonnegative().default(0),
  }),
  resources: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    file_url: z.string().url().optional(),
    file_type: z.enum(["pdf", "docx", "pptx", "xlsx"]),
    thumbnail_url: z.string().url().optional(),
    display_order: z.number().int().nonnegative().default(0),
    is_featured: z.boolean().default(false),
  }),
  partners: z.object({
    name: z.string().min(1),
    website_url: z.string().url().optional(),
    logo_url: z.string().url().min(1),
    description: z.string().optional(),
    display_order: z.number().int().nonnegative().default(0),
    is_active: z.boolean().default(true),
  }),
  chatbot_logs: z.object({
    session_id: z.string().uuid(),
    message_role: z.enum(["user", "assistant", "system"]),
    content: z.string().min(1),
    token_usage: z.record(z.string(), z.any()).optional(),
  }),
  site_settings: z.object({
    key: z.string().min(1),
    value_text: z.string().optional(),
    value_jsonb: z.union([z.object({}).passthrough(), z.array(z.any()), z.string()]).optional(),
  }),
};

export async function GET(request: Request, { params }: { params: Promise<{ entity: string }> }) {
  const { entity } = await params;
  const url = new URL(request.url);
  const { page, limit } = getPagination(url.searchParams);
  const from = (page - 1) * limit;
  const { data, error, count } = await supabaseAdmin
    .from(entity)
    .select('*', { count: 'exact' })
    .range(from, from + limit - 1);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data, total: count ?? 0, page, limit });
}

export async function POST(request: Request, { params }: { params: Promise<{ entity: string }> }) {
  const { entity } = await params;
  const schema = schemas[entity];
  if (!schema) return NextResponse.json({ error: 'Unknown entity' }, { status: 400 });
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 422 });
  const { data, error } = await supabaseAdmin.from(entity).insert(parsed.data).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data[0]);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ entity: string }> }) {
  const { entity } = await params;
  const schema = schemas[entity];
  if (!schema) return NextResponse.json({ error: 'Unknown entity' }, { status: 400 });
  const body = await request.json();
  const { id, ...payload } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const parsed = schema.partial().safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 422 });
  const { data, error } = await supabaseAdmin.from(entity).update(parsed.data).eq('id', id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data[0]);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ entity: string }> }) {
  const { entity } = await params;
  const body = await request.json();
  // Accept either single id or array of ids for bulk delete
  const ids: number[] = Array.isArray(body.ids) ? body.ids : body.id ? [body.id] : [];
  if (ids.length === 0) return NextResponse.json({ error: 'No ids provided' }, { status: 400 });
  const { error } = await supabaseAdmin.from(entity).delete().in('id', ids);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true, deleted: ids.length });
}
