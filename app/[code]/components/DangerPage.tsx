'use client';

import Link from 'next/link';
import { ShieldX } from 'lucide-react';

interface DangerPageProps {
  code: string;
}

export default function DangerPage({ code }: DangerPageProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: '#fff8f8',
        fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          width: '100%',
          background: '#fff',
          border: '2px solid #E53E3E',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(229,62,62,0.15)',
        }}
      >
        {/* Red top bar */}
        <div style={{ height: '6px', background: 'linear-gradient(90deg, #E53E3E, #FC8181)' }} />

        <div style={{ padding: '40px 36px' }}>
          {/* Icon */}
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: '#FFF5F5',
              border: '2px solid #FED7D7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
            }}
          >
            <ShieldX size={32} strokeWidth={1.8} style={{ color: '#E53E3E' }} />
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#C53030',
              margin: '0 0 12px',
            }}
          >
            Dangerous Link Blocked
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: '15px',
              color: '#744210',
              lineHeight: 1.6,
              margin: '0 0 24px',
            }}
          >
            This link (<code style={{ fontWeight: 700, background: '#FFF5F5', padding: '2px 6px', borderRadius: '6px' }}>{code}</code>) has been flagged as{' '}
            <strong>malicious</strong> by our security scanner. Visiting this destination may put your
            device or personal information at risk.
          </p>

          {/* Warning box */}
          <div
            style={{
              background: '#FFF5F5',
              border: '1.5px solid #FED7D7',
              borderRadius: '12px',
              padding: '14px 18px',
              marginBottom: '28px',
            }}
          >
            <p
              style={{
                fontSize: '13px',
                color: '#C53030',
                margin: 0,
                fontWeight: 600,
              }}
            >
              ⚠ This page will not redirect you. The link has been permanently blocked.
            </p>
          </div>

          {/* Back button */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '12px 24px',
              background: '#E53E3E',
              color: '#fff',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.85')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
          >
            ← Back to Safety
          </Link>
        </div>
      </div>
    </div>
  );
}
