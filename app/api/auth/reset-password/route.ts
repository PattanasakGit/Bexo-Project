import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { isPasswordStrong } from '@/lib/password-strength';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }

  const { password } = body as Record<string, unknown>;

  if (typeof password !== 'string') {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }

  if (!isPasswordStrong(password.trim())) {
    return NextResponse.json({ error: 'weak_password' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  // Verify the user has a valid recovery session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'no_session' }, { status: 401 });
  }

  const { error } = await supabase.auth.updateUser({ password: password.trim() });

  if (error) {
    if (error.status === 422) {
      return NextResponse.json({ error: 'weak_password' }, { status: 400 });
    }
    console.error('[auth/reset-password]', error.message);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
