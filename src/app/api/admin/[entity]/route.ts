import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { serviceMap, schemaMap } from '@/lib/supabase/admin/index';
import { requireAdmin } from '@/lib/authHelpers';
import { ZodError } from 'zod';

export const dynamic = 'force-dynamic';

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
    revalidatePath('/', 'layout');
    
    // Check if push notification was requested
    if (body._send_notification) {
      const title = `New ${entity.replace('_', ' ')}`;
      const message = body.title || body.name || `A new ${entity.replace('_', ' ')} has been posted.`;
      
      // Determine URL based on entity
      let url = '/';
      if (entity === 'news_updates') url = `/news-updates/${data[0]?.id || ''}`;
      else if (entity === 'opportunities') url = `/opportunities`;
      else if (entity === 'resources') url = `/resources`;
      
      // Send notification asynchronously
      import('@/lib/notifications').then(({ sendPushNotificationToAll }) => {
        sendPushNotificationToAll(title, message, url);
      }).catch(err => console.error("Failed to load notifications module", err));
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
