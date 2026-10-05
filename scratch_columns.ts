import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function getColumns(tableName: string) {
  const res = await fetch(`${supabaseUrl}/rest/v1/`, {
    headers: {
      'apikey': supabaseKey!,
      'Authorization': `Bearer ${supabaseKey!}`,
      'Accept': 'application/openapi+json'
    }
  });
  if (res.ok) {
    const schema = await res.json();
    const definition = schema.definitions && schema.definitions[tableName];
    if (definition && definition.properties) {
      console.log('Columns for', tableName, ':', Object.keys(definition.properties));
    } else {
      console.log('Table not found in schema definitions:', tableName);
    }
  } else {
    console.error('Failed to fetch openapi schema:', res.status, await res.text());
  }
}

getColumns('academic_calendar');
