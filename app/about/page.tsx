'use client';

import Link from 'next/link';
import { Link2, ArrowLeft, Zap, UserX, QrCode, Share2, Clock, BarChart2, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const FEATURE_ICONS = [Zap, UserX, QrCode, Share2, Clock, BarChart2];

export default function AboutPage() {
  const { t } = useLanguage();
  const ab = t.about;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
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
            gap: '12px',
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginRight: '4px' }}>
            <div
              style={{
                width: '28px', height: '28px', borderRadius: '8px',
                background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Link2 size={13} strokeWidth={2.5} color="#fff" />
            </div>
            <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Bexo
            </span>
          </Link>

          <span style={{ color: 'var(--border)', fontSize: '16px' }}>/</span>

          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>
            {t.aboutLink}
          </span>

          {/* Back link on right */}
          <Link
            href="/"
            style={{
              marginLeft: 'auto',
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)',
              textDecoration: 'none', padding: '6px 12px', borderRadius: '8px',
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
            <ArrowLeft size={14} strokeWidth={2.5} />
            {ab.backHome}
          </Link>
        </div>
      </header>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, maxWidth: '720px', margin: '0 auto', width: '100%', padding: '64px 24px 96px' }}>

        {/* Page intro */}
        <div className="animate-fade-in" style={{ marginBottom: '56px' }}>
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'var(--bg-card)',
              border: '1.5px solid var(--border)',
              borderRadius: '12px',
              padding: '8px 14px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                width: '32px', height: '32px', borderRadius: '9px',
                background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Link2 size={16} strokeWidth={2.5} color="#fff" />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              Bexo
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(30px, 6vw, 44px)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              margin: '0 0 14px',
            }}
          >
            {ab.title}
          </h1>
          <p
            style={{
              fontSize: '16px', color: 'var(--text-secondary)', fontWeight: 500,
              lineHeight: 1.65, margin: 0, maxWidth: '520px',
            }}
          >
            {ab.subtitle}
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border)', marginBottom: '48px' }} />

        {/* What is Bexo */}
        <Section label="01" title={ab.whatTitle}>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0, fontWeight: 500 }}>
            {ab.whatDesc}
          </p>
        </Section>

        {/* How it works */}
        <Section label="02" title={ab.howTitle}>
          <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ab.howSteps.map((step, i) => (
              <li
                key={i}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                  fontSize: '15px', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.65,
                }}
              >
                <span
                  style={{
                    flexShrink: 0, width: '26px', height: '26px',
                    borderRadius: '8px', background: 'var(--accent)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 800, marginTop: '2px',
                  }}
                >
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Section>

        {/* Features */}
        <Section label="03" title={ab.featuresTitle}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '10px',
            }}
          >
            {ab.features.map((f, i) => {
              const Icon = FEATURE_ICONS[i] ?? Zap;
              return (
                <div
                  key={i}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1.5px solid var(--border)',
                    borderRadius: '16px',
                    padding: '18px',
                    display: 'flex', alignItems: 'flex-start', gap: '14px',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-hover)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(44,32,20,0.07)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      width: '34px', height: '34px', borderRadius: '10px',
                      background: 'var(--accent-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    <Icon size={16} strokeWidth={2} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                      {f.name}
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500, margin: 0, lineHeight: 1.55 }}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Privacy */}
        <Section label="04" title={ab.privacyTitle} last>
          <div
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '16px',
              background: 'var(--bg-card)',
              border: '1.5px solid var(--border)',
              borderRadius: '16px',
              padding: '20px',
            }}
          >
            <div
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'var(--accent-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >
              <Shield size={17} strokeWidth={2} style={{ color: 'var(--accent)' }} />
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.75, margin: 0 }}>
              {ab.privacyDesc}
            </p>
          </div>
        </Section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)' }}>
        <div
          style={{
            maxWidth: '720px', margin: '0 auto', padding: '22px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '22px', height: '22px', borderRadius: '7px',
                background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
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

function Section({
  label,
  title,
  children,
  last = false,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: '48px 1fr',
        gap: '0 20px',
        marginBottom: last ? 0 : '52px',
      }}
    >
      {/* Section number */}
      <div style={{ paddingTop: '3px' }}>
        <span
          style={{
            fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)',
            letterSpacing: '0.08em', fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
          }}
        >
          {label}
        </span>
      </div>

      {/* Content */}
      <div>
        <h2
          style={{
            fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)',
            letterSpacing: '-0.02em', margin: '0 0 18px',
          }}
        >
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
