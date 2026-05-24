'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Link2, Menu, X } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const LANG_OPTIONS: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'th', label: 'TH' },
  { code: 'ja', label: 'JA' },
];

const NAV_LINKS = [
  { href: '/about', labelKey: 'aboutLink' as const },
];

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const { user, isLoading: authLoading } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMobileOpen(false));
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [mobileOpen]);

  const isActive = (href: string) => pathname === href;

  return (
    <header
      role="banner"
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(250,247,242,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
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
        {/* ── Logo ── */}
        <Link
          href="/"
          aria-label="Bexo — free URL shortener, go to home"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(184,132,90,0.3)',
            }}
          >
            <Link2 size={16} strokeWidth={2.5} color="#fff" />
          </div>
          <span style={{ fontSize: '19px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Bexo
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav
          aria-label="Main navigation"
          className="nav-desktop"
          style={{ alignItems: 'center', gap: '4px' }}
        >
          {NAV_LINKS.map(({ href, labelKey }) => (
            <DesktopNavLink key={href} href={href} active={isActive(href)} label={t[labelKey]} />
          ))}

          {/* Auth */}
          {!authLoading && (
            user ? (
              <Link
                href="/dashboard"
                aria-label="Go to your dashboard"
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)',
                  textDecoration: 'none', padding: '5px 12px 5px 6px',
                  borderRadius: '9px', background: 'var(--bg-subtle)',
                  border: '1px solid var(--border)', transition: 'border-color 0.15s, box-shadow 0.15s',
                  marginLeft: '4px',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = 'var(--accent)';
                  el.style.boxShadow = '0 2px 8px rgba(184,132,90,0.12)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = 'var(--border)';
                  el.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    width: '24px', height: '24px', borderRadius: '7px',
                    background: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#fff' }}>
                    {(user.email ?? 'U').slice(0, 2).toUpperCase()}
                  </span>
                </div>
                {t.auth.dashboardLink}
              </Link>
            ) : (
              <Link
                href="/auth/login"
                aria-label="Log in to your account"
                style={{
                  fontSize: '13px', fontWeight: 700, color: '#fff',
                  textDecoration: 'none', padding: '6px 14px',
                  borderRadius: '9px', background: 'var(--accent)',
                  transition: 'background 0.15s, box-shadow 0.15s',
                  marginLeft: '4px',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = 'var(--accent-hover)';
                  el.style.boxShadow = '0 4px 12px rgba(184,132,90,0.3)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = 'var(--accent)';
                  el.style.boxShadow = 'none';
                }}
              >
                {t.auth.loginLink}
              </Link>
            )
          )}

          {/* Divider */}
          <div
            role="separator"
            aria-hidden="true"
            style={{ width: '1px', height: '16px', background: 'var(--border)', margin: '0 6px' }}
          />

          {/* Language switcher */}
          <div
            role="group"
            aria-label="Language selection"
            style={{
              display: 'flex', alignItems: 'center',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '3px', gap: '2px',
            }}
          >
            {LANG_OPTIONS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                aria-label={`Switch language to ${label}`}
                style={{
                  fontSize: '12px', fontWeight: 700,
                  padding: '4px 10px', borderRadius: '7px', border: 'none',
                  background: lang === code ? 'var(--bg-card)' : 'transparent',
                  color: lang === code ? 'var(--text-primary)' : 'var(--text-muted)',
                  cursor: 'pointer', transition: 'all 0.15s',
                  boxShadow: lang === code ? '0 1px 4px rgba(44,32,20,0.1)' : 'none',
                  fontFamily: 'inherit', letterSpacing: '0.02em',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>

        {/* ── Mobile hamburger ── */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen(v => !v)}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-menu"
          style={{
            alignItems: 'center', justifyContent: 'center',
            width: '38px', height: '38px',
            borderRadius: '10px',
            border: '1.5px solid var(--border)',
            background: mobileOpen ? 'var(--bg-subtle)' : 'transparent',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            transition: 'all 0.15s',
          }}
        >
          {mobileOpen ? <X size={18} strokeWidth={2.5} /> : <Menu size={18} strokeWidth={2.5} />}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div
          id="mobile-nav-menu"
          role="dialog"
          aria-label="Navigation menu"
          aria-modal="false"
          className="animate-fade-in"
          style={{
            borderTop: '1px solid var(--border)',
            background: 'rgba(250,247,242,0.98)',
            padding: '12px 24px 20px',
          }}
        >
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            {/* Nav links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '12px' }}>
              {NAV_LINKS.map(({ href, labelKey }) => (
                <MobileNavLink
                  key={href}
                  href={href}
                  active={isActive(href)}
                  label={t[labelKey]}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </div>

            <div style={{ height: '1px', background: 'var(--border)', margin: '10px 0 14px' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              {/* Auth */}
              {!authLoading && (
                user ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Go to your dashboard"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)',
                      textDecoration: 'none', padding: '8px 14px 8px 8px',
                      borderRadius: '10px',
                      background: 'var(--bg-subtle)', border: '1px solid var(--border)',
                    }}
                  >
                    <div
                      style={{
                        width: '28px', height: '28px', borderRadius: '8px',
                        background: 'var(--accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff' }}>
                        {(user.email ?? 'U').slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    {t.auth.dashboardLink}
                  </Link>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Log in to your account"
                    style={{
                      fontSize: '14px', fontWeight: 700, color: '#fff',
                      textDecoration: 'none', padding: '9px 20px',
                      borderRadius: '10px', background: 'var(--accent)',
                    }}
                  >
                    {t.auth.loginLink}
                  </Link>
                )
              )}

              {/* Language switcher */}
              <div
                role="group"
                aria-label="Language selection"
                style={{
                  display: 'flex', alignItems: 'center',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '3px', gap: '2px',
                }}
              >
                {LANG_OPTIONS.map(({ code, label }) => (
                  <button
                    key={code}
                    onClick={() => setLang(code)}
                    aria-pressed={lang === code}
                    aria-label={`Switch language to ${label}`}
                    style={{
                      fontSize: '12px', fontWeight: 700,
                      padding: '6px 14px', borderRadius: '7px', border: 'none',
                      background: lang === code ? 'var(--bg-card)' : 'transparent',
                      color: lang === code ? 'var(--text-primary)' : 'var(--text-muted)',
                      cursor: 'pointer', transition: 'all 0.15s',
                      boxShadow: lang === code ? '0 1px 4px rgba(44,32,20,0.1)' : 'none',
                      fontFamily: 'inherit',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function DesktopNavLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      style={{
        position: 'relative',
        fontSize: '13px', fontWeight: 600,
        color: active ? 'var(--accent)' : 'var(--text-secondary)',
        textDecoration: 'none',
        padding: '6px 13px',
        borderRadius: '8px',
        background: active ? 'var(--accent-light)' : 'transparent',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => {
        if (!active) {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.background = 'var(--bg-subtle)';
          el.style.color = 'var(--text-primary)';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.background = 'transparent';
          el.style.color = 'var(--text-secondary)';
        }
      }}
    >
      {label}
      {active && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute', bottom: '2px', left: '50%',
            transform: 'translateX(-50%)',
            width: '18px', height: '2px', borderRadius: '1px',
            background: 'var(--accent)',
          }}
        />
      )}
    </Link>
  );
}

function MobileNavLink({
  href, active, label, onClick,
}: {
  href: string; active: boolean; label: string; onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        fontSize: '15px', fontWeight: 700,
        color: active ? 'var(--accent)' : 'var(--text-secondary)',
        textDecoration: 'none',
        padding: '10px 12px', borderRadius: '10px',
        background: active ? 'var(--accent-light)' : 'transparent',
        transition: 'all 0.15s',
      }}
    >
      {active && (
        <span
          aria-hidden="true"
          style={{ width: '3px', height: '16px', borderRadius: '2px', background: 'var(--accent)', flexShrink: 0 }}
        />
      )}
      {label}
    </Link>
  );
}
