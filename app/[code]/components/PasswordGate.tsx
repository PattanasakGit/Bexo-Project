'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react';

interface PasswordGateProps {
  code: string;
}

export default function PasswordGate({ code }: PasswordGateProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, password }),
      });
      const data = (await res.json()) as { success?: boolean; url?: string; error?: string };

      if (res.ok && data.success && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? 'Incorrect password. Please try again.');
        setLoading(false);
      }
    } catch {
      setError('Network error. Please check your connection.');
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--bg, #FDFAF7)',
        fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '400px',
          width: '100%',
          background: 'var(--bg-card, #fff)',
          border: '1.5px solid var(--border, #EDE5DB)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(44,32,20,0.1)',
        }}
      >
        {/* Accent top bar */}
        <div
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, var(--accent, #B8845A), #D4A97A)',
          }}
        />

        <div style={{ padding: '36px' }}>
          {/* Icon */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--accent-light, #FDF6EE)',
              border: '1.5px solid rgba(184,132,90,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <Lock size={26} strokeWidth={1.8} style={{ color: 'var(--accent, #B8845A)' }} />
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '20px',
              fontWeight: 800,
              color: 'var(--text-primary, #2C2014)',
              margin: '0 0 8px',
            }}
          >
            Password Required
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary, #7A6040)',
              margin: '0 0 28px',
              lineHeight: 1.5,
            }}
          >
            This link is protected. Enter the password to continue.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Password input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg, #FDFAF7)',
                border: `1.5px solid ${error ? '#E53E3E' : 'var(--border, #EDE5DB)'}`,
                borderRadius: '12px',
                padding: '4px 4px 4px 14px',
                marginBottom: error ? '8px' : '16px',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocusCapture={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent, #B8845A)';
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 0 0 3px rgba(184,132,90,0.12)';
              }}
              onBlurCapture={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = error
                  ? '#E53E3E'
                  : 'var(--border, #EDE5DB)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter password"
                disabled={loading}
                autoFocus
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: 'var(--text-primary, #2C2014)',
                  fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                  padding: '10px 0',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--text-muted, #A08060)',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color =
                    'var(--text-primary, #2C2014)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color =
                    'var(--text-muted, #A08060)')
                }
              >
                {showPassword ? (
                  <EyeOff size={16} strokeWidth={2} />
                ) : (
                  <Eye size={16} strokeWidth={2} />
                )}
              </button>
            </div>

            {/* Error */}
            {error && (
              <p
                style={{
                  fontSize: '13px',
                  color: '#C53030',
                  fontWeight: 500,
                  margin: '0 0 16px',
                  paddingLeft: '2px',
                }}
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !password.trim()}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '13px 0',
                background:
                  loading || !password.trim() ? 'var(--bg-subtle, #F5EFE8)' : 'var(--accent, #B8845A)',
                color: loading || !password.trim() ? 'var(--text-muted, #A08060)' : '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 700,
                fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                cursor: loading || !password.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.18s',
              }}
              onMouseEnter={(e) => {
                if (!loading && password.trim()) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    'var(--accent-hover, #A07040)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    '0 4px 12px rgba(184,132,90,0.35)';
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background =
                  loading || !password.trim()
                    ? 'var(--bg-subtle, #F5EFE8)'
                    : 'var(--accent, #B8845A)';
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={15} strokeWidth={2.5} className="animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  <Lock size={15} strokeWidth={2.5} />
                  Unlock Link
                </>
              )}
            </button>
          </form>

          {/* Back link */}
          <p
            style={{
              textAlign: 'center',
              marginTop: '18px',
              fontSize: '13px',
              color: 'var(--text-muted, #A08060)',
            }}
          >
            <Link
              href="/"
              style={{
                color: 'var(--accent, #B8845A)',
                fontWeight: 600,
                textDecoration: 'none',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none')
              }
            >
              ← Back to Bexo
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
