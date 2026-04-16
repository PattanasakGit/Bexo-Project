import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

// This route handles the PKCE code exchange for:
// - Email confirmation after registration
// - Password reset links
// Supabase redirects to /auth/callback?code=XXX after the user clicks the email link.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type'); // 'recovery' for password reset
  const next = searchParams.get('next') ?? '/dashboard';

  if (!code) {
    // No code — redirect to login with error
    return NextResponse.redirect(`${origin}/auth/login?error=missing_code`);
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    // Expired or invalid code
    return NextResponse.redirect(`${origin}/auth/login?error=expired_link`);
  }

  // Password reset flow → go to reset-password page
  if (type === 'recovery') {
    return NextResponse.redirect(`${origin}/auth/reset-password`);
  }

  // Default (email confirmation) → go to dashboard
  return NextResponse.redirect(`${origin}${next}`);
}
