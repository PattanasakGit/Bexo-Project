import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import DashboardClient from './DashboardClient';

// This is a Server Component — auth check happens on the server.
// Middleware also protects this route, but we double-check here for safety.
export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .single();

  // Fetch user's links
  const { data: links } = await supabase
    .from('urls')
    .select('id, short_code, original_url, click_count, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <DashboardClient
      user={{ id: user.id, email: user.email ?? '' }}
      initialDisplayName={profile?.display_name ?? ''}
      initialLinks={links ?? []}
    />
  );
}
