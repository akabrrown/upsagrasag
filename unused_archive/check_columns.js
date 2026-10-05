const fs = require('fs');
const dotenv = require('dotenv');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const envVars = dotenv.parse(envContent);

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase credentials");
  process.exit(1);
}

async function checkColumns() {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/congress_events?limit=1`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Accept': 'application/json'
      }
    });
    
    if (res.ok) {
      const data = await res.json();
      console.log("Congress Data:", data);
      if (data && data.length > 0) {
        console.log("Congress Columns:", Object.keys(data[0]));
      } else {
        console.log("No data returned, cannot infer columns from empty array.");
      }
    } else {
      console.error("Error:", await res.text());
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

checkColumns();
