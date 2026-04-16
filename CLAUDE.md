# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

No test framework is configured in this project.

## Environment Setup

Copy `.env.example` to `.env.local` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_BASE_URL=
```

## Architecture

**Bexo** is a privacy-first URL shortener built with Next.js 15 App Router + Supabase (PostgreSQL). No authentication is required — history is stored in browser cookies only.

### Data Flow

1. User submits URL → `UrlShortenerForm` (client component)
2. POST `/api/shorten` validates URL, checks duplicates, generates a 7-char nanoid short code (up to 5 collision retries)
3. Short link stored in Supabase `urls` table
4. Result saved to browser cookies (10-item limit, 30-day expiry) for local history
5. Visiting `/{shortCode}` → dynamic route looks up original URL, increments `click_count` (non-blocking, best-effort), then redirects

### Key Files

| Path | Role |
|------|------|
| `app/api/shorten/route.ts` | POST endpoint — URL validation, duplicate check, code generation |
| `app/[code]/page.tsx` | Dynamic redirect handler + click tracking |
| `components/UrlShortenerForm.tsx` | Main form, result card, QR modal, share panel |
| `components/HistoryList.tsx` | Cookie-based recent links sidebar |
| `contexts/LanguageContext.tsx` | i18n provider (EN/TH/JA), persisted to localStorage |
| `lib/supabase.ts` | Lazy singleton Supabase client (avoids build-time env errors) |
| `lib/utils.ts` | `generateShortCode()`, `isValidUrl()`, `getBaseUrl()`, `formatDate()`, `truncateUrl()` |
| `types/database.types.ts` | Supabase table schema types |

### Database Schema

```sql
CREATE TABLE urls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_url TEXT NOT NULL,
  short_code VARCHAR(20) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  click_count INTEGER DEFAULT 0
);
```

RLS policies: public read + insert; click count updates are allowed without auth.

### Important Patterns

- **Duplicate detection**: Same original URL always returns the same short code (idempotent)
- **Lazy Supabase client**: Instantiated on first use to prevent build failures when env vars are missing
- **Path alias**: `@/*` maps to the project root (tsconfig)
- **Tailwind CSS v4** with PostCSS — no `tailwind.config.js` needed
- **ESLint flat config** (`eslint.config.mjs`) using `next/core-web-vitals` + TypeScript rules
