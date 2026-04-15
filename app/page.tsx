'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Link2 } from 'lucide-react';
import UrlShortenerForm from '@/components/UrlShortenerForm';
import HistoryList from '@/components/HistoryList';
import { useLanguage, Language } from '@/contexts/LanguageContext';

const LANG_LABELS: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'th', label: 'TH' },
  { code: 'ja', label: 'JA' },
];

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
      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'rgba(250,247,242,0.88)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            padding: '0 24px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Link2 size={16} strokeWidth={2.5} color="#fff" />
            </div>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              Bexo
            </span>
          </div>

          {/* Nav right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* About link */}
            <Link
              href="/about"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '5px 12px',
                borderRadius: '20px',
                border: '1px solid transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-subtle)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'transparent';
              }}
            >
              {t.aboutLink}
            </Link>

            {/* Divider */}
            <div
              style={{
                width: '1px',
                height: '18px',
                background: 'var(--border)',
              }}
            />

            {/* Language switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              {LANG_LABELS.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '4px 9px',
                    borderRadius: '20px',
                    border: lang === code ? '1px solid var(--accent)' : '1px solid transparent',
                    background: lang === code ? 'var(--accent-light)' : 'transparent',
                    color: lang === code ? 'var(--accent)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                  }}
                  onMouseEnter={e => {
                    if (lang !== code) {
                      (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-subtle)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (lang !== code) {
                      (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
                    }
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          flex: 1,
          maxWidth: '680px',
          width: '100%',
          margin: '0 auto',
          padding: '56px 24px 80px',
        }}
      >
        {/* Hero — minimal */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1
            style={{
              fontSize: 'clamp(28px, 6vw, 44px)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              margin: '0 0 8px',
            }}
          >
            {t.heading}{' '}
            <span style={{ color: 'var(--accent)' }}>{t.headingAccent}</span>
          </h1>
        </div>

        {/* Form card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border)',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 4px 24px rgba(44,32,20,0.07)',
            marginBottom: '16px',
          }}
        >
          <UrlShortenerForm onHistoryUpdate={() => setHistoryTrigger((n) => n + 1)} />
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {t.pills.map((label) => (
            <span
              key={label}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: '4px 12px',
              }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* History */}
        <HistoryList refreshTrigger={historyTrigger} />
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-card)',
        }}
      >
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            padding: '20px 24px',
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
            <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Bexo
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            {t.footerText}
          </p>
        </div>
      </footer>
    </div>
  );
}
