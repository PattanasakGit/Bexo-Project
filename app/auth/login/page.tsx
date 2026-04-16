'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Link2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Inner component — uses useSearchParams, must be inside Suspense
function LoginContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError === 'expired_link') setError(t.auth.errorExpiredLink);
    if (urlError === 'missing_code') setError(t.auth.errorGenericAuth);
  }, [searchParams, t.auth.errorExpiredLink, t.auth.errorGenericAuth]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMap: Record<string, string> = {
          invalid_email: t.auth.errorInvalidEmail,
          invalid_credentials: t.auth.errorInvalidCredentials,
          rate_limited: t.auth.errorRateLimited,
          server_error: t.auth.errorGenericAuth,
        };
        setError(errorMap[data.error] ?? t.auth.errorGenericAuth);
        return;
      }

      const redirect = searchParams.get('redirect') ?? '/dashboard';
      router.push(redirect);
      router.refresh();
    } catch {
      setError(t.auth.errorGenericAuth);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
      }}
    >
      <div
        className="animate-fade-up"
        style={{ width: '100%', maxWidth: '420px' }}
      >
        {/* Card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border)',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(44,32,20,0.09), 0 1px 0 rgba(255,255,255,0.6) inset',
          }}
        >
          {/* Gradient accent bar */}
          <div style={{ height: '3px', background: 'linear-gradient(90deg, #D4A876, var(--accent), #9A6E48)' }} />

          <div style={{ padding: '36px 36px 32px' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(184,132,90,0.35)',
                }}
              >
                <Link2 size={16} strokeWidth={2.5} color="#fff" />
              </div>
              <span style={{ fontSize: '19px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                Bexo
              </span>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              {t.auth.loginTitle}
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 28px', fontWeight: 500 }}>
              {t.auth.loginSubtitle}
            </p>

            {/* Error */}
            {error && (
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginBottom: '18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#DC2626',
                }}
              >
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {t.auth.emailLabel}
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.auth.emailPlaceholder}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    background: 'var(--bg)',
                    border: '1.5px solid var(--border)',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(184,132,90,0.12)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {t.auth.passwordLabel}
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}
                  >
                    {t.auth.forgotPassword}
                  </Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 42px 10px 14px',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      background: 'var(--bg)',
                      border: '1.5px solid var(--border)',
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(184,132,90,0.12)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                style={{
                  marginTop: '4px',
                  width: '100%',
                  padding: '11px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#fff',
                  background: isLoading || !email || !password ? 'var(--text-muted)' : 'var(--accent)',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: isLoading || !email || !password ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontFamily: 'inherit',
                }}
              >
                {isLoading && <Loader2 size={15} strokeWidth={2.5} className="animate-spin" />}
                {isLoading ? t.auth.signingIn : t.auth.loginBtn}
              </button>
            </form>

            {/* Register link */}
            <p style={{ textAlign: 'center', marginTop: '22px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              {t.auth.noAccount}{' '}
              <Link href="/auth/register" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>
                {t.auth.signUpLink}
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            ← {t.about.backHome}
          </Link>
        </p>
      </div>
    </div>
  );
}

// Suspense wrapper required by Next.js for useSearchParams()
export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
