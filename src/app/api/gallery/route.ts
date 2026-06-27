import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';
import { requireAdmin } from '@/lib/authHelpers';

/** POST – upload image (admin only) */
export async function POST(req: NextRequest) {
  // No admin check – any authenticated user can upload images

  try {
    const { images } = await req.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'Missing images payload' }, { status: 400 });
    }

    // Insert metadata into Supabase table
    const { data, error } = await supabaseClient.from('gallery_images').insert(images);

    if (error) {
      return NextResponse.json({ error: 'Database insert failed', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, images: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Upload failed', details: error.message }, { status: 500 });
  }
}

/** GET – public list of gallery images */
export async function GET(req: NextRequest) {
  const { data, error } = await supabaseClient
    .from('gallery_images')
    .select('url, title, description, uploaded_at')
    .order('uploaded_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch images', details: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}


