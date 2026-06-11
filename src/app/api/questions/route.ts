import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';
import { uploadImage } from '@/lib/cloudinary';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('course_id');

    let query = supabaseClient
      .from('questions_bank')
      .select('id, course_id, title, description, file_url, file_type, created_at, mba_courses(name)');

    if (courseId) {
      query = query.eq('course_id', parseInt(courseId, 10));
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ questions: data });
  } catch (error: any) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch questions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const courseIdStr = formData.get('course_id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File;

    if (!courseIdStr || !title || !file) {
      return NextResponse.json({ error: 'Missing required fields: course_id, title, and file' }, { status: 400 });
    }

    const courseId = parseInt(courseIdStr, 10);
    if (isNaN(courseId)) {
      return NextResponse.json({ error: 'Invalid course_id format' }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    let fileType: 'pdf' | 'docx' | null = null;
    if (fileName.endsWith('.pdf')) {
      fileType = 'pdf';
    } else if (fileName.endsWith('.docx')) {
      fileType = 'docx';
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Only PDF and DOCX files are allowed.' }, { status: 400 });
    }

    // Limit file size to 10MB
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds the 10MB limit.' }, { status: 400 });
    }

    // Convert file to buffer for Cloudinary upload stream
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadResultUrl = await uploadImage(buffer) as string;

    // Save record to Supabase questions_bank table
    const { data, error } = await supabaseClient
      .from('questions_bank')
      .insert({
        course_id: courseId,
        title,
        description,
        file_url: uploadResultUrl,
        file_type: fileType,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, question: data });
  } catch (error: any) {
    console.error('Error uploading question:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload question' }, { status: 500 });
  }
}
