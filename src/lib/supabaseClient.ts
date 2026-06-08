import { createClient } from '@supabase/supabase-js';

// Fallback values for local development. In production set these env vars.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'public-anon-key';

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
