// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from './lib/supabase';

export async function middleware(request: NextRequest) {
  const { data: { user }, error } = await supabase.auth.getUser();
  const url = request.nextUrl.clone();

  if (error || !user) {
    // Not logged in – redirect to sign‑in page
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  const role = (user as any).app_metadata?.role;
  if (url.pathname.startsWith('/admin') && role !== 'admin') {
    // Not an admin – show 403
    return new NextResponse('Forbidden', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
