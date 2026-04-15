import { redirect, notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getSupabase } from '@/lib/supabase';

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from('urls')
      .select('original_url')
      .eq('short_code', code)
      .maybeSingle();

    if (!data) {
      return { title: 'Link Not Found — Bexo' };
    }

    return {
      title: 'Redirecting — Bexo',
      robots: { index: false, follow: false },
    };
  } catch {
    return { title: 'Link Not Found — Bexo' };
  }
}

export default async function RedirectPage({ params }: Props) {
  const { code } = await params;

  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('urls')
      .select('original_url, click_count')
      .eq('short_code', code)
      .maybeSingle();

    if (error || !data) {
      notFound();
    }

    // Increment click count (best-effort, non-blocking)
    const newCount = (data.click_count ?? 0) + 1;
    void Promise.resolve(
      supabase.from('urls').update({ click_count: newCount }).eq('short_code', code)
    ).catch(() => {});

    redirect(data.original_url);
  } catch (err) {
    // Re-throw Next.js redirect errors (redirect() throws internally)
    if ((err as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) {
      throw err;
    }
    notFound();
  }
}
