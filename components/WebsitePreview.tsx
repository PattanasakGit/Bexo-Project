'use client';

import { useState, useRef, useEffect } from 'react';

interface OGData {
  title: string | null;
  description: string | null;
  image: string | null;
  site_name: string | null;
  favicon: string | null;
  url: string;
  can_embed: boolean;
}

type Phase = 'og-loading' | 'iframe' | 'og-ready' | 'hidden';

interface WebsitePreviewProps {
  url: string;
}

export default function WebsitePreview({ url }: WebsitePreviewProps) {
  const [phase, setPhase] = useState<Phase>('og-loading');
  const [ogData, setOGData] = useState<OGData | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Holds OG data so iframe callbacks can access it without stale closure
  const ogDataRef = useRef<OGData | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/og-preview?url=${encodeURIComponent(url)}`);
        if (cancelled) return;
        const data: OGData = await res.json();
        if (cancelled) return;

        const hasContent = !!(data.title || data.description || data.image);
        ogDataRef.current = hasContent ? data : null;

        if (data.can_embed) {
          // Site allows iframes — try showing it, fall back to OG on timeout
          setOGData(hasContent ? data : null);
          setPhase('iframe');
          iframeTimerRef.current = setTimeout(() => {
            setPhase(hasContent ? 'og-ready' : 'hidden');
          }, 3000);
        } else if (hasContent) {
          setOGData(data);
          setPhase('og-ready');
        } else {
          setPhase('hidden');
        }
      } catch {
        if (!cancelled) setPhase('hidden');
      }
    }

    load();
    return () => {
      cancelled = true;
      if (iframeTimerRef.current) clearTimeout(iframeTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleIframeLoad() {
    if (iframeTimerRef.current) clearTimeout(iframeTimerRef.current);
    setIframeLoaded(true);
  }

  function handleIframeError() {
    if (iframeTimerRef.current) clearTimeout(iframeTimerRef.current);
    const data = ogDataRef.current;
    if (data) { setOGData(data); setPhase('og-ready'); }
    else setPhase('hidden');
  }

  if (phase === 'og-loading') return <OGSkeleton />;
  if (phase === 'hidden') return null;

  if (phase === 'iframe') {
    return (
      <div
        aria-hidden="true"
        style={{
          height: iframeLoaded ? '240px' : '0',
          overflow: 'hidden',
          borderRadius: iframeLoaded ? '12px' : '0',
          border: iframeLoaded ? '1.5px solid var(--border, #EDE5DB)' : 'none',
          marginBottom: iframeLoaded ? '16px' : '0',
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
