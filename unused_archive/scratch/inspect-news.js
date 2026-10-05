const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://qegrncuwzgungvoqzlni.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZ3JuY3V3emd1bmd2b3F6bG5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NjYzNDQsImV4cCI6MjA5NjI0MjM0NH0.hAiY0spMsdeu9Ckm06r2Emu9Sd6eACr25A1S9fNWIC0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('news_updates')
    .select('*')
    .eq('id', 'd99b6902-2747-4965-aa34-00e6732729d1')
    .single();

  if (error) {
    console.error('Error fetching:', error);
    return;
  }

  console.log('Title:', data.title);
  console.log('Content JSON:', JSON.stringify(data.content));
  fs.writeFileSync(path.join(__dirname, 'news-content.txt'), data.content, 'utf8');
  console.log('Saved to news-content.txt');
}

run();
