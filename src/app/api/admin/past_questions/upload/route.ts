import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import slugify from '@/utils/slugify';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: Request) {
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
  const { data: program, error: progErr } = await supabase
    .from('programs')
    .select('id')
    .eq('slug', programSlug)
    .single();
  if (progErr) return NextResponse.json({ error: progErr.message }, { status: 400 });

  const uploadDir = path.join(process.cwd(), 'public', 'programs', programSlug);
  await fs.mkdir(uploadDir, { recursive: true });

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
    const filePath = path.join(uploadDir, safeName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const { data: inserted } = await supabase.from('past_questions').insert({
      program_id: program.id,
      program_slug: programSlug,
      title: file.name,
      course_code: course_code || null,
      course_title: course_title || null,
      year: year || null,
      file_path: `programs/${programSlug}/${safeName}`,
    }).select();
    if (inserted && inserted.length) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
      uploaded.push({ title: file.name, url: `${baseUrl}/${inserted[0].file_path}` });
    }
  }
  return NextResponse.json({ success: true, files: uploaded });
}
