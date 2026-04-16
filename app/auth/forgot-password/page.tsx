'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Link2, Loader2, MailCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ForgotPasswordPage() {
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'rate_limited') {
          setError(t.auth.errorRateLimited);
        } else {
          setError(t.auth.errorGenericAuth);
        }
        return;
      }

      setSent(true);
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
      <div className="animate-fade-up" style={{ width: '100%', maxWidth: '420px' }}>
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border)',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(44,32,20,0.09), 0 1px 0 rgba(255,255,255,0.6) inset',
          }}
        >
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

            {sent ? (
              /* Success state */
              <div className="animate-fade-in" style={{ textAlign: 'center', padding: '12px 0' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: 'var(--success-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 18px',
                  }}
                >
                  <MailCheck size={24} strokeWidth={2} style={{ color: 'var(--success)' }} />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                  {t.auth.resetEmailSent}
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, margin: '0 0 24px', lineHeight: 1.6 }}>
                  {t.auth.resetEmailDesc}
                </p>
                <Link
                  href="/auth/login"
                  style={{
                    display: 'inline-block',
                    padding: '10px 24px',
                    background: 'var(--accent)',
                    color: '#fff',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  {t.auth.backToLogin}
                </Link>
              </div>
            ) : (
              /* Form */
              <>
                <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                  {t.auth.forgotTitle}
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 28px', fontWeight: 500 }}>
                  {t.auth.forgotSubtitle}
                </p>

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

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

                  <button
                    type="submit"
                    disabled={isLoading || !email.trim()}
                    style={{
                      width: '100%',
                      padding: '11px',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#fff',
                      background: isLoading || !email.trim() ? 'var(--text-muted)' : 'var(--accent)',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: isLoading || !email.trim() ? 'not-allowed' : 'pointer',
                      transition: 'background 0.15s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontFamily: 'inherit',
                    }}
                  >
                    {isLoading && <Loader2 size={15} strokeWidth={2.5} className="animate-spin" />}
                    {isLoading ? t.auth.sendingReset : t.auth.sendResetLink}
                  </button>
                </form>
              </>
            )}

            {!sent && (
              <p style={{ textAlign: 'center', marginTop: '22px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                <Link href="/auth/login" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>
                  {t.auth.backToLogin}
                </Link>
              </p>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            ← {t.about.backHome}
          </Link>
        </p>
      </div>
    </div>
  );
}
