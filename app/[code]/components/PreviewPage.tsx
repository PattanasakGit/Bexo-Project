'use client';

import { ExternalLink, ShieldCheck, ShieldQuestion, ArrowLeft } from 'lucide-react';

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
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          background: '#F0FFF4',
          border: '1.5px solid #9AE6B4',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: 700,
          color: '#276749',
        }}
      >
        <ShieldCheck size={13} strokeWidth={2.5} />
        Scanned — Safe
      </span>
    );
  }
  // unscanned, warning, unknown, pending → neutral badge
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '4px 10px',
        background: '#FFFBEB',
        border: '1.5px solid #F6E05E',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 700,
        color: '#744210',
      }}
    >
      <ShieldQuestion size={13} strokeWidth={2.5} />
      Not Yet Scanned
    </span>
  );
}

export default function PreviewPage({ url, scanStatus, code }: PreviewPageProps) {
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
          maxWidth: '480px',
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
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <p
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-muted, #A08060)',
                margin: '0 0 8px',
              }}
            >
              Preview · bexo/{code}
            </p>
            <h1
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: 'var(--text-primary, #2C2014)',
                margin: '0 0 6px',
              }}
            >
              Destination Preview
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary, #7A6040)', margin: 0 }}>
              Review where this link will take you before proceeding.
            </p>
          </div>

          {/* URL display */}
          <div
            style={{
              background: 'var(--accent-light, #FDF6EE)',
              border: '1.5px solid rgba(184,132,90,0.25)',
              borderRadius: '14px',
              padding: '16px 18px',
              marginBottom: '16px',
              wordBreak: 'break-all',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-muted, #A08060)',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                margin: '0 0 6px',
              }}
            >
              Destination URL
            </p>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--accent, #B8845A)',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
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
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                padding: '13px 0',
                background: 'var(--accent, #B8845A)',
                color: '#fff',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'background 0.15s, transform 0.12s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'var(--accent-hover, #A07040)';
                el.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'var(--accent, #B8845A)';
                el.style.transform = 'translateY(0)';
              }}
            >
              <ExternalLink size={15} strokeWidth={2.5} />
              Proceed to Destination
            </a>
            <a
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '13px 18px',
                background: 'transparent',
                border: '1.5px solid var(--border, #EDE5DB)',
                color: 'var(--text-secondary, #7A6040)',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'var(--bg-subtle, #F5EFE8)';
                el.style.borderColor = 'var(--accent, #B8845A)';
                el.style.color = 'var(--accent, #B8845A)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = 'transparent';
                el.style.borderColor = 'var(--border, #EDE5DB)';
                el.style.color = 'var(--text-secondary, #7A6040)';
              }}
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
              Cancel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
