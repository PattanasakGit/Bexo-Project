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

**URL Shortener:**
1. User submits URL → `UrlShortenerForm` (client component)
2. POST `/api/shorten` validates URL, checks duplicates, generates a 7-char nanoid short code (up to 5 collision retries)
3. Short link stored in Supabase `urls` table
4. Result saved to browser cookies (10-item limit, 30-day expiry) for local history
5. Visiting `/{shortCode}` → dynamic route checks `urls` table first → redirects

**Micro-Landing Page:**
1. User fills form at `/create` → `CreatePage` (client component)
2. POST `/api/page` validates title + links, generates page_code (collision-checked against both `urls` and `pages`)
3. Page + links stored in Supabase `pages` + `page_links` tables
4. Result saved to `page_history` cookie (10-item limit, 30-day expiry)
5. Visiting `/{pageCode}` → `[code]/page.tsx` checks `urls` first, then `pages` → renders `LandingPage` component + increments `view_count`
6. Clicking a link on the landing page → POST `/api/page/{code}/click` increments `click_count` (non-blocking)

### URL vs Page Resolution (`app/[code]/page.tsx`)

```
/{code} →
  1. Check urls table by short_code → if found: security/redirect flow (existing)
  2. Check pages table by page_code → if found: render LandingPage + increment view_count
  3. Neither → notFound()
```

### Key Files

| Path | Role |
|------|------|
| `app/api/shorten/route.ts` | POST endpoint — URL validation, duplicate check, code generation |
| `app/api/page/route.ts` | POST endpoint — page creation, link bulk insert |
| `app/api/page/[code]/click/route.ts` | POST endpoint — link click_count increment |
| `app/[code]/page.tsx` | Dynamic handler — checks urls then pages, renders appropriate component |
| `app/[code]/components/LandingPage.tsx` | Micro-landing page UI (3 themes: warm/dark/gradient) |
| `app/create/page.tsx` | Page creation form UI |
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

CREATE TABLE pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_code VARCHAR(20) NOT NULL UNIQUE,
  title TEXT NOT NULL,
  bio TEXT,
  avatar_emoji TEXT NOT NULL DEFAULT '🔗',
  theme TEXT NOT NULL DEFAULT 'warm',
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE page_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  click_count INTEGER NOT NULL DEFAULT 0
);
```

RLS policies: public read + insert on all tables; click/view count updates are allowed without auth.

### Important Patterns

- **Duplicate detection**: Same original URL always returns the same short code (idempotent)
- **Collision-safe codes**: New short codes are checked against both `urls` and `pages` tables to prevent conflicts
- **Lazy Supabase client**: Instantiated on first use to prevent build failures when env vars are missing
- **Path alias**: `@/*` maps to the project root (tsconfig)
- **Tailwind CSS v4** with PostCSS — no `tailwind.config.js` needed
- **ESLint flat config** (`eslint.config.mjs`) using `next/core-web-vitals` + TypeScript rules
