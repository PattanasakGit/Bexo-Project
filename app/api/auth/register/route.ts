import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { isPasswordStrong } from '@/lib/password-strength';

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

  if (!isPasswordStrong(password.trim())) {
    return NextResponse.json({ error: 'weak_password' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const { error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password: password.trim(),
    options: {
      emailRedirectTo: `${baseUrl}/auth/callback`,
    },
  });

  if (error) {
    // Supabase returns "User already registered" for duplicate emails
    if (error.message.toLowerCase().includes('already registered') ||
        error.message.toLowerCase().includes('already exists')) {
      return NextResponse.json({ error: 'email_taken' }, { status: 409 });
    }
    console.error('[auth/register]', error.message);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
