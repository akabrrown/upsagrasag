import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: oldPrograms, error: err1 } = await supabase.from('programs').select('*');
  console.log("Old programs count:", oldPrograms?.length);
  if (oldPrograms?.length) console.log(oldPrograms);

  const { data: newPrograms, error: err2 } = await supabase.from('academic_programmes').select('*');
  console.log("New programs count:", newPrograms?.length);
  if (newPrograms?.length) console.log(newPrograms);
}

check();
