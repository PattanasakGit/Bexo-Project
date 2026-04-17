import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

interface Props {
  params: Promise<{ code: string }>;
}

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const { link_id } = await request.json() as { link_id: unknown };

    if (!link_id || typeof link_id !== 'string') {
      return NextResponse.json({ error: 'link_id is required' }, { status: 400 });
    }

    const supabase = getSupabase();

    const { data: link } = await supabase
      .from('page_links')
      .select('id, click_count')
      .eq('id', link_id)
      .maybeSingle();

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    void Promise.resolve(
      supabase
        .from('page_links')
        .update({ click_count: (link.click_count ?? 0) + 1 })
        .eq('id', link_id)
    ).catch(() => {});

    // Suppress unused params warning — code param exists for routing context
    await params;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Click tracking error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
