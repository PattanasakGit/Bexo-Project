'use client';

import { useState, useEffect, useCallback } from 'react';
import CopyButton from './CopyButton';
import { HistoryItem } from '@/types';

const HISTORY_COOKIE_KEY = 'url_history';

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

function clearHistory() {
  document.cookie = `${HISTORY_COOKIE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

interface HistoryListProps {
  refreshTrigger?: number;
}

export default function HistoryList({ refreshTrigger }: HistoryListProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadHistory = useCallback(() => {
    setHistory(getHistory());
  }, []);

  useEffect(() => {
    setMounted(true);
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (mounted) {
      loadHistory();
    }
  }, [refreshTrigger, mounted, loadHistory]);

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  if (!mounted || history.length === 0) return null;

  return (
    <section className="mt-12 w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-700">Recent Links</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {history.length}
          </span>
        </div>
        <button
          onClick={handleClearHistory}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-1"
        >
          <TrashIcon className="w-3 h-3" />
          Clear history
        </button>
      </div>

      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.short_code}
            className="group flex items-center gap-3 p-3.5 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex-1 min-w-0">
              <a
                href={item.short_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                {item.short_url}
              </a>
              <p className="text-xs text-gray-400 truncate mt-0.5">{item.original_url}</p>
            </div>
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <CopyButton text={item.short_url} size="sm" />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        History is stored locally in your browser
      </p>
    </section>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
