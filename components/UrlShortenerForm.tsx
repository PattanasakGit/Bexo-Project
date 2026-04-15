'use client';

import { useState, useRef } from 'react';
import CopyButton from './CopyButton';
import { ShortenResponse, HistoryItem } from '@/types';

const HISTORY_COOKIE_KEY = 'url_history';
const MAX_HISTORY = 10;
const COOKIE_EXPIRES_DAYS = 30;

function saveToHistory(item: HistoryItem) {
  try {
    const existing = getHistory();
    // Remove duplicate if same short_code
    const filtered = existing.filter((h) => h.short_code !== item.short_code);
    const updated = [item, ...filtered].slice(0, MAX_HISTORY);
    const expires = new Date();
    expires.setDate(expires.getDate() + COOKIE_EXPIRES_DAYS);
    document.cookie = `${HISTORY_COOKIE_KEY}=${encodeURIComponent(JSON.stringify(updated))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  } catch {
    // Silently fail if cookies are blocked
  }
}

function getHistory(): HistoryItem[] {
  try {
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${HISTORY_COOKIE_KEY}=`));
    if (!match) return [];
    const raw = decodeURIComponent(match.split('=')[1]);
    return JSON.parse(raw) as HistoryItem[];
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
      setError('Please enter a URL');
      inputRef.current?.focus();
      return;
    }

    // Add protocol if missing
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

      // Save to cookie history
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
    <div className="w-full">
      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError('');
            }}
            placeholder="Paste your long URL here..."
            className={`
              w-full px-4 py-3.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              transition-all duration-200 bg-white
              ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}
            `}
            disabled={loading}
            aria-label="URL to shorten"
          />
          {error && (
            <p className="absolute -bottom-6 left-0 text-xs text-red-600 flex items-center gap-1">
              <span>⚠</span> {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="
            px-6 py-3.5 bg-indigo-600 text-white rounded-xl font-medium text-sm
            hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap
            min-w-[140px]
          "
        >
          {loading ? (
            <>
              <SpinnerIcon className="w-4 h-4 animate-spin" />
              Shortening...
            </>
          ) : (
            <>
              <LinkIcon className="w-4 h-4" />
              Shorten URL
            </>
          )}
        </button>
      </form>

      {/* Result Card */}
      {result && (
        <div className="mt-8 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <p className="text-sm font-medium text-gray-600">Your short link is ready!</p>
          </div>

          {/* Short URL display */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3">
            <a
              href={result.short_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-indigo-600 font-medium text-sm hover:text-indigo-800 transition-colors truncate"
            >
              {result.short_url}
            </a>
            <CopyButton text={result.short_url} />
          </div>

          {/* Original URL */}
          <p className="text-xs text-gray-400 truncate">
            <span className="font-medium text-gray-500">Original: </span>
            {result.original_url}
          </p>
        </div>
      )}
    </div>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}
