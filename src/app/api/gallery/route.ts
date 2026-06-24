import { NextRequest, NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseAdmin';
import { v2 as cloudinary } from 'cloudinary';
import { IncomingForm } from 'formidable';
import { Readable } from 'stream';

// Configure Cloudinary (uses CLOUDINARY_URL if set, otherwise individual env vars)
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    api_key: process.env.CLOUDINARY_API_KEY ?? '',
    api_secret: process.env.CLOUDINARY_API_SECRET ?? '',
  });
}

/** Helper to extract Supabase admin JWT from Authorization header */
async function getSupabaseUser(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

/** POST – upload image (admin only) */
export async function POST(req: NextRequest) {
  // Verify admin role
  const user = await getSupabaseUser(req);
  if (!user || (user?.role !== 'admin' && user?.app_metadata?.role !== 'admin')) {
    return NextResponse.json({ error: 'Admin authentication required' }, { status: 403 });
  }

  // Parse multipart form data using formidable
  const form = new IncomingForm({ keepExtensions: true });
  const formData: { fields: any; files: any } = await new Promise((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const { title, description } = formData.fields;
  const file = Array.isArray(formData.files?.file)
    ? formData.files.file[0]
    : formData.files?.file;

  if (!file || !title) {
    return NextResponse.json({ error: 'Missing file or title' }, { status: 400 });
  }

  // Upload to Cloudinary using preset "graasag"
  const uploadResult = await new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', public_id: undefined, folder: 'gallery', upload_preset: 'graasag' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    // Stream file buffer to Cloudinary
    const readStream = Readable.from(file.filepath ? require('fs').createReadStream(file.filepath) : []);
    readStream.pipe(uploadStream);
  });

  const imageUrl = uploadResult?.secure_url ?? uploadResult?.url;

  // Insert metadata into Supabase table
  const { data, error } = await supabaseAdmin.from('gallery_images').insert([
    {
      url: imageUrl,
      title: String(title),
      description: description ? String(description) : null,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: 'Database insert failed', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, image: data?.[0] }, { status: 201 });
}

/** GET – public list of gallery images */
export async function GET(req: NextRequest) {
  const { data, error } = await supabaseAdmin
    .from('gallery_images')
    .select('url, title, description, uploaded_at')
    .order('uploaded_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch images', details: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export const config = {
  // Disable Next.js body parsing – we use formidable
  api: { bodyParser: false },
};
