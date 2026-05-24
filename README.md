# Bexo — Free URL Shortener

A modern, minimal URL shortener built with Next.js 15 and Supabase. No signup required. Cookie-based link history. Fully optimized for SEO and AI search engines.

## Features

- Instant URL shortening — no account needed
- Cookie-based link history (stores last 10 links locally)
- Click tracking per short link
- Duplicate detection — same URL always returns the same short link
- Mobile-first responsive design
- Full SEO: Metadata, Open Graph, JSON-LD structured data, Sitemap

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel

## Getting Started

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Apply the database migration in `supabase/migrations/20260524172000_init_bexo_schema.sql`

The migration creates the `urls`, `profiles`, `pages`, and `page_links` tables, enables RLS, adds public policies needed for redirects and page rendering, and creates the auth profile trigger.

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Fill in your values in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` — from Supabase → Settings → API → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase → Settings → API → anon/public key
- `NEXT_PUBLIC_BASE_URL` — your deployed domain (or your local dev URL, for example `http://localhost:3000`)

### 3. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Keeping Free Supabase Projects Active

Supabase Free projects can be paused after inactivity. For production, use a paid Supabase plan. For hobby projects, this repo includes a lightweight health endpoint at `/api/health` and a GitHub Actions workflow at `.github/workflows/keep-supabase-awake.yml`.

To enable it after deployment, add a GitHub repository secret:

```text
KEEPALIVE_URL=https://your-domain.com/api/health
```

The workflow pings that endpoint every 3 days and can also be run manually from GitHub Actions.

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repository
4. Add environment variables (same as `.env.local`)
5. Click **Deploy**

## Project Structure

```
app/
├── layout.tsx          # Root layout with SEO metadata
├── page.tsx            # Homepage
├── globals.css         # Global styles
├── not-found.tsx       # 404 page
├── sitemap.ts          # Dynamic sitemap
├── robots.ts           # robots.txt
├── [code]/
│   └── page.tsx        # Short link redirect handler
└── api/
    └── shorten/
        └── route.ts    # POST: URL shortening API

components/
├── UrlShortenerForm.tsx # Main form with result display
├── HistoryList.tsx      # Cookie-based link history
└── CopyButton.tsx       # Copy to clipboard

lib/
├── supabase.ts          # Supabase client
└── utils.ts             # URL validation, short code generation

types/
└── index.ts             # TypeScript interfaces
```
