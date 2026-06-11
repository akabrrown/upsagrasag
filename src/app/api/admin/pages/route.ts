import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const dir = path.join(process.cwd(), 'src', 'data', 'pages');
  try {
    const files = await fs.readdir(dir);
    const slugs = files
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace('.json', ''));
    return NextResponse.json({ slugs });
  } catch (err) {
    return new NextResponse('Failed to list pages', { status: 500 });
  }
}
