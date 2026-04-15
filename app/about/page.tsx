'use client';

import Link from 'next/link';
import { Link2, ArrowLeft, Zap, UserX, QrCode, Share2, Clock, BarChart2, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const featureIcons = [Zap, UserX, QrCode, Share2, Clock, BarChart2];

export default function AboutPage() {
  const { t } = useLanguage();
  const ab = t.about;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'rgba(250,247,242,0.92)',
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
            gap: '10px',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              fontWeight: 600,
              padding: '6px 10px',
              borderRadius: '10px',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-subtle)')}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = 'transparent')}
          >
            <ArrowLeft size={15} strokeWidth={2.5} />
            {ab.backHome}
          </Link>
        </div>
      </header>

      {/* Content */}
      <main
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          padding: '56px 24px 80px',
        }}
      >
        {/* Page title */}
        <div style={{ marginBottom: '48px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <Link2 size={22} strokeWidth={2.5} color="#fff" />
          </div>
          <h1
            style={{
              fontSize: 'clamp(26px, 5vw, 36px)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              margin: '0 0 10px',
            }}
          >
            {ab.title}
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {ab.subtitle}
          </p>
        </div>

        {/* What is Bexo */}
        <Section title={ab.whatTitle}>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              margin: 0,
              fontWeight: 500,
            }}
          >
            {ab.whatDesc}
          </p>
        </Section>

        {/* How it works */}
        <Section title={ab.howTitle}>
          <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ab.howSteps.map((step, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  fontSize: '15px',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                  lineHeight: 1.6,
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: '26px',
                    height: '26px',
                    borderRadius: '8px',
                    background: 'var(--accent)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 800,
                    marginTop: '1px',
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
        <Section title={ab.featuresTitle}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '12px',
            }}
          >
            {ab.features.map((f, i) => {
              const Icon = featureIcons[i] ?? Zap;
              return (
                <div
                  key={i}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1.5px solid var(--border)',
                    borderRadius: '14px',
                    padding: '16px 18px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '9px',
                      background: 'var(--accent-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={15} strokeWidth={2} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        margin: '0 0 3px',
                      }}
                    >
                      {f.name}
                    </p>
                    <p
                      style={{
                        fontSize: '13px',
                        color: 'var(--text-muted)',
                        fontWeight: 500,
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {f.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Privacy */}
        <Section title={ab.privacyTitle} last>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              background: 'var(--bg-card)',
              border: '1.5px solid var(--border)',
              borderRadius: '14px',
              padding: '16px 18px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '9px',
                background: 'var(--accent-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Shield size={15} strokeWidth={2} style={{ color: 'var(--accent)' }} />
            </div>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {ab.privacyDesc}
            </p>
          </div>
        </Section>
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
              }}
            >
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

function Section({
  title,
  children,
  last = false,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <section style={{ marginBottom: last ? 0 : '40px' }}>
      <h2
        style={{
          fontSize: '18px',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          margin: '0 0 16px',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
