export interface UrlRecord {
  id: string;
  original_url: string;
  short_code: string;
  created_at: string;
  click_count: number;
  password_hash: string | null;
  safe_mode: boolean;
  scan_status: string;
  scanned_at: string | null;
}

export interface HistoryItem {
  short_code: string;
  original_url: string;
  short_url: string;
  created_at: string;
}

export interface ShortenResponse {
  short_code: string;
  short_url: string;
  original_url: string;
  safe_mode: boolean;
  scan_status: string;
}

export interface ShortenError {
  error: string;
}
