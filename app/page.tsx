'use client';

import { useState } from 'react';
import { Link2 } from 'lucide-react';
import UrlShortenerForm from '@/components/UrlShortenerForm';
import HistoryList from '@/components/HistoryList';

export default function Home() {
  const [historyTrigger, setHistoryTrigger] = useState(0);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'rgba(250,247,242,0.85)',
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
                fontFamily: 'var(--font-nunito), Nunito, sans-serif',
                letterSpacing: '-0.02em',
              }}
            >
              Bexo
            </span>
          </div>

          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '4px 12px',
              fontFamily: 'var(--font-nunito), Nunito, sans-serif',
            }}
          >
            Free · No signup
          </span>
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          flex: 1,
          maxWidth: '680px',
          width: '100%',
          margin: '0 auto',
          padding: '64px 24px 80px',
        }}
      >
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              background: 'var(--accent-light)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '5px 14px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent)',
              }}
            />
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--accent)',
                fontFamily: 'var(--font-nunito), Nunito, sans-serif',
                letterSpacing: '0.03em',
              }}
            >
              Instant · Free · No account needed
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(32px, 6vw, 48px)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-nunito), Nunito, sans-serif',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              margin: '0 0 16px',
            }}
          >
            Shorten your URLs{' '}
            <span style={{ color: 'var(--accent)' }}>beautifully</span>
          </h1>

          <p
            style={{
              fontSize: '16px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-nunito), Nunito, sans-serif',
              fontWeight: 500,
              lineHeight: 1.6,
              maxWidth: '420px',
              margin: '0 auto',
            }}
          >
            Paste a long URL and get a clean, shareable link in seconds.
            Your history stays in your browser — no account needed.
          </p>
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
            gap: '10px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {[
            { label: 'Lightning fast' },
            { label: 'Cookie-based history' },
            { label: 'Click tracking' },
          ].map((f) => (
            <span
              key={f.label}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: '5px 12px',
                fontFamily: 'var(--font-nunito), Nunito, sans-serif',
              }}
            >
              {f.label}
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
            <span
              style={{
                fontSize: '14px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-nunito), Nunito, sans-serif',
              }}
            >
              Bexo
            </span>
          </div>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-nunito), Nunito, sans-serif',
              margin: 0,
            }}
          >
            Your links, your data. Always free.
          </p>
        </div>
      </footer>
    </div>
  );
}
