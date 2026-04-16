'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Link2,
  Scissors,
  Loader2,
  ExternalLink,
  QrCode,
  Share2,
  X,
  Download,
  Check,
} from 'lucide-react';
import QRCodeLib from 'qrcode';
import CopyButton from './CopyButton';
import { ShortenResponse, HistoryItem } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

const HISTORY_COOKIE_KEY = 'url_history';
const MAX_HISTORY = 10;
const COOKIE_EXPIRES_DAYS = 30;

function saveToHistory(item: HistoryItem) {
  try {
    const existing = getHistory();
    const filtered = existing.filter((h) => h.short_code !== item.short_code);
    const updated = [item, ...filtered].slice(0, MAX_HISTORY);
    const expires = new Date();
    expires.setDate(expires.getDate() + COOKIE_EXPIRES_DAYS);
    document.cookie = `${HISTORY_COOKIE_KEY}=${encodeURIComponent(JSON.stringify(updated))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  } catch {
    // ignore
  }
}

function getHistory(): HistoryItem[] {
  try {
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${HISTORY_COOKIE_KEY}=`));
    if (!match) return [];
    return JSON.parse(decodeURIComponent(match.split('=')[1])) as HistoryItem[];
  } catch {
    return [];
  }
}

interface UrlShortenerFormProps {
  onHistoryUpdate?: () => void;
}

/* ─── QR Modal ─────────────────────────────────────────────────────────── */
function QRModal({ url, onClose }: { url: string; onClose: () => void }) {
  const { t } = useLanguage();
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    QRCodeLib.toDataURL(url, {
      width: 280,
      margin: 2,
      color: { dark: '#2C2014', light: '#FFFFFF' },
    }).then(setQrDataUrl);
  }, [url]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'bexo-qr.png';
    a.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 1800);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(44,32,20,0.5)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-scale-in"
        style={{
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border)',
          borderRadius: '28px',
          width: '100%', maxWidth: '320px',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(44,32,20,0.22)',
          fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
        }}
      >
        {/* Modal header */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 20px 0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <QrCode size={16} strokeWidth={2} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {t.qrTitle}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label={t.close}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '30px', height: '30px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-subtle)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
            }}
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* QR image */}
        <div style={{ padding: '20px' }}>
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#fff',
              border: '1.5px solid var(--border)',
              borderRadius: '18px',
              padding: '20px',
              marginBottom: '14px',
            }}
          >
            {qrDataUrl ? (
              <img
                src={qrDataUrl} alt="QR Code"
                width={200} height={200}
                style={{ display: 'block', borderRadius: '4px' }}
              />
            ) : (
              <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={30} strokeWidth={2} style={{ color: 'var(--text-muted)' }} className="animate-spin" />
              </div>
            )}
          </div>

          {/* URL label */}
          <p
            style={{
              fontSize: '13px', fontWeight: 700, color: 'var(--accent)',
              textAlign: 'center', margin: '0 0 16px',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}
          >
            {url}
          </p>

          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={!qrDataUrl}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '12px 0',
              borderRadius: '12px', border: 'none',
              background: downloaded ? 'var(--success)' : 'var(--accent)',
              color: '#fff',
              fontSize: '14px', fontWeight: 700,
              cursor: qrDataUrl ? 'pointer' : 'not-allowed',
              opacity: qrDataUrl ? 1 : 0.5,
              transition: 'background 0.2s, transform 0.15s',
              fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
            }}
            onMouseEnter={e => {
              if (qrDataUrl && !downloaded)
                (e.currentTarget as HTMLButtonElement).style.background = downloaded ? 'var(--success)' : 'var(--accent-hover)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = downloaded ? 'var(--success)' : 'var(--accent)';
            }}
          >
            {downloaded
              ? <><Check size={15} strokeWidth={2.5} /> {t.copied}</>
              : <><Download size={15} strokeWidth={2} /> {t.download}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Share Panel ───────────────────────────────────────────────────────── */
function SharePanel({ url, onClose }: { url: string; onClose: () => void }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(url); } catch { /* ignore */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const socials = [
    { label: 'X', bg: '#000', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}` },
    { label: 'WhatsApp', bg: '#25D366', href: `https://wa.me/?text=${encodeURIComponent(url)}` },
    { label: 'LINE', bg: '#06C755', href: `https://line.me/R/msg/text/?${encodeURIComponent(url)}` },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(44,32,20,0.5)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-scale-in"
        style={{
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border)',
          borderRadius: '28px',
          width: '100%', maxWidth: '320px',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(44,32,20,0.22)',
          fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
        }}
      >
        <div style={{ padding: '20px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Share2 size={16} strokeWidth={2} style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {t.shareTitle}
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label={t.close}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '30px', height: '30px', borderRadius: '8px',
                border: '1px solid var(--border)', background: 'transparent',
                cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-subtle)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
              }}
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>

          {/* URL chip */}
          <div
            style={{
              background: 'var(--accent-light)',
              border: '1.5px solid var(--border)',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '14px',
              fontSize: '14px', fontWeight: 700, color: 'var(--accent)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}
          >
            {url}
          </div>

          {/* Copy */}
          <button
            onClick={handleCopy}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '12px 0', borderRadius: '12px',
              border: `1.5px solid ${copied ? '#B8D4A8' : 'var(--border)'}`,
              background: copied ? 'var(--success-light)' : 'var(--bg)',
              color: copied ? 'var(--success)' : 'var(--text-secondary)',
              fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.18s', marginBottom: '10px',
              fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
            }}
          >
            {copied
              ? <><Check size={14} strokeWidth={2.5} /> {t.copied}</>
              : <><Link2 size={14} strokeWidth={2} /> {t.copy}</>}
          </button>

          {/* Social buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '10px 0', borderRadius: '10px',
                  background: s.bg, color: '#fff',
                  fontSize: '12px', fontWeight: 700, textDecoration: 'none',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.82')}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Form ─────────────────────────────────────────────────────────── */
export default function UrlShortenerForm({ onHistoryUpdate }: UrlShortenerFormProps) {
  const { t } = useLanguage();
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setShowQR(false);
    setShowShare(false);

    const trimmed = url.trim();
    if (!trimmed) {
      setError(t.errorEmpty);
      inputRef.current?.focus();
      return;
    }

    const urlToSend =
      trimmed.startsWith('http://') || trimmed.startsWith('https://')
        ? trimmed
        : `https://${trimmed}`;

    setLoading(true);
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToSend }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || t.errorGeneric);
        return;
      }
      setResult(data as ShortenResponse);
      setUrl('');
      saveToHistory({
        short_code: data.short_code,
        original_url: data.original_url,
        short_url: data.short_url,
        created_at: new Date().toISOString(),
      });
      onHistoryUpdate?.();
    } catch {
      setError(t.errorNetwork);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = useCallback(async () => {
    if (!result) return;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ url: result.short_url });
        return;
      } catch { /* fall through */ }
    }
    setShowShare(true);
  }, [result]);

  return (
    <>
      <div style={{ width: '100%' }}>

        {/* ── Input row ── */}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'flex', alignItems: 'center',
              background: 'var(--bg)',
              border: `1.5px solid ${error ? '#D4A0A0' : 'var(--border)'}`,
              borderRadius: '14px',
              padding: '6px 6px 6px 16px',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxShadow: '0 1px 4px rgba(44,32,20,0.05)',
            }}
            onFocusCapture={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 0 3px rgba(184,132,90,0.12)';
            }}
            onBlurCapture={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = error ? '#D4A0A0' : 'var(--border)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(44,32,20,0.05)';
            }}
          >
            <Link2 size={17} strokeWidth={2} style={{ color: 'var(--text-muted)', flexShrink: 0, marginRight: '10px' }} />
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); if (error) setError(''); }}
              placeholder={t.placeholder}
              disabled={loading}
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)',
                fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                padding: '9px 0',
              }}
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '10px 22px',
                background: loading || !url.trim() ? 'var(--bg-subtle)' : 'var(--accent)',
                color: loading || !url.trim() ? 'var(--text-muted)' : '#fff',
                border: 'none', borderRadius: '10px',
                fontSize: '14px', fontWeight: 700,
                fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                cursor: loading || !url.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.18s',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}
              onMouseEnter={e => {
                if (!loading && url.trim()) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-hover)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(184,132,90,0.35)';
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = loading || !url.trim() ? 'var(--bg-subtle)' : 'var(--accent)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              {loading
                ? <><Loader2 size={14} strokeWidth={2.5} className="animate-spin" />{t.shortening}</>
                : <><Scissors size={14} strokeWidth={2.5} />{t.shorten}</>}
            </button>
          </div>

          {error && (
            <p style={{ marginTop: '8px', fontSize: '13px', color: '#B05A5A', fontWeight: 500, paddingLeft: '4px', fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif' }}>
              {error}
            </p>
          )}
        </form>

        {/* ── Result card ── */}
        {result && (
          <div
            className="animate-scale-in"
            style={{
              marginTop: '16px',
              background: 'var(--bg-card)',
              border: '1.5px solid var(--border)',
              borderRadius: '18px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(44,32,20,0.08)',
            }}
          >
            {/* Success gradient bar */}
            <div style={{ height: '2px', background: 'linear-gradient(90deg, var(--success), #A8CC98, var(--success))' }} />

            <div style={{ padding: '20px' }}>
              {/* Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 0 2px rgba(124,158,110,0.2)' }} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--success)', letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif' }}>
                  {t.ready}
                </span>
              </div>

              {/* Short URL — prominent */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'var(--accent-light)',
                  border: '1.5px solid rgba(184,132,90,0.2)',
                  borderRadius: '12px',
                  padding: '13px 16px',
                  marginBottom: '10px',
                }}
              >
                <a
                  href={result.short_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1, fontSize: '16px', fontWeight: 800, color: 'var(--accent)',
                    textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  {result.short_url}
                  <ExternalLink size={13} strokeWidth={2.5} style={{ flexShrink: 0, opacity: 0.7 }} />
                </a>
                <CopyButton text={result.short_url} />
              </div>

              {/* Original URL */}
              <p
                style={{
                  fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 16px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                  paddingLeft: '2px',
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{t.originalLabel} </span>
                {result.original_url}
              </p>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <ActionBtn
                  icon={<QrCode size={14} strokeWidth={2} />}
                  label={t.qrCode}
                  onClick={() => setShowQR(true)}
                />
                <ActionBtn
                  icon={<Share2 size={14} strokeWidth={2} />}
                  label={t.share}
                  onClick={handleShare}
                  accent
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {showQR && result && <QRModal url={result.short_url} onClose={() => setShowQR(false)} />}
      {showShare && result && <SharePanel url={result.short_url} onClose={() => setShowShare(false)} />}
    </>
  );
}

function ActionBtn({
  icon, label, onClick, accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '8px 16px', borderRadius: '10px',
        border: accent ? 'none' : '1.5px solid var(--border)',
        background: accent ? 'var(--accent)' : 'var(--bg)',
        color: accent ? '#fff' : 'var(--text-secondary)',
        fontSize: '13px', fontWeight: 600,
        fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
        cursor: 'pointer', transition: 'all 0.15s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = accent ? 'var(--accent-hover)' : 'var(--accent-light)';
        el.style.borderColor = accent ? 'transparent' : 'var(--accent)';
        el.style.color = accent ? '#fff' : 'var(--accent)';
        el.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = accent ? 'var(--accent)' : 'var(--bg)';
        el.style.borderColor = accent ? 'transparent' : 'var(--border)';
        el.style.color = accent ? '#fff' : 'var(--text-secondary)';
        el.style.transform = 'translateY(0)';
      }}
    >
      {icon}{label}
    </button>
  );
}
