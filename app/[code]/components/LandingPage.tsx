'use client';

import Link from 'next/link';
import { PageWithLinks, PageLink } from '@/types';

interface ThemeVars {
  bg: string;
  card: string;
  text: string;
  textMuted: string;
  btn: string;
  btnText: string;
  accent: string;
}

const THEMES: Record<string, ThemeVars> = {
  warm: {
    bg: '#FAF7F2',
    card: '#FFFFFF',
    text: '#2C2014',
    textMuted: '#8B7355',
    btn: '#2C2014',
    btnText: '#FFFFFF',
    accent: '#B8845A',
  },
  dark: {
    bg: '#1A1A1A',
    card: '#2A2A2A',
    text: '#F5F5F5',
    textMuted: '#A0A0A0',
    btn: '#B8845A',
    btnText: '#FFFFFF',
    accent: '#D4A574',
  },
  gradient: {
    bg: 'linear-gradient(135deg, #6B73FF 0%, #9B59B6 100%)',
    card: 'rgba(255,255,255,0.15)',
    text: '#FFFFFF',
    textMuted: 'rgba(255,255,255,0.75)',
    btn: 'rgba(255,255,255,0.2)',
    btnText: '#FFFFFF',
    accent: '#FFFFFF',
  },
};

function getHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function LinkButton({ link, pageCode, theme }: { link: PageLink; pageCode: string; theme: ThemeVars }) {
  const handleClick = () => {
    fetch(`/api/page/${pageCode}/click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link_id: link.id }),
    }).catch(() => {});
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      style={{
        width: '100%',
        background: theme.btn,
        color: theme.btnText,
        border: '1.5px solid rgba(255,255,255,0.1)',
        borderRadius: '14px',
        padding: '14px 20px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textAlign: 'left',
        transition: 'transform 0.15s ease, opacity 0.15s ease',
        fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.opacity = '0.85';
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.opacity = '1';
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
      }}
    >
      <span style={{ fontSize: '20px', lineHeight: 1, flexShrink: 0 }}>🔗</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {link.title}
        </div>
        <div style={{ fontSize: '12px', opacity: 0.7, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {getHostname(link.url)}
        </div>
      </div>
    </button>
  );
}

interface LandingPageProps {
  page: PageWithLinks;
}

export default function LandingPage({ page }: LandingPageProps) {
  const theme = THEMES[page.theme] ?? THEMES.warm;
  const isGradient = page.theme === 'gradient';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
      }}
    >
      <main
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '60px 24px 80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Avatar */}
        <div
          className="animate-fade-up"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: isGradient ? 'rgba(255,255,255,0.2)' : theme.card,
            border: `2px solid ${isGradient ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.08)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            marginBottom: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            animationDelay: '0s',
          }}
        >
          {page.avatar_emoji}
        </div>

        {/* Title */}
        <h1
          className="animate-fade-up"
          style={{
            fontSize: '26px',
            fontWeight: 800,
            color: theme.text,
            textAlign: 'center',
            margin: '0 0 8px',
            letterSpacing: '-0.02em',
            animationDelay: '0.04s',
          }}
        >
          {page.title}
        </h1>

        {/* Bio */}
        {page.bio && (
          <p
            className="animate-fade-up"
            style={{
              fontSize: '15px',
              color: theme.textMuted,
              textAlign: 'center',
              margin: '0 0 32px',
              lineHeight: 1.6,
              maxWidth: '380px',
              animationDelay: '0.08s',
            }}
          >
            {page.bio}
          </p>
        )}

        {!page.bio && <div style={{ marginBottom: '32px' }} />}

        {/* Links */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {page.page_links.map((link, i) => (
            <div
              key={link.id}
              className="animate-fade-up"
              style={{ animationDelay: `${(i + 2) * 0.06}s` }}
            >
              <LinkButton link={link} pageCode={page.page_code} theme={theme} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <p
          className="animate-fade-up"
          style={{
            marginTop: '48px',
            fontSize: '12px',
            color: theme.textMuted,
            opacity: 0.7,
            animationDelay: `${(page.page_links.length + 2) * 0.06}s`,
          }}
        >
          Powered by{' '}
          <Link
            href="/"
            style={{ color: theme.accent, fontWeight: 700, textDecoration: 'none' }}
          >
            Bexo
          </Link>
        </p>
      </main>
    </div>
  );
}
