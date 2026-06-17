// src/app/api/admin/pages/[slug]/route.ts
import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'src', 'data', 'pages', `${slug}.json`);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    return new NextResponse('Page not found', { status: 404 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'src', 'data', 'pages', `${slug}.json`);
  const body = await request.json();
  try {
    await fs.writeFile(filePath, JSON.stringify(body, null, 2), 'utf-8');
    return new NextResponse('Saved', { status: 200 });
  } catch (err) {
    return new NextResponse('Failed to save', { status: 500 });
  }
}
