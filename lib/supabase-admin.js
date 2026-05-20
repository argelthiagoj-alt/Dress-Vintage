// ============================================
// Supabase admin client (server-only, uses service role).
// Bypasses RLS. NEVER import this from anything that ships to the browser.
// ============================================

import { createClient } from '@supabase/supabase-js';

let _client = null;

export function supabaseAdmin() {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Supabase env vars missing: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
    );
  }
  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'X-Client-Info': 'dressvintage-api' } },
  });
  return _client;
}
