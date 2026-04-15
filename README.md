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
2. In your Supabase dashboard, open the **SQL Editor** and run:

```sql
CREATE TABLE urls (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(20) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  click_count INTEGER DEFAULT 0
);

CREATE INDEX idx_urls_short_code ON urls(short_code);

ALTER TABLE urls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON urls FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON urls FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update click_count" ON urls FOR UPDATE USING (true);
```

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Fill in your values in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` — from Supabase → Settings → API → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase → Settings → API → anon/public key
- `NEXT_PUBLIC_BASE_URL` — your deployed domain (or `http://localhost:3000` for dev)

### 3. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

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
