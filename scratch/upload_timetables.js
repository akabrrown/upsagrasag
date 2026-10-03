const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const dataPath = path.join(__dirname, 'parsed_timetables.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  
  console.log(`Found ${data.length} records. Uploading...`);
  
  // To avoid timeouts or hitting limits, insert in batches of 50
  const batchSize = 50;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const { data: result, error } = await supabase
      .from('academic_timetables')
      .insert(batch);
      
    if (error) {
      console.error(`Error inserting batch ${i}:`, error);
    } else {
      console.log(`Inserted batch ${i} to ${i + batch.length}`);
    }
  }
  
  console.log('Upload complete.');
}

main().catch(console.error);
