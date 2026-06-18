import { NextResponse } from 'next/server';

// Proxy endpoint for Blackbox API requests (e.g., https://www.useblackbox.io/tlm)
// This server‑side handler avoids CORS issues by making the request from the
// Next.js server and returning the response to the client.

export async function GET(request: Request) {
  // Forward query parameters if any
  const url = new URL(request.url);
  const target = `https://www.useblackbox.io${url.pathname}${url.search}`;

  try {
    const res = await fetch(target, {
      method: 'GET',
      // Pass along any auth headers the client might have sent
      headers: {
        // Preserve content‑type if needed
        ...(request.headers.get('authorization') && { 'authorization': request.headers.get('authorization')! }),
      },
    });

    const data = await res.text();
    const response = new NextResponse(data, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/json',
      },
    });
    return response;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const target = `https://www.useblackbox.io${url.pathname}${url.search}`;

  try {
    const body = await request.text();
    const res = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/json',
        ...(request.headers.get('authorization') && { 'authorization': request.headers.get('authorization')! }),
      },
      body,
    });
    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
