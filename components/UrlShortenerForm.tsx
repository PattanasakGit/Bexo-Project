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
      width: 256,
      margin: 2,
      color: { dark: '#2C2014', light: '#FFFFFF' },
    }).then(setQrDataUrl);
  }, [url]);

  // Close on Escape
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
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(44,32,20,0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      {/* Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-scale-in"
        style={{
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border)',
          borderRadius: '24px',
          padding: '28px',
          maxWidth: '320px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(44,32,20,0.18)',
          fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <QrCode size={17} strokeWidth={2} style={{ color: 'var(--accent)' }} />
            <span
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              {t.qrTitle}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label={t.close}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '30px',
              height: '30px',
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
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* QR image */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff',
            border: '1.5px solid var(--border)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '16px',
          }}
        >
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code" width={200} height={200} style={{ display: 'block', borderRadius: '4px' }} />
          ) : (
            <div
              style={{
                width: 200,
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Loader2 size={28} strokeWidth={2} style={{ color: 'var(--text-muted)', animation: 'spin 1s linear infinite' }} />
            </div>
          )}
        </div>

        {/* URL label */}
        <p
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--accent)',
            textAlign: 'center',
            margin: '0 0 16px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {url}
        </p>

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={!qrDataUrl}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '11px 0',
            borderRadius: '12px',
            border: 'none',
            background: downloaded ? 'var(--success)' : 'var(--accent)',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 700,
            cursor: qrDataUrl ? 'pointer' : 'not-allowed',
            opacity: qrDataUrl ? 1 : 0.5,
            transition: 'background 0.2s',
            fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
          }}
        >
          {downloaded ? (
            <><Check size={15} strokeWidth={2.5} />{t.copied}</>
          ) : (
            <><Download size={15} strokeWidth={2.5} />{t.download}</>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── Share Panel ───────────────────────────────────────────────────────── */
function SharePanel({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
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

  const shareOptions = [
    {
      label: 'Twitter / X',
      color: '#000',
      bg: '#f0f0f0',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
    },
    {
      label: 'WhatsApp',
      color: '#fff',
      bg: '#25D366',
      href: `https://wa.me/?text=${encodeURIComponent(url)}`,
    },
    {
      label: 'LINE',
      color: '#fff',
      bg: '#06C755',
      href: `https://line.me/R/msg/text/?${encodeURIComponent(url)}`,
    },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(44,32,20,0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-scale-in"
        style={{
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border)',
          borderRadius: '24px',
          padding: '28px',
          maxWidth: '320px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(44,32,20,0.18)',
          fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Share2 size={17} strokeWidth={2} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {t.shareTitle}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label={t.close}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '30px',
              height: '30px',
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
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* URL preview */}
        <div
          style={{
            background: 'var(--accent-light)',
            border: '1.5px solid var(--border)',
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '14px',
            fontWeight: 700,
            color: 'var(--accent)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {url}
        </div>

        {/* Copy */}
        <button
          onClick={handleCopy}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '11px 0',
            borderRadius: '12px',
            border: `1.5px solid ${copied ? '#B8D4A8' : 'var(--border)'}`,
            background: copied ? 'var(--success-light)' : 'var(--bg)',
            color: copied ? 'var(--success)' : 'var(--text-secondary)',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '12px',
            fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
          }}
        >
          {copied ? (
            <><Check size={15} strokeWidth={2.5} />{t.copied}</>
          ) : (
            <><Link2 size={15} strokeWidth={2} />{t.copy}</>
          )}
        </button>

        {/* Social share */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {shareOptions.map((opt) => (
            <a
              key={opt.label}
              href={opt.href}
              target="_blank"
              rel="noopener noreferrer"
              title={opt.label}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '9px 0',
                borderRadius: '10px',
                background: opt.bg,
                color: opt.color,
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'opacity 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.85')}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
            >
              {opt.label}
            </a>
          ))}
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
      } catch {
        // fall through to panel
      }
    }
    setShowShare(true);
  }, [result]);

  return (
    <>
      <div style={{ width: '100%' }}>
        {/* Input */}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-card)',
              border: `1.5px solid ${error ? '#D4A0A0' : 'var(--border)'}`,
              borderRadius: '16px',
              padding: '6px 6px 6px 16px',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxShadow: '0 2px 8px rgba(44,32,20,0.06)',
            }}
            onFocusCapture={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(184,132,90,0.15)';
            }}
            onBlurCapture={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = error ? '#D4A0A0' : 'var(--border)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(44,32,20,0.06)';
            }}
          >
            <Link2
              size={18}
              strokeWidth={2}
              style={{ color: 'var(--text-muted)', flexShrink: 0, marginRight: '10px' }}
            />
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError('');
              }}
              placeholder={t.placeholder}
              disabled={loading}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '15px',
                fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                fontWeight: 500,
                color: 'var(--text-primary)',
                padding: '8px 0',
              }}
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: loading || !url.trim() ? 'var(--bg-subtle)' : 'var(--accent)',
                color: loading || !url.trim() ? 'var(--text-muted)' : '#FFFFFF',
                border: 'none',
                borderRadius: '11px',
                fontSize: '14px',
                fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                fontWeight: 700,
                cursor: loading || !url.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!loading && url.trim()) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-hover)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  loading || !url.trim() ? 'var(--bg-subtle)' : 'var(--accent)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={15} strokeWidth={2.5} className="animate-spin" />
                  <span>{t.shortening}</span>
                </>
              ) : (
                <>
                  <Scissors size={15} strokeWidth={2.5} />
                  <span>{t.shorten}</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <p
              style={{
                marginTop: '8px',
                fontSize: '13px',
                color: '#B05A5A',
                fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                fontWeight: 500,
                paddingLeft: '4px',
              }}
            >
              {error}
            </p>
          )}
        </form>

        {/* Result */}
        {result && (
          <div
            className="animate-scale-in"
            style={{
              marginTop: '20px',
              background: 'var(--bg-card)',
              border: '1.5px solid var(--border)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(44,32,20,0.08)',
            }}
          >
            <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--accent), #D4A876)' }} />

            <div style={{ padding: '20px' }}>
              {/* Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }} />
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--success)',
                    fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                  }}
                >
                  {t.ready}
                </span>
              </div>

              {/* Short URL row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'var(--accent-light)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  marginBottom: '12px',
                }}
              >
                <a
                  href={result.short_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {result.short_url}
                  <ExternalLink size={13} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                </a>
                <CopyButton text={result.short_url} />
              </div>

              {/* Original URL */}
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: '14px',
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {t.originalLabel}{' '}
                </span>
                {result.original_url}
              </p>

              {/* Action buttons: QR Code + Share */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <ActionButton
                  icon={<QrCode size={14} strokeWidth={2} />}
                  label={t.qrCode}
                  onClick={() => setShowQR(true)}
                />
                <ActionButton
                  icon={<Share2 size={14} strokeWidth={2} />}
                  label={t.share}
                  onClick={handleShare}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showQR && result && (
        <QRModal url={result.short_url} onClose={() => setShowQR(false)} />
      )}
      {showShare && result && (
        <SharePanel
          url={result.short_url}
          title="Bexo"
          onClose={() => setShowShare(false)}
        />
      )}
    </>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '7px 14px',
        borderRadius: '10px',
        border: '1.5px solid var(--border)',
        background: 'var(--bg)',
        color: 'var(--text-secondary)',
        fontSize: '13px',
        fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)';
        (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-light)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
        (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg)';
      }}
    >
      {icon}
      {label}
    </button>
  );
}
