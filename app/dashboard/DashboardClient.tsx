'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Link2,
  LogOut,
  User,
  ExternalLink,
  Copy,
  Check,
  Trash2,
  BarChart2,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { formatDate, truncateUrl, getBaseUrl } from '@/lib/utils';

interface LinkRow {
  id: string;
  short_code: string;
  original_url: string;
  click_count: number;
  created_at: string;
}

interface Props {
  user: { id: string; email: string };
  initialDisplayName: string;
  initialLinks: LinkRow[];
}

export default function DashboardClient({ user, initialDisplayName, initialLinks }: Props) {
  const { t } = useLanguage();
  const { signOut } = useAuth();
  const baseUrl = getBaseUrl();

  // Profile state
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Links state
  const [links, setLinks] = useState<LinkRow[]>(initialLinks);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Initials for avatar
  const initials = (displayName || user.email).slice(0, 2).toUpperCase();

  async function handleSaveProfile() {
    setSavingProfile(true);
    setProfileSaved(false);
    const supabase = getSupabaseBrowser();
    await supabase
      .from('profiles')
      .update({ display_name: displayName.trim() || null })
      .eq('id', user.id);
    setSavingProfile(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  }

  async function handleCopy(shortCode: string) {
    const url = `${baseUrl}/${shortCode}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopiedId(shortCode);
    setTimeout(() => setCopiedId(null), 1800);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.from('urls').delete().eq('id', id).eq('user_id', user.id);
    if (!error) {
      setLinks((prev) => prev.filter((l) => l.id !== id));
    }
    setDeletingId(null);
  }

  async function handleSignOut() {
    await signOut();
  }

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
            justifyContent: 'space-between',
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(184,132,90,0.35)',
              }}
            >
              <Link2 size={16} strokeWidth={2.5} color="#fff" />
            </div>
            <span style={{ fontSize: '19px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              Bexo
            </span>
          </Link>

          <button
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              background: 'var(--bg-subtle)',
              border: '1.5px solid var(--border)',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-subtle)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <LogOut size={14} strokeWidth={2.5} />
            {t.auth.logoutBtn}
          </button>
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          maxWidth: '720px',
          width: '100%',
          margin: '0 auto',
          padding: '48px 24px 80px',
        }}
      >
        {/* Page title */}
        <div className="animate-fade-in" style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.03em' }}>
            {t.auth.dashboardTitle}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, margin: 0 }}>
            {t.auth.dashboardSubtitle}
          </p>
        </div>

        {/* Profile card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(44,32,20,0.06)',
            marginBottom: '24px',
          }}
        >
          <div style={{ height: '3px', background: 'linear-gradient(90deg, #D4A876, var(--accent), #9A6E48)' }} />
          <div style={{ padding: '24px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <User size={15} strokeWidth={2.5} style={{ color: 'var(--accent)' }} />
              <h2 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
                {t.auth.profileSection}
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {/* Avatar */}
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(184,132,90,0.3)',
                }}
              >
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                  {initials}
                </span>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: '180px' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, margin: '0 0 2px' }}>
                  {user.email}
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={t.auth.displayNamePlaceholder}
                    maxLength={40}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      background: 'var(--bg)',
                      border: '1.5px solid var(--border)',
                      borderRadius: '8px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(184,132,90,0.12)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    style={{
                      padding: '8px 14px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: profileSaved ? 'var(--success)' : '#fff',
                      background: profileSaved ? 'var(--success-light)' : savingProfile ? 'var(--text-muted)' : 'var(--accent)',
                      border: profileSaved ? '1.5px solid var(--success)' : 'none',
                      borderRadius: '8px',
                      cursor: savingProfile ? 'wait' : 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'inherit',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {profileSaved ? t.auth.profileSaved : savingProfile ? t.auth.savingProfile : t.auth.saveProfile}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Links card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(44,32,20,0.06)',
          }}
        >
          <div style={{ height: '3px', background: 'linear-gradient(90deg, #D4A876, var(--accent), #9A6E48)' }} />
          <div style={{ padding: '24px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={15} strokeWidth={2.5} style={{ color: 'var(--accent)' }} />
                <h2 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {t.auth.myLinksSection}
                </h2>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '3px 8px',
                }}
              >
                {links.length}
              </span>
            </div>

            {links.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'var(--bg-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px',
                  }}
                >
                  <Link2 size={20} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                </div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', margin: '0 0 4px' }}>
                  {t.auth.noLinksYet}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, margin: 0 }}>
                  {t.auth.noLinksDesc}
                </p>
                <Link
                  href="/"
                  style={{
                    display: 'inline-block',
                    marginTop: '16px',
                    padding: '9px 20px',
                    background: 'var(--accent)',
                    color: '#fff',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  {t.shorten} →
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                {links.map((link, i) => {
                  const shortUrl = `${baseUrl}/${link.short_code}`;
                  const isCopied = copiedId === link.short_code;
                  const isDeleting = deletingId === link.id;

                  return (
                    <div
                      key={link.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 0',
                        borderBottom: i < links.length - 1 ? '1px solid var(--border)' : 'none',
                        opacity: isDeleting ? 0.5 : 1,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      {/* Short code */}
                      <div style={{ flexShrink: 0 }}>
                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '13px',
                            fontWeight: 700,
                            color: 'var(--accent)',
                            textDecoration: 'none',
                            minWidth: '80px',
                          }}
                        >
                          /{link.short_code}
                          <ExternalLink size={11} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                        </a>
                      </div>

                      {/* Original URL */}
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <p style={{
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          fontWeight: 500,
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {truncateUrl(link.original_url, 50)}
                        </p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, margin: '2px 0 0' }}>
                          {formatDate(link.created_at)}
                        </p>
                      </div>

                      {/* Click count */}
                      <div
                        style={{
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: 'var(--text-muted)',
                          background: 'var(--bg-subtle)',
                          padding: '4px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        <BarChart2 size={11} strokeWidth={2.5} />
                        {link.click_count}
                      </div>

                      {/* Copy button */}
                      <button
                        onClick={() => handleCopy(link.short_code)}
                        style={{
                          flexShrink: 0,
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          background: isCopied ? 'var(--success-light)' : 'var(--bg-subtle)',
                          border: isCopied ? '1px solid var(--success)' : '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          color: isCopied ? 'var(--success)' : 'var(--text-muted)',
                        }}
                        title={t.copy}
                      >
                        {isCopied ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} strokeWidth={2.5} />}
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(link.id)}
                        disabled={isDeleting}
                        style={{
                          flexShrink: 0,
                          width: '30px',
                          height: '30px',
                          borderRadius: '8px',
                          background: 'var(--bg-subtle)',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: isDeleting ? 'not-allowed' : 'pointer',
                          transition: 'all 0.15s',
                          color: 'var(--text-muted)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#FEF2F2';
                          e.currentTarget.style.borderColor = '#FECACA';
                          e.currentTarget.style.color = '#DC2626';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'var(--bg-subtle)';
                          e.currentTarget.style.borderColor = 'var(--border)';
                          e.currentTarget.style.color = 'var(--text-muted)';
                        }}
                        title={t.auth.deleteLink}
                      >
                        <Trash2 size={13} strokeWidth={2.5} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)' }}>
        <div
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            padding: '22px 24px',
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
