import { createClient } from '@supabase/supabase-js';

// Service role client – use only on the server
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
);

export default supabaseAdmin;
