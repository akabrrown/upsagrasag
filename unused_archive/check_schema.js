const fs = require('fs');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

const env = dotenv.parse(fs.readFileSync('.env.local'));
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

(async () => {
  const res = await fetch(`${supabaseUrl}/rest/v1/`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Accept': 'application/openapi+json'
    }
  });
  if (!res.ok) {
    console.error('Error fetching schema', await res.text());
    return;
  }
  const schema = await res.json();
  const def = schema.definitions && schema.definitions['events_programmes'];
  if (def && def.properties) {
    console.log('Columns for events_programmes:', Object.keys(def.properties));
  } else {
    console.log('Definition not found or no properties');
  }
})();
