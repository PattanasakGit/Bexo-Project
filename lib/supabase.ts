import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

// Lazy singleton — client is only created on first use at runtime,
// not at module evaluation time (avoids build-time errors when env vars are absent).
let _client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabase() {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase environment variables. ' +
        'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    );
  }

  _client = createClient<Database>(url, key);
  return _client;
}
