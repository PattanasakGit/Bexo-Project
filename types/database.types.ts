export type Database = {
  public: {
    Tables: {
      urls: {
        Row: {
          id: string;
          original_url: string;
          short_code: string;
          created_at: string;
          click_count: number;
          password_hash: string | null;
          safe_mode: boolean;
          scan_status: string;
          scanned_at: string | null;
        };
        Insert: {
          id?: string;
          original_url: string;
          short_code: string;
          created_at?: string;
          click_count?: number;
          password_hash?: string | null;
          safe_mode?: boolean;
          scan_status?: string;
          scanned_at?: string | null;
        };
        Update: {
          id?: string;
          original_url?: string;
          short_code?: string;
          created_at?: string;
          click_count?: number;
          password_hash?: string | null;
          safe_mode?: boolean;
          scan_status?: string;
          scanned_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
