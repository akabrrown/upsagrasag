require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadCalendar() {
  try {
    const rawData = fs.readFileSync('scratch/calendar.json', 'utf8');
    const records = JSON.parse(rawData);

    console.log(`Found ${records.length} records. Uploading...`);

    const { data, error } = await supabase
      .from('academic_calendar_events')
      .insert(records);

    if (error) {
      console.error('Error inserting records:', error);
    } else {
      console.log('Upload complete.');
    }
  } catch (err) {
    console.error('Script failed:', err);
  }
}

uploadCalendar();
