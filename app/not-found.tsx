'use client';

import Link from 'next/link';
import { Link2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border)',
          borderRadius: '28px',
          padding: '52px 40px',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 8px 40px rgba(44,32,20,0.09)',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'var(--accent-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
          }}
        >
          <Link2 size={24} strokeWidth={2} style={{ color: 'var(--accent)' }} />
        </div>

        {/* Label */}
        <p
          style={{
            fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)',
            letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px',
          }}
        >
          404
        </p>

        {/* Title */}
        <h1
          style={{
            fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)',
            letterSpacing: '-0.03em', margin: '0 0 12px',
          }}
        >
          Link not found
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: '15px', color: 'var(--text-secondary)', fontWeight: 500,
            lineHeight: 1.65, margin: '0 0 32px',
          }}
        >
          This short link doesn&apos;t exist or may have been removed.
        </p>

        {/* CTA */}
        <Link
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'var(--accent)',
            color: '#fff',
            padding: '13px 26px',
            borderRadius: '12px',
            fontWeight: 700, fontSize: '14px',
            textDecoration: 'none',
            transition: 'background 0.2s, transform 0.15s',
            boxShadow: '0 4px 14px rgba(184,132,90,0.35)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent-hover)';
            (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent)';
            (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
          }}
        >
          <ArrowLeft size={15} strokeWidth={2.5} />
          {t.about.backHome}
        </Link>
      </div>
    </div>
  );
}
