import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

// Browser-side Supabase client — stores session in cookies automatically.
// Use this in 'use client' components and client-side hooks.
let _browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseBrowser() {
  if (_browserClient) return _browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  _browserClient = createBrowserClient<Database>(url, key);
  return _browserClient;
}
