export interface UrlRecord {
  id: string;
  original_url: string;
  short_code: string;
  created_at: string;
  click_count: number;
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
}

export interface ShortenError {
  error: string;
}
