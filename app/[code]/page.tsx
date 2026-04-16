import { redirect, notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getSupabase } from '@/lib/supabase';
import DangerPage from './components/DangerPage';
import PreviewPage from './components/PreviewPage';
import PasswordGate from './components/PasswordGate';

interface Props {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ preview?: string }>;
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

export default async function RedirectPage({ params, searchParams }: Props) {
  const { code } = await params;
  const { preview } = await searchParams;

  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('urls')
      .select('original_url, click_count, scan_status, password_hash, safe_mode')
      .eq('short_code', code)
      .maybeSingle();

    if (error || !data) {
      notFound();
    }

    // 1. Dangerous / malicious → block
    if (data.scan_status === 'danger' || data.scan_status === 'malicious') {
      return <DangerPage code={code} />;
    }

    // 2. Password-protected → show gate
    if (data.password_hash !== null) {
      return <PasswordGate code={code} />;
    }

    // 3. Safe mode (per-link) or ?preview=1 → show preview
    if (data.safe_mode || preview === '1') {
      return (
        <PreviewPage
          url={data.original_url}
          scanStatus={data.scan_status}
          code={code}
        />
      );
    }

    // 4. Normal redirect — increment click count (best-effort, non-blocking)
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
