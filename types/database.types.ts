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
        };
        Insert: {
          id?: string;
          original_url: string;
          short_code: string;
          created_at?: string;
          click_count?: number;
        };
        Update: {
          id?: string;
          original_url?: string;
          short_code?: string;
          created_at?: string;
          click_count?: number;
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
