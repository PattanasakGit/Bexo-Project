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
          user_id: string | null;
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
          user_id?: string | null;
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
          user_id?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
