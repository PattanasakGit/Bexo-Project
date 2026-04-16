'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Link2, Zap, ShieldOff, BarChart2 } from 'lucide-react';
import UrlShortenerForm from '@/components/UrlShortenerForm';
import HistoryList from '@/components/HistoryList';
import { useLanguage, Language } from '@/contexts/LanguageContext';

const LANG_OPTIONS: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'th', label: 'TH' },
  { code: 'ja', label: 'JA' },
];

const PILL_ICONS = [Zap, ShieldOff, BarChart2];

export default function Home() {
  const [historyTrigger, setHistoryTrigger] = useState(0);
  const { lang, setLang, t } = useLanguage();

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
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'rgba(250,247,242,0.9)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            padding: '0 24px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
            <span
              style={{
                fontSize: '19px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em',
              }}
            >
              Bexo
            </span>
          </div>

          {/* Right nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Link
              href="/about"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '6px 13px',
                borderRadius: '8px',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-subtle)';
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)';
              }}
            >
              {t.aboutLink}
            </Link>

            {/* Divider */}
            <div style={{ width: '1px', height: '16px', background: 'var(--border)', margin: '0 4px' }} />

            {/* Language switcher */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '3px',
                gap: '2px',
              }}
            >
              {LANG_OPTIONS.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '7px',
                    border: 'none',
                    background: lang === code ? 'var(--bg-card)' : 'transparent',
                    color: lang === code ? 'var(--text-primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: lang === code ? '0 1px 4px rgba(44,32,20,0.1)' : 'none',
                    fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                    letterSpacing: '0.02em',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

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
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--success)',
                boxShadow: '0 0 0 2px rgba(124,158,110,0.2)',
              }}
            />
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                letterSpacing: '0.03em',
              }}
            >
              {t.badge}
            </span>
          </div>

          {/* Two-line headline */}
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
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border)',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(44,32,20,0.09), 0 1px 0 rgba(255,255,255,0.6) inset',
            marginBottom: '14px',
          }}
        >
          {/* Gradient accent top bar */}
          <div
            style={{
              height: '3px',
              background: 'linear-gradient(90deg, #D4A876, var(--accent), #9A6E48)',
            }}
          />
          <div style={{ padding: '28px 32px 32px' }}>
            <UrlShortenerForm onHistoryUpdate={() => setHistoryTrigger((n) => n + 1)} />
          </div>
        </div>

        {/* ── Feature row ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            marginBottom: '8px',
          }}
        >
          {t.pills.map((label, i) => {
            const Icon = PILL_ICONS[i];
            return (
              <div
                key={label}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Icon size={13} strokeWidth={2} style={{ color: 'var(--text-muted)' }} />
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.01em',
                  }}
                >
                  {label}
                </span>
                {i < t.pills.length - 1 && (
                  <span
                    style={{
                      marginLeft: '24px',
                      fontSize: '12px',
                      color: 'var(--border)',
                      userSelect: 'none',
                    }}
                  >
                    ·
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* ── History ── */}
        <HistoryList refreshTrigger={historyTrigger} />
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)' }}>
        <div
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            padding: '22px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '7px',
                background: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
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
