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
  qr_count?: number;
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

export interface PageRecord {
  id: string;
  page_code: string;
  title: string;
  bio: string | null;
  avatar_emoji: string;
  theme: 'warm' | 'dark' | 'gradient';
  view_count: number;
  created_at: string;
}

export interface PageLink {
  id: string;
  page_id: string;
  title: string;
  url: string;
  position: number;
  click_count: number;
}

export interface PageWithLinks extends PageRecord {
  page_links: PageLink[];
}

export interface CreatePageRequest {
  title: string;
  bio?: string;
  avatar_emoji?: string;
  theme?: string;
  links: { title: string; url: string }[];
}

export interface CreatePageResponse {
  page_code: string;
  page_url: string;
  title: string;
}

export interface PageHistoryItem {
  page_code: string;
  title: string;
  page_url: string;
  created_at: string;
}
