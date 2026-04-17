'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, Trash2, ExternalLink, QrCode, Calendar } from 'lucide-react';
import CopyButton from './CopyButton';
import { HistoryItem } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

const HISTORY_COOKIE_KEY = 'url_history';

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

function clearHistory() {
  document.cookie = `${HISTORY_COOKIE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function formatHistoryDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

function truncateForDisplay(url: string, max = 48): string {
  return url.length <= max ? url : url.slice(0, max) + '…';
}

interface HistoryListProps {
  refreshTrigger?: number;
}

export default function HistoryList({ refreshTrigger }: HistoryListProps) {
  const { t } = useLanguage();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadHistory = useCallback(() => setHistory(getHistory()), []);

  useEffect(() => {
    setMounted(true);
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (mounted) loadHistory();
  }, [refreshTrigger, mounted, loadHistory]);

  if (!mounted || history.length === 0) return null;

  return (
    <section aria-label="Recent links history" style={{ marginTop: '40px', width: '100%' }}>
      {/* ── Header ── */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={15} strokeWidth={2} style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
          <span
            style={{
              fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)',
              fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
              letterSpacing: '0.04em', textTransform: 'uppercase',
            }}
          >
            {t.recentLinks}
          </span>
          <span
            aria-label={`${history.length} links`}
            style={{
              fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)',
              background: 'var(--bg-subtle)', borderRadius: '20px',
              padding: '2px 8px',
              fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
            }}
          >
            {history.length}
          </span>
        </div>

        <button
          onClick={() => { clearHistory(); setHistory([]); }}
          aria-label="Clear all link history"
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '4px 8px', borderRadius: '8px',
            fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.color = '#B05A5A';
            el.style.background = '#FBF0F0';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.color = 'var(--text-muted)';
            el.style.background = 'none';
          }}
        >
          <Trash2 size={13} strokeWidth={2} aria-hidden="true" />
          {t.clear}
        </button>
      </div>

      {/* ── Cards ── */}
      <ol style={{ display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'none', padding: 0, margin: 0 }}>
        {history.map((item, i) => {
          const qrCount = item.qr_count ?? 0;
          const dateStr = formatHistoryDate(item.created_at);

          return (
            <li
              key={item.short_code}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <article
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  background: 'var(--bg-card)',
                  border: '1.5px solid var(--border)',
                  borderRadius: '16px',
                  padding: '14px 14px 12px',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--border-hover)';
                  el.style.boxShadow = '0 2px 12px rgba(44,32,20,0.07)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--border)';
                  el.style.boxShadow = 'none';
                }}
              >
                {/* Icon */}
                <div
                  aria-hidden="true"
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'var(--accent-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: '1px',
                  }}
                >
                  <ExternalLink size={15} strokeWidth={2} style={{ color: 'var(--accent)' }} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Short URL row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <a
                      href={item.short_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open short link ${item.short_url} in new tab`}
                      style={{
                        fontSize: '14px', fontWeight: 700, color: 'var(--accent)',
                        textDecoration: 'none',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                        flex: '0 1 auto', minWidth: 0,
                      }}
                    >
                      {item.short_url}
                    </a>
                  </div>

                  {/* Original URL */}
                  <p
                    style={{
                      fontSize: '12px', color: 'var(--text-muted)',
                      fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      margin: '0 0 8px',
                    }}
                    title={item.original_url}
                  >
                    {truncateForDisplay(item.original_url)}
                  </p>

                  {/* Metadata row */}
                  <div className="history-meta" aria-label="Link metadata">
                    {dateStr && (
                      <span
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)',
                          fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                        }}
                      >
                        <Calendar size={11} strokeWidth={2} aria-hidden="true" />
                        <time dateTime={item.created_at}>{dateStr}</time>
                      </span>
                    )}

                    {qrCount > 0 && (
                      <>
                        <span aria-hidden="true" style={{ color: 'var(--border)', fontSize: '11px' }}>·</span>
                        <span
                          aria-label={`QR code downloaded ${qrCount} time${qrCount !== 1 ? 's' : ''}`}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            fontSize: '11px', fontWeight: 600,
                            color: 'var(--accent)', background: 'var(--accent-light)',
                            borderRadius: '6px', padding: '2px 7px',
                            fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                          }}
                        >
                          <QrCode size={10} strokeWidth={2.5} aria-hidden="true" />
                          QR ×{qrCount}
                        </span>
                      </>
                    )}

                    <span
                      aria-label={`Link ${i + 1} of ${history.length}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center',
                        fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)',
                        background: 'var(--bg-subtle)',
                        borderRadius: '6px', padding: '2px 7px',
                        fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
                        marginLeft: 'auto',
                      }}
                    >
                      #{i + 1}
                    </span>
                  </div>
                </div>

                {/* Copy button */}
                <div style={{ flexShrink: 0, marginTop: '1px' }}>
                  <CopyButton text={item.short_url} size="sm" />
                </div>
              </article>
            </li>
          );
        })}
      </ol>

      <p
        style={{
          textAlign: 'center', marginTop: '14px',
          fontSize: '12px', color: 'var(--text-muted)',
          fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
        }}
      >
        {t.savedLocally}
      </p>
    </section>
  );
}
