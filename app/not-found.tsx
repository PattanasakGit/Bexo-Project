import Link from 'next/link';
import { Link2, ArrowLeft } from 'lucide-react';

export default function NotFound() {
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
        fontFamily: 'var(--font-nunito), Nunito, sans-serif',
      }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border)',
          borderRadius: '24px',
          padding: '48px 40px',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 4px 24px rgba(44,32,20,0.08)',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'var(--accent-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <Link2 size={24} strokeWidth={2} style={{ color: 'var(--accent)' }} />
        </div>

        <p
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: '0 0 10px',
          }}
        >
          404
        </p>

        <h1
          style={{
            fontSize: '24px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: '0 0 10px',
            letterSpacing: '-0.02em',
          }}
        >
          Link not found
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            lineHeight: 1.6,
            margin: '0 0 28px',
          }}
        >
          This short link doesn&apos;t exist or may have been removed.
        </p>

        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--accent)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '14px',
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
        >
          <ArrowLeft size={15} strokeWidth={2.5} />
          Back to Bexo
        </Link>
      </div>
    </div>
  );
}
