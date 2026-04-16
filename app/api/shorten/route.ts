import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { generateShortCode, isValidUrl, getBaseUrl } from '@/lib/utils';
import { scanUrl } from '@/lib/scan';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, password, safe_mode } = body as {
      url: unknown;
      password?: unknown;
      safe_mode?: unknown;
    };

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

    const passwordStr = typeof password === 'string' && password.trim() ? password.trim() : null;
    const safeModeVal = safe_mode === true || safe_mode === 'true';

    const supabase = getSupabase();

    // Check if this URL was already shortened (only reuse if no password and no safe_mode override)
    if (!passwordStr && !safeModeVal) {
      const { data: existing } = await supabase
        .from('urls')
        .select('short_code, safe_mode, scan_status')
        .eq('original_url', trimmedUrl)
        .is('password_hash', null)
        .maybeSingle();

      if (existing) {
        const baseUrl = getBaseUrl();
        return NextResponse.json({
          short_code: existing.short_code,
          short_url: `${baseUrl}/${existing.short_code}`,
          original_url: trimmedUrl,
          safe_mode: existing.safe_mode,
          scan_status: existing.scan_status,
        });
      }
    }

    // Hash password if provided
    const passwordHash = passwordStr
      ? createHash('sha256').update(passwordStr).digest('hex')
      : null;

    // Scan URL for malware
    const scanStatus = await scanUrl(trimmedUrl);
    if (scanStatus === 'malicious') {
      return NextResponse.json(
        { error: 'This URL has been flagged as malicious and cannot be shortened.' },
        { status: 400 }
      );
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
        password_hash: passwordHash,
        safe_mode: safeModeVal,
        scan_status: scanStatus,
        scanned_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: `DB error: ${error.message} (code: ${error.code})` },
        { status: 500 }
      );
    }

    const baseUrl = getBaseUrl();
    return NextResponse.json({
      short_code: data.short_code,
      short_url: `${baseUrl}/${data.short_code}`,
      original_url: data.original_url,
      safe_mode: data.safe_mode,
      scan_status: data.scan_status,
    });
  } catch (error) {
    console.error('Shorten API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
