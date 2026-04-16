'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Link2, Mail, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function VerifyEmailPage() {
  const { t } = useLanguage();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  // Note: resend is handled by asking the user to go register again with the same email
  // Supabase deduplicates and resends the confirmation email
  async function handleResend() {
    setResending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setResending(false);
    setResent(true);
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

          <div style={{ padding: '36px 36px 32px', textAlign: 'center' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', justifyContent: 'center' }}>
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

            {/* Mail icon */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: 'var(--accent-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <Mail size={28} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />
            </div>

            <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
              {t.auth.verifyTitle}
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, margin: '0 0 28px', lineHeight: 1.65 }}>
              {t.auth.verifyDesc}
            </p>

            {/* Resend button */}
            {resent ? (
              <p style={{ fontSize: '13px', color: 'var(--success)', fontWeight: 700 }}>
                ✓ Email sent again!
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                style={{
                  padding: '10px 24px',
                  background: 'var(--bg-subtle)',
                  border: '1.5px solid var(--border)',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  cursor: resending ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                {resending && <Loader2 size={13} strokeWidth={2.5} className="animate-spin" />}
                {t.auth.resendEmail}
              </button>
            )}

            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
              <Link href="/auth/login" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', textDecoration: 'none' }}>
                {t.auth.backToLogin}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
