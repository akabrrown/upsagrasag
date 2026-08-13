import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export async function middleware(request: NextRequest) {
  // Only rate limit mutation API routes (POST, PATCH, DELETE)
  if (
    request.nextUrl.pathname.startsWith("/api/") &&
    ["POST", "PATCH", "DELETE"].includes(request.method)
  ) {
    const ip = request.ip ?? "127.0.0.1";
    const { success } = await rateLimit.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
