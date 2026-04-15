'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, Trash2, ExternalLink } from 'lucide-react';
import CopyButton from './CopyButton';
import { HistoryItem } from '@/types';

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

interface HistoryListProps {
  refreshTrigger?: number;
}

export default function HistoryList({ refreshTrigger }: HistoryListProps) {
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
    <section style={{ marginTop: '40px', width: '100%' }}>
      {/* Section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={15} strokeWidth={2} style={{ color: 'var(--text-muted)' }} />
          <span
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-nunito), Nunito, sans-serif',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Recent Links
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-muted)',
              background: 'var(--bg-subtle)',
              borderRadius: '20px',
              padding: '2px 8px',
              fontFamily: 'var(--font-nunito), Nunito, sans-serif',
            }}
          >
            {history.length}
          </span>
        </div>

        <button
          onClick={() => {
            clearHistory();
            setHistory([]);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '8px',
            fontFamily: 'var(--font-nunito), Nunito, sans-serif',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color = '#B05A5A';
            (e.currentTarget as HTMLButtonElement).style.background = '#FBF0F0';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
            (e.currentTarget as HTMLButtonElement).style.background = 'none';
          }}
        >
          <Trash2 size={13} strokeWidth={2} />
          Clear
        </button>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {history.map((item, i) => (
          <div
            key={item.short_code}
            className="animate-fade-up"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'var(--bg-card)',
              border: '1.5px solid var(--border)',
              borderRadius: '14px',
              padding: '12px 14px',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              animationDelay: `${i * 0.04}s`,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-hover)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(44,32,20,0.07)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'var(--accent-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ExternalLink size={15} strokeWidth={2} style={{ color: 'var(--accent)' }} />
            </div>

            {/* URLs */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <a
                href={item.short_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-nunito), Nunito, sans-serif',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: '2px',
                }}
              >
                {item.short_url}
              </a>
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-nunito), Nunito, sans-serif',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  margin: 0,
                }}
              >
                {item.original_url}
              </p>
            </div>

            {/* Copy */}
            <div style={{ flexShrink: 0 }}>
              <CopyButton text={item.short_url} size="sm" />
            </div>
          </div>
        ))}
      </div>

      <p
        style={{
          textAlign: 'center',
          marginTop: '14px',
          fontSize: '12px',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-nunito), Nunito, sans-serif',
        }}
      >
        Saved locally in your browser
      </p>
    </section>
  );
}
