'use client';

import { useState, useRef } from 'react';
import { Link2, Scissors, ArrowRight, Loader2, ExternalLink } from 'lucide-react';
import CopyButton from './CopyButton';
import { ShortenResponse, HistoryItem } from '@/types';

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
    // Silently fail
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

export default function UrlShortenerForm({ onHistoryUpdate }: UrlShortenerFormProps) {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please enter a URL to shorten');
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
        setError(data.error || 'Something went wrong');
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
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Input form */}
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0',
            background: 'var(--bg-card)',
            border: `1.5px solid ${error ? '#D4A0A0' : 'var(--border)'}`,
            borderRadius: '16px',
            padding: '6px 6px 6px 16px',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: '0 2px 8px rgba(44,32,20,0.06)',
          }}
          onFocusCapture={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)';
            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(184,132,90,0.15)';
          }}
          onBlurCapture={e => {
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
            placeholder="Paste your long URL here..."
            disabled={loading}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '15px',
              fontFamily: 'var(--font-nunito), Nunito, sans-serif',
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
              fontFamily: 'var(--font-nunito), Nunito, sans-serif',
              fontWeight: 700,
              cursor: loading || !url.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              if (!loading && url.trim()) {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-hover)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background =
                loading || !url.trim() ? 'var(--bg-subtle)' : 'var(--accent)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            {loading ? (
              <>
                <Loader2 size={15} strokeWidth={2.5} className="animate-spin" />
                <span>Shortening</span>
              </>
            ) : (
              <>
                <Scissors size={15} strokeWidth={2.5} />
                <span>Shorten</span>
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
              fontFamily: 'var(--font-nunito), Nunito, sans-serif',
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
          {/* Success bar */}
          <div
            style={{
              height: '3px',
              background: 'linear-gradient(90deg, var(--accent), #D4A876)',
            }}
          />

          <div style={{ padding: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '14px',
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--success)',
                }}
              />
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--success)',
                  fontFamily: 'var(--font-nunito), Nunito, sans-serif',
                }}
              >
                Your short link is ready
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'var(--accent-light)',
                borderRadius: '12px',
                padding: '12px 14px',
                marginBottom: '10px',
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
                  fontFamily: 'var(--font-nunito), Nunito, sans-serif',
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

            <p
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-nunito), Nunito, sans-serif',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Original: </span>
              {result.original_url}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
