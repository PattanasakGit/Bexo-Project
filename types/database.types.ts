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
      pages: {
        Row: {
          id: string;
          page_code: string;
          title: string;
          bio: string | null;
          avatar_emoji: string;
          theme: string;
          view_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          page_code: string;
          title: string;
          bio?: string | null;
          avatar_emoji?: string;
          theme?: string;
          view_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          page_code?: string;
          title?: string;
          bio?: string | null;
          avatar_emoji?: string;
          theme?: string;
          view_count?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      page_links: {
        Row: {
          id: string;
          page_id: string;
          title: string;
          url: string;
          position: number;
          click_count: number;
        };
        Insert: {
          id?: string;
          page_id: string;
          title: string;
          url: string;
          position?: number;
          click_count?: number;
        };
        Update: {
          id?: string;
          page_id?: string;
          title?: string;
          url?: string;
          position?: number;
          click_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'page_links_page_id_fkey';
            columns: ['page_id'];
            referencedRelation: 'pages';
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
