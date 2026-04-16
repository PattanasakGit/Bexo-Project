'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Link2, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import PasswordStrengthBar from '@/components/PasswordStrengthBar';
import { isPasswordStrong } from '@/lib/password-strength';

export default function ResetPasswordPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const canSubmit = isPasswordStrong(password) && password === confirmPassword && !isLoading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!canSubmit) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMap: Record<string, string> = {
          no_session: t.auth.errorSessionExpired,
          weak_password: t.auth.errorWeakPassword,
          server_error: t.auth.errorGenericAuth,
        };
        setError(errorMap[data.error] ?? t.auth.errorGenericAuth);
        return;
      }

      setDone(true);
      setTimeout(() => router.push('/dashboard'), 2000);
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

            {done ? (
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
                  <CheckCircle2 size={24} strokeWidth={2} style={{ color: 'var(--success)' }} />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                  Password updated!
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, margin: 0 }}>
                  Redirecting to your dashboard…
                </p>
              </div>
            ) : (
              <>
                <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                  {t.auth.resetTitle}
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 28px', fontWeight: 500 }}>
                  {t.auth.resetSubtitle}
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
                    {error === t.auth.errorSessionExpired && (
                      <Link href="/auth/forgot-password" style={{ display: 'block', marginTop: '6px', color: '#DC2626', fontWeight: 700 }}>
                        {t.auth.forgotTitle} →
                      </Link>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      {t.auth.newPasswordLabel}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
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
                      >
                        {showPassword ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
                      </button>
                    </div>
                    <PasswordStrengthBar password={password} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      {t.auth.confirmPasswordLabel}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder={t.auth.confirmPasswordPlaceholder}
                        style={{
                          width: '100%',
                          padding: '10px 42px 10px 14px',
                          fontSize: '14px',
                          fontWeight: 500,
                          color: 'var(--text-primary)',
                          background: 'var(--bg)',
                          border: `1.5px solid ${passwordMismatch ? '#FCA5A5' : 'var(--border)'}`,
                          borderRadius: '10px',
                          outline: 'none',
                          transition: 'border-color 0.15s, box-shadow 0.15s',
                          fontFamily: 'inherit',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = passwordMismatch ? '#FCA5A5' : 'var(--accent)';
                          e.currentTarget.style.boxShadow = passwordMismatch ? 'none' : '0 0 0 3px rgba(184,132,90,0.12)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = passwordMismatch ? '#FCA5A5' : 'var(--border)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
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
                      >
                        {showConfirm ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
                      </button>
                    </div>
                    {passwordMismatch && (
                      <p style={{ fontSize: '12px', color: '#DC2626', fontWeight: 600, marginTop: '5px' }}>
                        {t.auth.passwordsNoMatch}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    style={{
                      marginTop: '4px',
                      width: '100%',
                      padding: '11px',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#fff',
                      background: !canSubmit ? 'var(--text-muted)' : 'var(--accent)',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: !canSubmit ? 'not-allowed' : 'pointer',
                      transition: 'background 0.15s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontFamily: 'inherit',
                    }}
                  >
                    {isLoading && <Loader2 size={15} strokeWidth={2.5} className="animate-spin" />}
                    {isLoading ? t.auth.resetting : t.auth.resetBtn}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
