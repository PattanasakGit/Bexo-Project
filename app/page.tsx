'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, ShieldOff, BarChart2, Link2, LayoutGrid } from 'lucide-react';
import UrlShortenerForm from '@/components/UrlShortenerForm';
import HistoryList from '@/components/HistoryList';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';

const PILL_ICONS = [Zap, ShieldOff, BarChart2];

export default function Home() {
  const [historyTrigger, setHistoryTrigger] = useState(0);
  const { t } = useLanguage();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
      }}
    >
      <Navbar />

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          maxWidth: '720px',
          width: '100%',
          margin: '0 auto',
          padding: '72px 24px 96px',
        }}
      >
        {/* ── Hero ── */}
        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '48px' }}>
          {/* Status badge */}
          <div
            aria-label="Service status: free, instant, no account required"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '999px',
              padding: '5px 16px 5px 10px',
              marginBottom: '32px',
              boxShadow: '0 1px 4px rgba(44,32,20,0.07)',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: 'var(--success)',
                boxShadow: '0 0 0 2px rgba(124,158,110,0.2)',
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.03em' }}>
              {t.badge}
            </span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: 'clamp(40px, 9vw, 64px)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              margin: '0 0 20px',
            }}
          >
            <span style={{ display: 'block', color: 'var(--text-primary)' }}>{t.heading}</span>
            <span style={{ display: 'block', color: 'var(--accent)' }}>{t.headingAccent}</span>
          </h1>

          {/* Subline */}
          <p
            style={{
              fontSize: '16px',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              lineHeight: 1.65,
              margin: '0 auto',
              maxWidth: '400px',
            }}
          >
            {t.sub}
          </p>
        </div>

        {/* ── Form card ── */}
        <section aria-label="URL shortener" style={{ marginBottom: '14px' }}>
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1.5px solid var(--border)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(44,32,20,0.09), 0 1px 0 rgba(255,255,255,0.6) inset',
            }}
          >
            <div aria-hidden="true" style={{ height: '3px', background: 'linear-gradient(90deg, #D4A876, var(--accent), #9A6E48)' }} />
            <div style={{ padding: '28px 32px 32px' }}>
              <UrlShortenerForm onHistoryUpdate={() => setHistoryTrigger((n) => n + 1)} />
            </div>
          </div>
        </section>

        {/* ── Create Page CTA ── */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <Link
            href="/create"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)',
              textDecoration: 'none', padding: '6px 14px',
              border: '1.5px solid var(--border)', borderRadius: '999px',
              background: 'var(--bg-card)', letterSpacing: '0.01em',
              transition: 'all 0.15s',
              fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = 'var(--accent)';
              el.style.color = 'var(--accent)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = 'var(--border)';
              el.style.color = 'var(--text-secondary)';
            }}
          >
            <LayoutGrid size={13} strokeWidth={2} aria-hidden="true" />
            {t.createPageNav}
          </Link>
        </div>

        {/* ── Feature pills ── */}
        <ul
          aria-label="Key features"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '24px', flexWrap: 'wrap',
            marginBottom: '8px',
            listStyle: 'none', padding: 0, margin: '0 0 8px',
          }}
        >
          {t.pills.map((label, i) => {
            const Icon = PILL_ICONS[i];
            return (
              <li key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Icon size={13} strokeWidth={2} style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.01em' }}>
                  {label}
                </span>
                {i < t.pills.length - 1 && (
                  <span aria-hidden="true" style={{ marginLeft: '24px', fontSize: '12px', color: 'var(--border)', userSelect: 'none' }}>
                    ·
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        {/* ── History ── */}
        <HistoryList refreshTrigger={historyTrigger} />
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)' }} aria-label="Site footer">
        <div
          style={{
            maxWidth: '720px', margin: '0 auto', padding: '22px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              aria-hidden="true"
              style={{ width: '22px', height: '22px', borderRadius: '7px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Link2 size={11} strokeWidth={2.5} color="#fff" />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Bexo
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
            {t.footerTagline}
          </p>
        </div>
      </footer>
    </div>
  );
}
