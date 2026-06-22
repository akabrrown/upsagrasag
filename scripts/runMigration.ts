import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve('.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('Updating leadership types from patron to executive...');
  const { data, error } = await supabase
    .from('leadership')
    .update({ type: 'executive' })
    .eq('type', 'patron')
    .select();

  if (error) {
    console.error('Error updating records:', error);
  } else {
    console.log(`Successfully updated ${data.length} records.`);
  }
}

runMigration();
