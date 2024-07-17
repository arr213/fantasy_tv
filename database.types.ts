export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      app_user: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          last_name: string | null
          profile_url: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          last_name?: string | null
          profile_url?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          profile_url?: string | null
        }
        Relationships: []
      }
      contestant: {
        Row: {
          created_at: string
          display_name: string | null
          first_name: string | null
          id: number
          last_name: string | null
          rank: number | null
          season_id: number
          status: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          rank?: number | null
          season_id: number
          status?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          rank?: number | null
          season_id?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "contestant_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "season"
            referencedColumns: ["id"]
          },
        ]
      }
      episode: {
        Row: {
          air_date_time_end: string | null
          air_date_time_start: string | null
          created_at: string
          id: number
          is_live: boolean
          season_id: number | null
        }
        Insert: {
          air_date_time_end?: string | null
          air_date_time_start?: string | null
          created_at?: string
          id?: number
          is_live?: boolean
          season_id?: number | null
        }
        Update: {
          air_date_time_end?: string | null
          air_date_time_start?: string | null
          created_at?: string
          id?: number
          is_live?: boolean
          season_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "episode_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "season"
            referencedColumns: ["id"]
          },
        ]
      }
      event_type: {
        Row: {
          created_at: string
          description: string | null
          type_display_name: string
          type_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          type_display_name: string
          type_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          type_display_name?: string
          type_name?: string
        }
        Relationships: []
      }
      fantasy_event: {
        Row: {
          contestant_id: number | null
          created_at: string
          episode_id: number | null
          event_display_name: string | null
          event_type: string
          id: number
          round_id: number
        }
        Insert: {
          contestant_id?: number | null
          created_at?: string
          episode_id?: number | null
          event_display_name?: string | null
          event_type: string
          id?: number
          round_id: number
        }
        Update: {
          contestant_id?: number | null
          created_at?: string
          episode_id?: number | null
          event_display_name?: string | null
          event_type?: string
          id?: number
          round_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "season_event_contestant_id_fkey"
            columns: ["contestant_id"]
            isOneToOne: false
            referencedRelation: "contestant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_event_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episode"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_event_event_type_fkey"
            columns: ["event_type"]
            isOneToOne: false
            referencedRelation: "event_type"
            referencedColumns: ["type_name"]
          },
          {
            foreignKeyName: "season_event_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "round"
            referencedColumns: ["id"]
          },
        ]
      }
      league: {
        Row: {
          created_at: string
          id: number
          league_banner_url: string | null
          league_name: string
          league_status: Database["public"]["Enums"]["league_status"]
          payment_info: string | null
          rule_set: string | null
          season_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          league_banner_url?: string | null
          league_name: string
          league_status?: Database["public"]["Enums"]["league_status"]
          payment_info?: string | null
          rule_set?: string | null
          season_id: number
        }
        Update: {
          created_at?: string
          id?: number
          league_banner_url?: string | null
          league_name?: string
          league_status?: Database["public"]["Enums"]["league_status"]
          payment_info?: string | null
          rule_set?: string | null
          season_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "league_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "season"
            referencedColumns: ["id"]
          },
        ]
      }
      league_admin: {
        Row: {
          created_at: string
          email: string | null
          id: number
          league_id: number | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          league_id?: number | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          league_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "league_admin_email_fkey"
            columns: ["email"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["email"]
          },
          {
            foreignKeyName: "league_admin_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league"
            referencedColumns: ["id"]
          },
        ]
      }
      round: {
        Row: {
          created_at: string
          deadline_date_time: string | null
          display_name: string
          id: number
          round_number: number
          season_id: number
        }
        Insert: {
          created_at?: string
          deadline_date_time?: string | null
          display_name: string
          id?: number
          round_number: number
          season_id: number
        }
        Update: {
          created_at?: string
          deadline_date_time?: string | null
          display_name?: string
          id?: number
          round_number?: number
          season_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "round_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "season"
            referencedColumns: ["id"]
          },
        ]
      }
      season: {
        Row: {
          created_at: string
          id: number
          season_img_url: string | null
          season_name: string
          season_number: number | null
          show_id: number
          start_date_time: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: number
          season_img_url?: string | null
          season_name: string
          season_number?: number | null
          show_id: number
          start_date_time?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: number
          season_img_url?: string | null
          season_name?: string
          season_number?: number | null
          show_id?: number
          start_date_time?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "season_show_id_fkey"
            columns: ["show_id"]
            isOneToOne: false
            referencedRelation: "show"
            referencedColumns: ["id"]
          },
        ]
      }
      show: {
        Row: {
          created_at: string
          id: number
          show_img_url: string | null
          show_name: string
        }
        Insert: {
          created_at?: string
          id?: number
          show_img_url?: string | null
          show_name: string
        }
        Update: {
          created_at?: string
          id?: number
          show_img_url?: string | null
          show_name?: string
        }
        Relationships: []
      }
      survival_record: {
        Row: {
          contestant_id: number | null
          created_at: string
          id: number
          round_id: number
          team_id: number
        }
        Insert: {
          contestant_id?: number | null
          created_at?: string
          id?: number
          round_id: number
          team_id: number
        }
        Update: {
          contestant_id?: number | null
          created_at?: string
          id?: number
          round_id?: number
          team_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "survival_record_contestant_id_fkey"
            columns: ["contestant_id"]
            isOneToOne: false
            referencedRelation: "contestant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survival_record_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "round"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survival_record_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
        ]
      }
      team: {
        Row: {
          color: string | null
          created_at: string
          id: number
          league_id: number
          manager_email: string
          team_name: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: number
          league_id: number
          manager_email: string
          team_name?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: number
          league_id?: number
          manager_email?: string
          team_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "league"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_manager_email_fkey"
            columns: ["manager_email"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["email"]
          },
        ]
      }
      team_lineup: {
        Row: {
          created_at: string
          id: number
          team_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          team_id: number
        }
        Update: {
          created_at?: string
          id?: number
          team_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "team_lineup_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
        ]
      }
      team_member_placement: {
        Row: {
          contestant_id: number | null
          created_at: string
          id: number
          lineup_id: number | null
          position_number: number | null
        }
        Insert: {
          contestant_id?: number | null
          created_at?: string
          id?: number
          lineup_id?: number | null
          position_number?: number | null
        }
        Update: {
          contestant_id?: number | null
          created_at?: string
          id?: number
          lineup_id?: number | null
          position_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "team_member_placement_contestant_id_fkey"
            columns: ["contestant_id"]
            isOneToOne: false
            referencedRelation: "contestant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_member_placement_lineup_id_fkey"
            columns: ["lineup_id"]
            isOneToOne: false
            referencedRelation: "team_lineup"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_team_lineup: {
        Args: {
          the_team_id: number
          contestant_ids: number[]
        }
        Returns: undefined
      }
      get_all_lineups: {
        Args: {
          the_league_id: number
        }
        Returns: {
          lineup_id: number
          lineup_created_at: string
          team_id: number
          contestant_ids: number[]
          round_id: number
          round_number: number
        }[]
      }
      get_available_leagues: {
        Args: {
          user_email: string
        }
        Returns: {
          created_at: string
          id: number
          league_banner_url: string | null
          league_name: string
          league_status: Database["public"]["Enums"]["league_status"]
          payment_info: string | null
          rule_set: string | null
          season_id: number
        }[]
      }
      get_contestants: {
        Args: {
          the_league_id: number
        }
        Returns: {
          contestant_id: number
          first_name: string
          last_name: string
          display_name: string
          season_id: number
          status: string
          rank: number
        }[]
      }
      get_my_leagues: {
        Args: {
          user_email: string
        }
        Returns: {
          created_at: string
          id: number
          league_banner_url: string | null
          league_name: string
          league_status: Database["public"]["Enums"]["league_status"]
          payment_info: string | null
          rule_set: string | null
          season_id: number
        }[]
      }
      get_rounds_with_evictions: {
        Args: {
          the_league_id: number
        }
        Returns: {
          round_id: number
          season_id: number
          round_number: number
          display_name: string
          deadline_date_time: string
          evicted_contestant: number
        }[]
      }
      get_team_lineup: {
        Args: {
          the_league_id: number
          team_manager_email: string
          deadline?: string
        }
        Returns: {
          lineup_id: number
          lineup_created_at: string
          team_id: number
          contestant_ids: number[]
        }[]
      }
      get_team_submissions: {
        Args: {
          the_team_id: number
        }
        Returns: {
          round_id: number
          round_number: number
          round_display_name: string
          deadline_date_time: string
          contestant_id: number
          contestant_first_name: string
          contestant_last_name: string
          contestant_display_name: string
          contestant_status: string
          contestant_rank: number
          is_correct: boolean
        }[]
      }
      get_team_summary: {
        Args: {
          the_league_id: number
        }
        Returns: {
          team_name: string
          team_id: number
          league_name: string
          league_id: number
          team_manager_first_name: string
          team_manager_last_name: string
          team_manager_email: string
          team_line_up_so_far: number[]
          remaining_player_count: number
          mistake_count: number
          rounds_with_mistakes: number
        }[]
      }
    }
    Enums: {
      league_status: "open_signup" | "private_signup" | "current" | "finished"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
