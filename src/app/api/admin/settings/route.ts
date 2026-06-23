import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/authHelpers';
import { platformSettingsSchema } from '@/types/admin';
import { ZodError } from 'zod';
import { platformSettingsService } from '@/lib/supabase/admin';

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const data = await platformSettingsService.getSettings();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const validatedData = platformSettingsSchema.partial().parse(body);
    const data = await platformSettingsService.updateSettings(validatedData);
    return NextResponse.json(data);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
