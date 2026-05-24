import { redirect, notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getSupabase } from '@/lib/supabase';
import DangerPage from './components/DangerPage';
import PreviewPage from './components/PreviewPage';
import PasswordGate from './components/PasswordGate';
import LandingPage from './components/LandingPage';
import { PageWithLinks } from '@/types';

interface Props {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ preview?: string }>;
}

type RedirectResult =
  | { kind: 'danger' }
  | { kind: 'password' }
  | { kind: 'preview'; url: string; scanStatus: string }
  | { kind: 'landing'; page: PageWithLinks };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  try {
    const supabase = getSupabase();

    const { data: urlData } = await supabase
      .from('urls')
      .select('original_url')
      .eq('short_code', code)
      .maybeSingle();

    if (urlData) {
      return {
        title: 'Redirecting — Bexo',
        robots: { index: false, follow: false },
      };
    }

    const { data: pageData } = await supabase
      .from('pages')
      .select('title')
      .eq('page_code', code)
      .maybeSingle();

    if (pageData) {
      return { title: `${pageData.title} — Bexo` };
    }

    return { title: 'Link Not Found — Bexo' };
  } catch {
    return { title: 'Link Not Found — Bexo' };
  }
}

export default async function RedirectPage({ params, searchParams }: Props) {
  const { code } = await params;
  const { preview } = await searchParams;
  let result: RedirectResult;

  try {
    const supabase = getSupabase();

    // 1. Check urls table first
    const { data, error } = await supabase
      .from('urls')
      .select('original_url, click_count, scan_status, password_hash, safe_mode')
      .eq('short_code', code)
      .maybeSingle();

    if (!error && data) {
      // Malicious → block
      if (data.scan_status === 'malicious') {
        result = { kind: 'danger' };
      }

      // Password-protected → show gate
      else if (data.password_hash !== null) {
        result = { kind: 'password' };
      }

      // Safe mode (per-link) or ?preview=1 → show preview
      else if (data.safe_mode || preview === '1') {
        result = { kind: 'preview', url: data.original_url, scanStatus: data.scan_status };
      } else {
        // Normal redirect — increment click count (best-effort, non-blocking)
        const newCount = (data.click_count ?? 0) + 1;
        void Promise.resolve(
          supabase.from('urls').update({ click_count: newCount }).eq('short_code', code)
        ).catch(() => {});

        redirect(data.original_url);
      }
    } else {
      // 2. Check pages table
      const { data: page } = await supabase
        .from('pages')
        .select('*, page_links(*)')
        .eq('page_code', code)
        .maybeSingle();

      if (!page) {
        notFound();
      }

      // Increment view_count non-blocking
      void Promise.resolve(
        supabase
          .from('pages')
          .update({ view_count: (page.view_count ?? 0) + 1 })
          .eq('page_code', code)
      ).catch(() => {});

      const pageWithLinks = page as PageWithLinks;
      pageWithLinks.page_links = (pageWithLinks.page_links ?? []).sort(
        (a, b) => a.position - b.position
      );

      result = { kind: 'landing', page: pageWithLinks };
    }
  } catch (err) {
    // Re-throw Next.js redirect errors
    if ((err as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) {
      throw err;
    }
    notFound();
  }

  if (result.kind === 'danger') {
    return <DangerPage code={code} />;
  }

  if (result.kind === 'password') {
    return <PasswordGate code={code} />;
  }

  if (result.kind === 'preview') {
    return <PreviewPage url={result.url} scanStatus={result.scanStatus} code={code} />;
  }

  return <LandingPage page={result.page} />;
}
