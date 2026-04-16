'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CopyButtonProps {
  text: string;
  size?: 'sm' | 'md';
}

export default function CopyButton({ text, size = 'md' }: CopyButtonProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const isSmall = size === 'sm';

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? t.copied : t.copy}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
        fontWeight: 600,
        fontSize: isSmall ? '12px' : '13px',
        padding: isSmall ? '5px 10px' : '7px 14px',
        borderRadius: '10px',
        border: `1.5px solid ${copied ? '#B8D4A8' : 'var(--border)'}`,
        background: copied ? 'var(--success-light)' : 'var(--bg)',
        color: copied ? 'var(--success)' : 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        if (!copied) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)';
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-light)';
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg)';
        }
      }}
    >
      {copied ? (
        <Check size={isSmall ? 12 : 14} strokeWidth={2.5} />
      ) : (
        <Copy size={isSmall ? 12 : 14} strokeWidth={2} />
      )}
      {copied ? t.copied : t.copy}
    </button>
  );
}
