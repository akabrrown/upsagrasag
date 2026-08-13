const fetch = require('node-fetch');
const fs = require('fs');
const dotenv = require('dotenv');

const env = dotenv.parse(fs.readFileSync('.env.local'));
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env');
  process.exit(1);
}

const id = 'c70582a3-28c3-40ca-8b09-d4f9d726f6fe';

const payload = {
  title: 'Business Deck Experience ',
  description: '',
  event_date: '2026-07-03T20:00:00+00:00',
  location: 'The Hive at Tse Addo',
  image_url: 'https://res.cloudinary.com/dldph7uzu/image/upload/v1782852021/IMG-20260630-WA0057_pthkct.jpg',
  is_featured: false,
  url: 'https://example.com'
};

(async () => {
  const res = await fetch(`${supabaseUrl}/rest/v1/events_programmes?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(payload)
  });
  const text = await res.text();
  console.log('Status', res.status);
  console.log('Body', text);
})();
