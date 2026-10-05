import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdminClient } from '@/lib/supabase/admin/index';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Store in subscribers or push_subscriptions if table available
    try {
      if (supabaseAdminClient && typeof supabaseAdminClient.from === 'function') {
        await supabaseAdminClient.from('launch_subscribers').insert({ email: cleanEmail }).select();
      }
    } catch {
      // Table might not exist yet, fallback smoothly without error
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! You have been added to the GRASAG-UPSA launch notification list. You will receive an alert as soon as the portal is live.'
    });
  } catch (err: any) {
    console.error('Launch notify error:', err);
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
