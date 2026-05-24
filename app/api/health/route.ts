import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('urls').select('id').limit(1);

    if (error) {
      return NextResponse.json(
        { ok: false, service: 'bexo', database: 'error' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      ok: true,
      service: 'bexo',
      database: 'reachable',
      checked_at: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { ok: false, service: 'bexo', database: 'unconfigured' },
      { status: 503 }
    );
  }
}
