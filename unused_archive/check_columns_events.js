const fs = require('fs');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

const env = dotenv.parse(fs.readFileSync('.env.local'));
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env');
  process.exit(1);
}

(async () => {
  const res = await fetch(`${supabaseUrl}/rest/v1/events_programmes?limit=1`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Accept': 'application/json'
    }
  });
  if (!res.ok) {
    console.error('Error', await res.text());
    return;
  }
  const data = await res.json();
  console.log('Data:', data);
  if (data && data.length > 0) {
    console.log('Columns:', Object.keys(data[0]));
  }
})();
