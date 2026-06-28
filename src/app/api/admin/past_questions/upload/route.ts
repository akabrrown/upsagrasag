import { NextResponse } from 'next/server';
import { supabaseAdminClient } from '@/lib/supabase/admin';
import slugify from '@/utils/slugify';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: Request) {
  // Cloudinary upload settings
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    return NextResponse.json({ error: 'Cloudinary configuration missing' }, { status: 500 });
  }

  const form = await req.formData();
  const programSlug = form.get('programSlug') as string;
  const files = form.getAll('files') as File[];
  
  const course_code = form.get('course_code') as string;
  const course_title = form.get('course_title') as string;
  const year = form.get('year') as string;

  if (!programSlug) {
    return NextResponse.json({ error: 'programSlug is required' }, { status: 400 });
  }
  if (!files.length) {
    return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
  }

  // Verify programme exists
  const { data: program, error: progErr } = await supabaseAdminClient
    .from('programs')
    .select('id')
    .eq('slug', programSlug)
    .single();
  if (progErr) return NextResponse.json({ error: progErr.message }, { status: 400 });

  const uploaded: any[] = [];
  for (const file of files) {
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: `Only PDF files are allowed: ${file.name}` }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: `File too large (max 10 MB): ${file.name}` }, { status: 400 });
    }
    const rawName = path.parse(file.name).name;
    const safeName = slugify(rawName) + '.pdf';
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload PDF to Cloudinary
    const formData = new FormData();
    formData.append('file', new Blob([buffer], { type: file.type }));
    formData.append('upload_preset', uploadPreset);
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const uploadRes = await fetch(cloudinaryUrl, { method: 'POST', body: formData });
    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) {
      return NextResponse.json({ error: `Cloudinary upload failed: ${uploadData.error?.message || 'unknown'}` }, { status: 500 });
    }
    const secureUrl = uploadData.secure_url;

    const { data: inserted } = await supabaseAdminClient.from('past_questions').insert({
        program_slug: programSlug,
        title: file.name,
        course_code: course_code || null,
        course_title: course_title || null,
        year: year || null,
        file_url: secureUrl,
    }).select();
    if (inserted && inserted.length) {
      uploaded.push({ title: file.name, url: secureUrl });
    }
  }
  return NextResponse.json({ success: true, files: uploaded });
}
