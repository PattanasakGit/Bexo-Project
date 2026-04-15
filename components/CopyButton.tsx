'use client';

import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  size?: 'sm' | 'md';
}

export default function CopyButton({ text, size = 'md' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const isSmall = size === 'sm';

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-lg transition-all duration-200
        ${isSmall
          ? 'px-2.5 py-1.5 text-xs'
          : 'px-4 py-2 text-sm'
        }
        ${copied
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300'
        }
      `}
    >
      {copied ? (
        <>
          <CheckIcon className={isSmall ? 'w-3 h-3' : 'w-4 h-4'} />
          Copied!
        </>
      ) : (
        <>
          <CopyIcon className={isSmall ? 'w-3 h-3' : 'w-4 h-4'} />
          Copy
        </>
      )}
    </button>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
