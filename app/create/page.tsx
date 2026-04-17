'use client';

import { useState } from 'react';
import { Link2, Plus, Trash2, ChevronUp, ChevronDown, Copy, Check, LayoutGrid } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { isValidUrl, normalizeUrl } from '@/lib/utils';
import { CreatePageResponse, PageHistoryItem } from '@/types';

const EMOJI_OPTIONS = ['🔗', '🌟', '🚀', '💡', '🎯', '🎨', '📱', '💼', '🌈', '🔥', '💎', '🎵', '📸', '✈️', '🌿', '🦋', '🍀', '🎉'];
const THEMES = ['warm', 'dark', 'gradient'] as const;
type Theme = typeof THEMES[number];

const THEME_PREVIEWS: Record<Theme, { bg: string; btn: string; label: string }> = {
  warm:     { bg: '#FAF7F2', btn: '#2C2014', label: 'Warm' },
  dark:     { bg: '#1A1A1A', btn: '#B8845A', label: 'Dark' },
  gradient: { bg: 'linear-gradient(135deg,#6B73FF,#9B59B6)', btn: 'rgba(255,255,255,0.3)', label: 'Gradient' },
};

interface LinkEntry {
  title: string;
  url: string;
}

const PAGE_HISTORY_KEY = 'page_history';
const MAX_HISTORY = 10;
const EXPIRY_DAYS = 30;

function savePageHistory(item: PageHistoryItem) {
  try {
    const match = document.cookie.split('; ').find(r => r.startsWith(`${PAGE_HISTORY_KEY}=`));
    const existing: PageHistoryItem[] = match
      ? (JSON.parse(decodeURIComponent(match.split('=')[1])) as PageHistoryItem[])
      : [];

    const updated = [item, ...existing.filter(e => e.page_code !== item.page_code)].slice(0, MAX_HISTORY);
    const expires = new Date(Date.now() + EXPIRY_DAYS * 86400 * 1000).toUTCString();
    document.cookie = `${PAGE_HISTORY_KEY}=${encodeURIComponent(JSON.stringify(updated))}; expires=${expires}; path=/; SameSite=Lax`;
  } catch {
    // ignore
  }
}

export default function CreatePage() {
  const { t } = useLanguage();

  const [emoji, setEmoji] = useState('🔗');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [links, setLinks] = useState<LinkEntry[]>([{ title: '', url: '' }]);
  const [theme, setTheme] = useState<Theme>('warm');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CreatePageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const addLink = () => {
    if (links.length < 20) setLinks(prev => [...prev, { title: '', url: '' }]);
  };

  const removeLink = (i: number) => setLinks(prev => prev.filter((_, idx) => idx !== i));

  const updateLink = (i: number, field: keyof LinkEntry, value: string) => {
    setLinks(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l));
  };

  const moveLink = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= links.length) return;
    setLinks(prev => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const validate = (): string | null => {
    if (!title.trim()) return t.errorPageTitle;
    if (title.trim().length > 60) return 'Title must be 60 characters or less';
    const validLinks = links.filter(l => l.title.trim() || l.url.trim());
    if (validLinks.length === 0) return t.errorNoLinks;
    if (validLinks.length > 20) return t.errorTooManyLinks;
    for (const l of validLinks) {
      if (!l.title.trim()) return 'Each link must have a title';
      const normalized = normalizeUrl(l.url);
      if (!normalized || !isValidUrl(normalized)) return `Invalid URL: ${l.url || '(empty)'}`;
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setError(null);
    setIsLoading(true);

    try {
      const validLinks = links.filter(l => l.title.trim() && l.url.trim());
      const res = await fetch('/api/page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          bio: bio.trim() || undefined,
          avatar_emoji: emoji,
          theme,
          links: validLinks.map(l => ({ title: l.title.trim(), url: normalizeUrl(l.url) })),
        }),
      });

      const data = await res.json() as CreatePageResponse & { error?: string };

      if (!res.ok) {
        setError(data.error ?? t.errorGeneric);
        return;
      }

      setResult(data);
      savePageHistory({
        page_code: data.page_code,
        title: data.title,
        page_url: data.page_url,
        created_at: new Date().toISOString(),
      });
    } catch {
      setError(t.errorNetwork);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.page_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
    border: '1.5px solid var(--border)',
    borderRadius: '10px',
    background: 'var(--bg)',
    color: 'var(--text-primary)',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    marginBottom: '8px',
    display: 'block',
    fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
  };

  if (result) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif' }}>
        <nav style={{ borderBottom: '1px solid var(--border)', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', maxWidth: '720px', margin: '0 auto', width: '100%' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link2 size={13} strokeWidth={2.5} color="#fff" />
            </div>
            <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Bexo</span>
          </a>
        </nav>

        <main style={{ flex: 1, maxWidth: '520px', width: '100%', margin: '0 auto', padding: '60px 24px' }}>
          <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              {t.pageReady}
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: 0 }}>{result.title}</p>
          </div>

          <div
            className="animate-fade-up"
            style={{
              background: 'var(--bg-card)',
              border: '1.5px solid var(--border)',
              borderRadius: '20px',
              padding: '24px',
              animationDelay: '0.06s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <input
                readOnly
                value={result.page_url}
                style={{ ...inputStyle, flex: 1, background: 'var(--bg-subtle)', cursor: 'text' }}
              />
              <button
                onClick={handleCopy}
                style={{
                  padding: '10px 16px', borderRadius: '10px',
                  background: copied ? 'var(--success)' : 'var(--accent)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px',
                  fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                  transition: 'background 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? t.copied : t.copy}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href={result.page_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, textAlign: 'center', padding: '10px',
                  background: 'var(--accent)', color: '#fff',
                  borderRadius: '10px', textDecoration: 'none',
                  fontWeight: 700, fontSize: '14px',
                  fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                }}
              >
                {t.viewPage}
              </a>
              <a
                href="/create"
                style={{
                  flex: 1, textAlign: 'center', padding: '10px',
                  background: 'var(--bg-subtle)', color: 'var(--text-secondary)',
                  borderRadius: '10px', textDecoration: 'none',
                  fontWeight: 700, fontSize: '14px', border: '1.5px solid var(--border)',
                  fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                }}
              >
                {t.createPageBtn}
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid var(--border)', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', width: '100%' }}>
        <div style={{ maxWidth: '720px', width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link2 size={13} strokeWidth={2.5} color="#fff" />
            </div>
            <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Bexo</span>
          </a>
        </div>
      </nav>

      <main style={{ flex: 1, maxWidth: '640px', width: '100%', margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Heading */}
        <div className="animate-fade-in" style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px', letterSpacing: '-0.03em' }}>
            {t.createPageHeading}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: 0 }}>{t.createPageSub}</p>
        </div>

        {/* Section 1: Page Info */}
        <section style={{ marginBottom: '28px' }}>
          <div
            style={{
              background: 'var(--bg-card)', border: '1.5px solid var(--border)',
              borderRadius: '20px', padding: '24px',
            }}
          >
            {/* Emoji Picker */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>{t.chooseEmoji}</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {EMOJI_OPTIONS.map(e => (
                  <button
                    key={e}
                    onClick={() => setEmoji(e)}
                    style={{
                      width: '40px', height: '40px', borderRadius: '10px', fontSize: '20px',
                      border: emoji === e ? '2px solid var(--accent)' : '1.5px solid var(--border)',
                      background: emoji === e ? 'var(--accent-light)' : 'var(--bg)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>{t.pageTitle}</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={t.pageTitlePlaceholder}
                maxLength={60}
                style={inputStyle}
              />
              <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {title.length}/60
              </div>
            </div>

            {/* Bio */}
            <div>
              <label style={labelStyle}>{t.pageBio}</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder={t.pageBioPlaceholder}
                rows={2}
                maxLength={160}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '72px' }}
              />
            </div>
          </div>
        </section>

        {/* Section 2: Links */}
        <section style={{ marginBottom: '28px' }}>
          <div
            style={{
              background: 'var(--bg-card)', border: '1.5px solid var(--border)',
              borderRadius: '20px', padding: '24px',
            }}
          >
            <label style={labelStyle}>{t.addLink}</label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
              {links.map((link, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', gap: '8px', alignItems: 'flex-start',
                    background: 'var(--bg)', border: '1.5px solid var(--border)',
                    borderRadius: '12px', padding: '12px',
                  }}
                >
                  {/* Order buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
                    <button
                      onClick={() => moveLink(i, -1)}
                      disabled={i === 0}
                      style={{
                        width: '26px', height: '26px', borderRadius: '6px', border: '1px solid var(--border)',
                        background: 'var(--bg-card)', cursor: i === 0 ? 'default' : 'pointer',
                        opacity: i === 0 ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <ChevronUp size={14} strokeWidth={2} color="var(--text-muted)" />
                    </button>
                    <button
                      onClick={() => moveLink(i, 1)}
                      disabled={i === links.length - 1}
                      style={{
                        width: '26px', height: '26px', borderRadius: '6px', border: '1px solid var(--border)',
                        background: 'var(--bg-card)', cursor: i === links.length - 1 ? 'default' : 'pointer',
                        opacity: i === links.length - 1 ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <ChevronDown size={14} strokeWidth={2} color="var(--text-muted)" />
                    </button>
                  </div>

                  {/* Inputs */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <input
                      type="text"
                      value={link.title}
                      onChange={e => updateLink(i, 'title', e.target.value)}
                      placeholder={t.linkTitle}
                      maxLength={80}
                      style={{ ...inputStyle, padding: '8px 12px' }}
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={e => updateLink(i, 'url', e.target.value)}
                      placeholder={t.linkUrl}
                      style={{ ...inputStyle, padding: '8px 12px' }}
                    />
                  </div>

                  {/* Remove */}
                  {links.length > 1 && (
                    <button
                      onClick={() => removeLink(i)}
                      aria-label={t.removeLink}
                      style={{
                        width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border)',
                        background: 'var(--bg-card)', cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0, color: 'var(--text-muted)',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FBF0F0'; (e.currentTarget as HTMLButtonElement).style.color = '#B05A5A'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-card)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
                    >
                      <Trash2 size={14} strokeWidth={2} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {links.length < 20 && (
              <button
                onClick={addLink}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '10px',
                  border: '1.5px dashed var(--border)', background: 'none',
                  color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                  fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
              >
                <Plus size={14} strokeWidth={2.5} />
                {t.addLink}
              </button>
            )}
          </div>
        </section>

        {/* Section 3: Theme Picker */}
        <section style={{ marginBottom: '28px' }}>
          <div
            style={{
              background: 'var(--bg-card)', border: '1.5px solid var(--border)',
              borderRadius: '20px', padding: '24px',
            }}
          >
            <label style={labelStyle}>{t.chooseTheme}</label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {THEMES.map(th => {
                const preview = THEME_PREVIEWS[th];
                const isSelected = theme === th;
                return (
                  <button
                    key={th}
                    onClick={() => setTheme(th)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                      border: isSelected ? '2px solid var(--accent)' : '1.5px solid var(--border)',
                      borderRadius: '12px', padding: '12px 20px', cursor: 'pointer',
                      background: isSelected ? 'var(--accent-light)' : 'var(--bg)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {/* Preview swatch */}
                    <div
                      style={{
                        width: '56px', height: '36px', borderRadius: '8px',
                        background: preview.bg, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', overflow: 'hidden',
                      }}
                    >
                      <div style={{ width: '36px', height: '12px', borderRadius: '4px', background: preview.btn, opacity: 0.9 }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: isSelected ? 'var(--accent)' : 'var(--text-secondary)', fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif' }}>
                      {th === 'warm' ? t.themeWarm : th === 'dark' ? t.themeDark : t.themeGradient}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div
            style={{
              padding: '12px 16px', borderRadius: '10px', marginBottom: '16px',
              background: '#FBF0F0', border: '1px solid #F0C0C0',
              color: '#B05A5A', fontSize: '14px', fontWeight: 500,
              fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
            }}
          >
            {error}
          </div>
        )}

        {/* Create Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          style={{
            width: '100%', padding: '14px 24px',
            background: isLoading ? 'var(--text-muted)' : 'var(--accent)',
            color: '#fff', border: 'none', borderRadius: '14px',
            fontSize: '15px', fontWeight: 800, cursor: isLoading ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'background 0.2s',
            letterSpacing: '-0.01em',
          }}
        >
          <LayoutGrid size={16} strokeWidth={2.5} />
          {isLoading ? t.creatingPage : t.createPageBtn}
        </button>
      </main>
    </div>
  );
}
