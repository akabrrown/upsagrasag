const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://qegrncuwzgungvoqzlni.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZ3JuY3V3emd1bmd2b3F6bG5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NjYzNDQsImV4cCI6MjA5NjI0MjM0NH0.hAiY0spMsdeu9Ckm06r2Emu9Sd6eACr25A1S9fNWIC0');

async function main() {
  const { data, error } = await supabase.from('congress').select('*');
  console.log('Data:', data);
  console.log('Error:', error);
}

main();
