import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { generateShortCode, isValidUrl, normalizeUrl, getBaseUrl } from '@/lib/utils';
import { CreatePageRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreatePageRequest;
    const { title, bio, avatar_emoji, theme, links } = body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Page title is required' }, { status: 400 });
    }

    if (title.trim().length > 60) {
      return NextResponse.json({ error: 'Title must be 60 characters or less' }, { status: 400 });
    }

    if (!links || !Array.isArray(links) || links.length === 0) {
      return NextResponse.json({ error: 'At least one link is required' }, { status: 400 });
    }

    if (links.length > 20) {
      return NextResponse.json({ error: 'Maximum 20 links allowed' }, { status: 400 });
    }

    for (const link of links) {
      if (!link.title || !link.title.trim()) {
        return NextResponse.json({ error: 'Each link must have a title' }, { status: 400 });
      }
      if (link.title.trim().length > 80) {
        return NextResponse.json({ error: 'Link title must be 80 characters or less' }, { status: 400 });
      }
      const normalizedLinkUrl = normalizeUrl(link.url ?? '');
      if (!normalizedLinkUrl || !isValidUrl(normalizedLinkUrl)) {
        return NextResponse.json(
          { error: `Invalid URL: ${link.url}. Must be a valid web address.` },
          { status: 400 }
        );
      }
    }

    const supabase = getSupabase();

    // Generate unique page_code — check both urls and pages tables
    let pageCode = generateShortCode();
    let attempts = 0;

    while (attempts < 5) {
      const [{ data: urlConflict }, { data: pageConflict }] = await Promise.all([
        supabase.from('urls').select('short_code').eq('short_code', pageCode).maybeSingle(),
        supabase.from('pages').select('page_code').eq('page_code', pageCode).maybeSingle(),
      ]);

      if (!urlConflict && !pageConflict) break;
      pageCode = generateShortCode();
      attempts++;
    }

    const { data: page, error: pageError } = await supabase
      .from('pages')
      .insert({
        page_code: pageCode,
        title: title.trim(),
        bio: bio?.trim() || null,
        avatar_emoji: avatar_emoji || '🔗',
        theme: theme || 'warm',
      })
      .select()
      .single();

    if (pageError || !page) {
      console.error('Page insert error:', pageError);
      return NextResponse.json({ error: 'Failed to create page. Please try again.' }, { status: 500 });
    }

    const linkRows = links.map((link, i) => ({
      page_id: page.id,
      title: link.title.trim(),
      url: normalizeUrl(link.url),
      position: i,
    }));

    const { error: linksError } = await supabase.from('page_links').insert(linkRows);

    if (linksError) {
      console.error('Page links insert error:', linksError);
      return NextResponse.json({ error: 'Failed to save links. Please try again.' }, { status: 500 });
    }

    const baseUrl = getBaseUrl();
    return NextResponse.json({
      page_code: pageCode,
      page_url: `${baseUrl}/${pageCode}`,
      title: page.title,
    });
  } catch (error) {
    console.error('Create page API error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}
