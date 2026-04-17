'use client';

import { useState, useRef, useEffect } from 'react';
import { ExternalLink, ShieldCheck, ShieldQuestion } from 'lucide-react';

interface PreviewPageProps {
  url: string;
  scanStatus: string;
  code: string;
}

function ScanBadge({ status }: { status: string }) {
  if (status === 'safe') {
    return (
      <span
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          padding: '4px 10px',
          background: '#F0FFF4', border: '1.5px solid #9AE6B4', borderRadius: '999px',
          fontSize: '12px', fontWeight: 700, color: '#276749',
        }}
      >
        <ShieldCheck size={13} strokeWidth={2.5} aria-hidden="true" />
        Scanned — Safe
      </span>
    );
  }
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: '4px 10px',
        background: '#FFFBEB', border: '1.5px solid #F6E05E', borderRadius: '999px',
        fontSize: '12px', fontWeight: 700, color: '#744210',
      }}
    >
      <ShieldQuestion size={13} strokeWidth={2.5} aria-hidden="true" />
      Scan Unknown
    </span>
  );
}

export default function PreviewPage({ url, scanStatus, code }: PreviewPageProps) {
  const [iframeVisible, setIframeVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // If onLoad hasn't fired within 6s, assume blocked — keep hidden
    timeoutRef.current = setTimeout(() => {
      if (!iframeVisible) setIframeVisible(false);
    }, 6000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleIframeLoad() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIframeVisible(true);
  }

  function handleIframeError() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Stay hidden — no error shown to user
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        background: 'var(--bg, #FDFAF7)',
        fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '480px', width: '100%',
          background: 'var(--bg-card, #fff)',
          border: '1.5px solid var(--border, #EDE5DB)',
          borderRadius: '24px', overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(44,32,20,0.1)',
        }}
      >
        {/* Accent top bar */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, var(--accent, #B8845A), #D4A97A)' }} />

        <div style={{ padding: '36px' }}>
          {/* Header */}
          <header style={{ marginBottom: '20px' }}>
            <p
              style={{
                fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'var(--text-muted, #A08060)', margin: '0 0 8px',
              }}
            >
              Preview · bexo/{code}
            </p>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary, #2C2014)', margin: '0 0 6px' }}>
              Destination Preview
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary, #7A6040)', margin: 0 }}>
              Review where this link will take you before proceeding.
            </p>
          </header>

          {/* ── Iframe preview — silently hidden on failure ── */}
          <div
            aria-hidden="true"
            style={{
              height: iframeVisible ? '240px' : '0',
              overflow: 'hidden',
              borderRadius: iframeVisible ? '12px' : '0',
              border: iframeVisible ? '1.5px solid var(--border, #EDE5DB)' : 'none',
              marginBottom: iframeVisible ? '16px' : '0',
              transition: 'height 0.35s ease, margin-bottom 0.35s ease',
            }}
          >
            <iframe
              src={url}
              title="Website preview"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              sandbox="allow-scripts allow-same-origin allow-forms"
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              tabIndex={-1}
            />
          </div>

          {/* URL display */}
          <div
            style={{
              background: 'var(--accent-light, #FDF6EE)',
              border: '1.5px solid rgba(184,132,90,0.25)',
              borderRadius: '14px', padding: '16px 18px', marginBottom: '16px',
              wordBreak: 'break-all',
            }}
          >
            <p
              style={{
                fontSize: '11px', fontWeight: 700, color: 'var(--text-muted, #A08060)',
                textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 6px',
              }}
            >
              Destination URL
            </p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent, #B8845A)', margin: 0, lineHeight: 1.5 }}>
              {url}
            </p>
          </div>

          {/* Scan badge */}
          <div style={{ marginBottom: '28px' }}>
            <ScanBadge status={scanStatus} />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <a
              href={url}
              rel="noopener noreferrer"
              aria-label={`Proceed to destination: ${url}`}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                padding: '13px 0',
                background: 'var(--accent, #B8845A)', color: '#fff',
                borderRadius: '12px', fontWeight: 700, fontSize: '14px',
                textDecoration: 'none', transition: 'background 0.15s, transform 0.12s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'var(--accent-hover, #A07040)';
                el.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'var(--accent, #B8845A)';
                el.style.transform = 'translateY(0)';
              }}
            >
              <ExternalLink size={15} strokeWidth={2.5} aria-hidden="true" />
              Proceed to Destination
            </a>
            <a
              href="/"
              aria-label="Cancel and go back to Bexo home"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '13px 18px',
                background: 'transparent', border: '1.5px solid var(--border, #EDE5DB)',
                color: 'var(--text-secondary, #7A6040)', borderRadius: '12px',
                fontWeight: 600, fontSize: '14px', textDecoration: 'none',
                transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'var(--bg-subtle, #F5EFE8)';
                el.style.borderColor = 'var(--accent, #B8845A)';
                el.style.color = 'var(--accent, #B8845A)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'transparent';
                el.style.borderColor = 'var(--border, #EDE5DB)';
                el.style.color = 'var(--text-secondary, #7A6040)';
              }}
            >
              Cancel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
