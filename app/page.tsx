'use client';

import { useState } from 'react';
import UrlShortenerForm from '@/components/UrlShortenerForm';
import HistoryList from '@/components/HistoryList';

export default function Home() {
  const [historyTrigger, setHistoryTrigger] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">Bexo</span>
          </div>
          <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2.5 py-1 rounded-full">
            Free · No signup
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-indigo-100">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            Instant · Free · No account needed
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-4">
            Shorten your URLs
            <span className="text-indigo-600"> instantly</span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-md mx-auto">
            Paste a long link, get a short one. No signup, no hassle.
            Your link history is saved locally in your browser.
          </p>
        </div>

        {/* Shortener Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <UrlShortenerForm onHistoryUpdate={() => setHistoryTrigger((n) => n + 1)} />
        </div>

        {/* Features row */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { icon: '⚡', label: 'Instant', desc: 'No waiting' },
            { icon: '🔒', label: 'Private', desc: 'No tracking' },
            { icon: '📋', label: 'History', desc: 'Local only' },
          ].map((feature) => (
            <div key={feature.label} className="text-center py-4">
              <div className="text-2xl mb-1">{feature.icon}</div>
              <p className="text-xs font-semibold text-gray-700">{feature.label}</p>
              <p className="text-xs text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* History section */}
        <HistoryList refreshTrigger={historyTrigger} />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-700">Bexo</span>
          </div>
          <p className="text-xs text-gray-400">
            Free URL shortener. Your links, your data.
          </p>
        </div>
      </footer>
    </div>
  );
}
