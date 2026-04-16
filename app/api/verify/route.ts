import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, password } = body as { code: unknown; password: unknown };

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('urls')
      .select('original_url, password_hash, click_count')
      .eq('short_code', code)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    if (!data.password_hash) {
      return NextResponse.json({ error: 'This link is not password-protected' }, { status: 400 });
    }

    const inputHash = createHash('sha256').update(password).digest('hex');
    if (inputHash !== data.password_hash) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // Increment click count (best-effort)
    const newCount = (data.click_count ?? 0) + 1;
    void supabase
      .from('urls')
      .update({ click_count: newCount })
      .eq('short_code', code)
      .then(() => {});

    return NextResponse.json({ success: true, url: data.original_url });
  } catch (error) {
    console.error('Verify API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
