import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Supabase URL or service key missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function createBucket() {
  const { data, error } = await supabase.storage.createBucket('grasag', {
    public: true,
    allowedMimeTypes: ['image/*', 'application/pdf']
  });
  if (error) {
    console.error('Error creating bucket:', error.message);
    process.exit(1);
  }
  console.log('Bucket created:', data);
}

createBucket();
