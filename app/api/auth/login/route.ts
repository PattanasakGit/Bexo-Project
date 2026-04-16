import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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

  const { email, password } = body as Record<string, unknown>;

  if (typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }

  if (!password.trim()) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password: password.trim(),
  });

  if (error) {
    // Supabase returns "Invalid login credentials" for wrong email/password
    if (error.message.toLowerCase().includes('invalid login') ||
        error.message.toLowerCase().includes('invalid credentials') ||
        error.message.toLowerCase().includes('email not confirmed')) {
      return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
    }
    // Rate limited by Supabase
    if (error.status === 429 || error.message.toLowerCase().includes('rate limit')) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
    }
    console.error('[auth/login]', error.message);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
