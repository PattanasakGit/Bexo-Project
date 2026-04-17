'use client';

import { useState, useRef, useEffect } from 'react';

interface OGData {
  title: string | null;
  description: string | null;
  image: string | null;
  site_name: string | null;
  favicon: string | null;
  url: string;
}

type Phase = 'iframe' | 'og-loading' | 'og-ready' | 'hidden';

interface WebsitePreviewProps {
  url: string;
}

export default function WebsitePreview({ url }: WebsitePreviewProps) {
  const [phase, setPhase] = useState<Phase>('iframe');
  const [iframeVisible, setIframeVisible] = useState(false);
  const [ogData, setOGData] = useState<OGData | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackTriggeredRef = useRef(false);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      triggerFallback();
    }, 3000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function triggerFallback() {
    if (fallbackTriggeredRef.current) return;
    fallbackTriggeredRef.current = true;
    setPhase('og-loading');
    fetchOGData();
  }

  async function fetchOGData() {
    try {
      const res = await fetch(`/api/og-preview?url=${encodeURIComponent(url)}`);
      if (!res.ok) { setPhase('hidden'); return; }
      const data: OGData = await res.json();
      if (data.title || data.description || data.image) {
        setOGData(data);
        setPhase('og-ready');
      } else {
        setPhase('hidden');
      }
    } catch {
      setPhase('hidden');
    }
  }

  function handleIframeLoad() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (fallbackTriggeredRef.current) return; // already in OG phase
    setIframeVisible(true);
  }

  function handleIframeError() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    triggerFallback();
  }

  if (phase === 'hidden') return null;

  if (phase === 'iframe') {
    return (
      <div
        aria-hidden="true"
        style={{
          height: iframeVisible ? '240px' : '0',
          overflow: 'hidden',
          borderRadius: iframeVisible ? '12px' : '0',
          border: iframeVisible ? '1.5px solid var(--border, #EDE5DB)' : 'none',
          marginBottom: iframeVisible ? '16px' : '0',
          transition: 'height 0.35s ease, margin-bottom 0.35s ease',
        }}
      >
        <iframe
          src={url}
          title="Website preview"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          sandbox="allow-scripts allow-same-origin"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          tabIndex={-1}
        />
      </div>
    );
  }

  if (phase === 'og-loading') {
    return <OGSkeleton />;
  }

  if (phase === 'og-ready' && ogData) {
    return <OGCard data={ogData} url={url} />;
  }

  return null;
}

function OGSkeleton() {
  return (
    <div
      className="animate-fade-in"
      style={{
        marginBottom: '16px',
        borderRadius: '12px',
        border: '1.5px solid var(--border, #EDE5DB)',
        overflow: 'hidden',
        background: 'var(--bg-card, #fff)',
      }}
    >
      <div className="skeleton-pulse" style={{ height: '120px', background: 'var(--bg-subtle, #F2EBE0)' }} />
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <div className="skeleton-pulse" style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'var(--bg-subtle, #F2EBE0)', flexShrink: 0 }} />
          <div className="skeleton-pulse" style={{ width: '80px', height: '10px', borderRadius: '4px', background: 'var(--bg-subtle, #F2EBE0)' }} />
        </div>
        <div className="skeleton-pulse" style={{ height: '13px', width: '90%', borderRadius: '4px', background: 'var(--bg-subtle, #F2EBE0)', marginBottom: '6px' }} />
        <div className="skeleton-pulse" style={{ height: '13px', width: '72%', borderRadius: '4px', background: 'var(--bg-subtle, #F2EBE0)', marginBottom: '8px' }} />
        <div className="skeleton-pulse" style={{ height: '11px', width: '50%', borderRadius: '4px', background: 'var(--bg-subtle, #F2EBE0)' }} />
      </div>
    </div>
  );
}

interface OGCardProps {
  data: OGData;
  url: string;
}

function OGCard({ data, url }: OGCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="animate-fade-up"
      style={{ display: 'block', textDecoration: 'none', marginBottom: '16px' }}
    >
      <div
        style={{
          borderRadius: '12px',
          border: '1.5px solid var(--border, #EDE5DB)',
          overflow: 'hidden',
          background: 'var(--bg-card, #fff)',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = 'var(--border-hover, #C9B99E)';
          el.style.boxShadow = '0 4px 16px rgba(44,32,20,0.08)';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = 'var(--border, #EDE5DB)';
          el.style.boxShadow = 'none';
        }}
      >
        {data.image && (
          <div style={{ maxHeight: '200px', overflow: 'hidden', background: 'var(--bg-subtle, #F2EBE0)' }}>
            <img
              src={data.image}
              alt={data.title ?? ''}
              style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }}
              onError={e => {
                const container = (e.currentTarget as HTMLImageElement).parentElement;
                if (container) container.style.display = 'none';
              }}
            />
          </div>
        )}
        <div style={{ padding: '12px 14px' }}>
          {(data.favicon || data.site_name) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              {data.favicon && (
                <img
                  src={data.favicon}
                  alt=""
                  aria-hidden="true"
                  width={14}
                  height={14}
                  style={{ borderRadius: '3px', flexShrink: 0 }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              )}
              {data.site_name && (
                <span style={{
                  fontSize: '11px', fontWeight: 600,
                  color: 'var(--text-muted, #B09878)',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  {data.site_name}
                </span>
              )}
            </div>
          )}
          {data.title && (
            <p style={{
              fontSize: '14px', fontWeight: 700,
              color: 'var(--text-primary, #2C2014)',
              margin: '0 0 5px', lineHeight: 1.4,
              overflow: 'hidden', display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            } as React.CSSProperties}>
              {data.title}
            </p>
          )}
          {data.description && (
            <p style={{
              fontSize: '12px',
              color: 'var(--text-secondary, #7A6548)',
              margin: '0 0 6px', lineHeight: 1.5,
              overflow: 'hidden', display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            } as React.CSSProperties}>
              {data.description}
            </p>
          )}
          <p style={{
            fontSize: '11px',
            color: 'var(--text-muted, #B09878)',
            margin: 0,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {url}
          </p>
        </div>
      </div>
    </a>
  );
}
