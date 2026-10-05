require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixRecords() {
  // Update program_type
  const { data: d1, error: e1 } = await supabase
    .from('academic_calendar_events')
    .update({ program_type: "Master's Degree" })
    .eq('program_type', 'Masters');

  if (e1) console.error(e1);

  // Update student_type
  const { data: d2, error: e2 } = await supabase
    .from('academic_calendar_events')
    .update({ student_type: 'Freshmen' })
    .eq('student_type', 'First Year');

  if (e2) console.error(e2);
  
  console.log("Records updated successfully.");
}

fixRecords();
