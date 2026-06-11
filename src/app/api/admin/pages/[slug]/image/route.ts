import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: any, context: any) {
  const { slug } = await context.params;
  const formData = await request.formData();
  const file = formData.get('file') as File;
  if (!file) {
    return new NextResponse('No file uploaded', { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    const imageUrl = await uploadImage(buffer, `admin/${slug}`);
    // Optionally update the page JSON with the new imageUrl
    const filePath = path.join(process.cwd(), 'src', 'data', 'pages', `${slug}.json`);
    const dataRaw = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(dataRaw);
    data.imageUrl = imageUrl;
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ imageUrl });
  } catch (err) {
    console.error(err);
    return new NextResponse('Image upload failed', { status: 500 });
  }
}
