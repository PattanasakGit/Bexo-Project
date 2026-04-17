import { NextRequest, NextResponse } from 'next/server';

interface OGResult {
  title: string | null;
  description: string | null;
  image: string | null;
  site_name: string | null;
  favicon: string | null;
  url: string;
}

function decodeHtml(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function extractMeta(html: string, attrName: string, attrValue: string): string | null {
  const escaped = attrValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`<meta\\b[^>]*\\b${attrName}=["']${escaped}["'][^>]+\\bcontent=["']([^"']*?)["']`, 'i'),
    new RegExp(`<meta\\b[^>]*\\bcontent=["']([^"']*?)["'][^>]+\\b${attrName}=["']${escaped}["']`, 'i'),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]?.trim()) return decodeHtml(match[1].trim());
  }
  return null;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match?.[1] ? decodeHtml(match[1].trim()) : null;
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get('url');
  const empty: OGResult = { title: null, description: null, image: null, site_name: null, favicon: null, url: rawUrl ?? '' };

  if (!rawUrl) return NextResponse.json(empty);

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(rawUrl);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) return NextResponse.json(empty);
  } catch {
    return NextResponse.json(empty);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(rawUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BexoBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });
    clearTimeout(timer);

    if (!response.ok) return NextResponse.json(empty);

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html')) return NextResponse.json(empty);

    // Limit to first 200KB — <head> is nearly always within that
    const raw = await response.text();
    const headEnd = raw.indexOf('</head>');
    const html = raw.slice(0, headEnd > -1 ? headEnd + 7 : Math.min(raw.length, 200000));

    const title =
      extractMeta(html, 'property', 'og:title') ??
      extractMeta(html, 'name', 'twitter:title') ??
      extractTitle(html);

    const description =
      extractMeta(html, 'property', 'og:description') ??
      extractMeta(html, 'name', 'twitter:description') ??
      extractMeta(html, 'name', 'description');

    let image =
      extractMeta(html, 'property', 'og:image') ??
      extractMeta(html, 'name', 'twitter:image');

    if (image && !image.startsWith('http')) {
      try {
        image = new URL(image, rawUrl).href;
      } catch {
        image = null;
      }
    }

    const site_name =
      extractMeta(html, 'property', 'og:site_name') ?? parsedUrl.hostname;

    const favicon = `${parsedUrl.protocol}//${parsedUrl.hostname}/favicon.ico`;

    return NextResponse.json(
      { title, description, image, site_name, favicon, url: rawUrl } satisfies OGResult,
      { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' } },
    );
  } catch {
    clearTimeout(timer);
    return NextResponse.json(empty);
  }
}
