import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { generateShortCode, isValidUrl, getBaseUrl } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body as { url: unknown };

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const trimmedUrl = url.trim();

    if (!isValidUrl(trimmedUrl)) {
      return NextResponse.json(
        { error: 'Please enter a valid URL (must start with http:// or https://)' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // Check if this URL was already shortened
    const { data: existing } = await supabase
      .from('urls')
      .select('short_code')
      .eq('original_url', trimmedUrl)
      .maybeSingle();

    if (existing) {
      const baseUrl = getBaseUrl();
      return NextResponse.json({
        short_code: existing.short_code,
        short_url: `${baseUrl}/${existing.short_code}`,
        original_url: trimmedUrl,
      });
    }

    // Generate a unique short code
    let shortCode = generateShortCode();
    let attempts = 0;

    while (attempts < 5) {
      const { data: conflict } = await supabase
        .from('urls')
        .select('short_code')
        .eq('short_code', shortCode)
        .maybeSingle();

      if (!conflict) break;
      shortCode = generateShortCode();
      attempts++;
    }

    // Insert new URL record
    const { data, error } = await supabase
      .from('urls')
      .insert({
        original_url: trimmedUrl,
        short_code: shortCode,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to create short URL. Please try again.' },
        { status: 500 }
      );
    }

    const baseUrl = getBaseUrl();
    return NextResponse.json({
      short_code: data.short_code,
      short_url: `${baseUrl}/${data.short_code}`,
      original_url: data.original_url,
    });
  } catch (error) {
    console.error('Shorten API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
