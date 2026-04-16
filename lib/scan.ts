export type ScanStatus = 'safe' | 'malicious' | 'unknown';

/**
 * Scan a URL against the URLhaus database (no API key required).
 * - is_listed === 'yes'  → 'malicious'
 * - no_results           → 'safe'
 * - any error / timeout  → 'unknown'  (fail-open)
 */
export async function scanUrl(url: string): Promise<ScanStatus> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('https://urlhaus-api.abuse.ch/v1/url/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ url }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) return 'unknown';

    const data = (await res.json()) as { query_status?: string };

    if (data.query_status === 'is_listed') return 'malicious';
    if (data.query_status === 'no_results') return 'safe';
    return 'unknown';
  } catch {
    return 'unknown';
  }
}
