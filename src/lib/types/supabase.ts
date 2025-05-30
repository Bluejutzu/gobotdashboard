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
      admin_users: {
        Row: {
          created_at: string | null
          discord_id: string
          id: string
          password_hash: string
          updated_at: string | null
          user_id: string | null
          whitelisted_ips: string[] | null
        }
        Insert: {
          created_at?: string | null
          discord_id: string
          id?: string
          password_hash: string
          updated_at?: string | null
          user_id?: string | null
          whitelisted_ips?: string[] | null
        }
        Update: {
          created_at?: string | null
          discord_id?: string
          id?: string
          password_hash?: string
          updated_at?: string | null
          user_id?: string | null
          whitelisted_ips?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_events: {
        Row: {
          created_at: string | null
          id: string
          processed_at: string | null
          server_id: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          processed_at?: string | null
          server_id: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          processed_at?: string | null
          server_id?: string
          type?: string
        }
        Relationships: []
      }
      bot_settings: {
        Row: {
          auto_role: string | null
          created_at: string | null
          custom_commands: Json | null
          id: string
          moderation_enabled: boolean | null
          prefix: string | null
          server_id: string | null
          updated_at: string | null
          welcome_message: string | null
        }
        Insert: {
          auto_role?: string | null
          created_at?: string | null
          custom_commands?: Json | null
          id?: string
          moderation_enabled?: boolean | null
          prefix?: string | null
          server_id?: string | null
          updated_at?: string | null
          welcome_message?: string | null
        }
        Update: {
          auto_role?: string | null
          created_at?: string | null
          custom_commands?: Json | null
          id?: string
          moderation_enabled?: boolean | null
          prefix?: string | null
          server_id?: string | null
          updated_at?: string | null
          welcome_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bot_settings_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: true
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      commands: {
        Row: {
          command_id: string | null
          created_at: string | null
          description: string | null
          edges: Json
          id: number
          name: string
          nodes: Json
          server_id: string
          updated_at: string | null
        }
        Insert: {
          command_id?: string | null
          created_at?: string | null
          description?: string | null
          edges: Json
          id?: never
          name: string
          nodes: Json
          server_id: string
          updated_at?: string | null
        }
        Update: {
          command_id?: string | null
          created_at?: string | null
          description?: string | null
          edges?: Json
          id?: never
          name?: string
          nodes?: Json
          server_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      commands_log: {
        Row: {
          command: string
          executed_at: string | null
          id: string
          server_id: string | null
          user_id: string | null
        }
        Insert: {
          command: string
          executed_at?: string | null
          id?: string
          server_id?: string | null
          user_id?: string | null
        }
        Update: {
          command?: string
          executed_at?: string | null
          id?: string
          server_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commands_log_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commands_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      data_requests: {
        Row: {
          created_at: string | null
          data_url: string | null
          expires_at: string | null
          id: string
          rejection_reason: string | null
          request_reason: string | null
          request_type: string
          server_id: string | null
          status: string
          updated_at: string | null
          user_id: string | null
          user_id2: string | null
        }
        Insert: {
          created_at?: string | null
          data_url?: string | null
          expires_at?: string | null
          id?: string
          rejection_reason?: string | null
          request_reason?: string | null
          request_type: string
          server_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
          user_id2?: string | null
        }
        Update: {
          created_at?: string | null
          data_url?: string | null
          expires_at?: string | null
          id?: string
          rejection_reason?: string | null
          request_reason?: string | null
          request_type?: string
          server_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
          user_id2?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_requests_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["discord_id"]
          },
          {
            foreignKeyName: "data_requests_user_id2_fkey"
            columns: ["user_id2"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["discord_id"]
          },
        ]
      }
      moderation_cases: {
        Row: {
          action: string
          avatar: string | null
          created_at: string | null
          duration: number | null
          expires_at: number | null
          guild_id: string
          id: string
          moderator_id: string
          moderator_name: string | null
          reason: string | null
          status: Database["public"]["Enums"]["ModerationStatus"]
          timestamp: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          action: string
          avatar?: string | null
          created_at?: string | null
          duration?: number | null
          expires_at?: number | null
          guild_id: string
          id: string
          moderator_id: string
          moderator_name?: string | null
          reason?: string | null
          status?: Database["public"]["Enums"]["ModerationStatus"]
          timestamp?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          action?: string
          avatar?: string | null
          created_at?: string | null
          duration?: number | null
          expires_at?: number | null
          guild_id?: string
          id?: string
          moderator_id?: string
          moderator_name?: string | null
          reason?: string | null
          status?: Database["public"]["Enums"]["ModerationStatus"]
          timestamp?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      server_access_roles: {
        Row: {
          access_level: string
          created_at: string | null
          discord_role_id: string
          id: string
          server_id: string | null
          updated_at: string | null
        }
        Insert: {
          access_level: string
          created_at?: string | null
          discord_role_id: string
          id?: string
          server_id?: string | null
          updated_at?: string | null
        }
        Update: {
          access_level?: string
          created_at?: string | null
          discord_role_id?: string
          id?: string
          server_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "server_access_roles_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      servers: {
        Row: {
          created_at: string | null
          discord_id: string
          icon_url: string | null
          id: string
          member_count: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          discord_id: string
          icon_url?: string | null
          id?: string
          member_count?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          discord_id?: string
          icon_url?: string | null
          id?: string
          member_count?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_saved_themes: {
        Row: {
          created_at: string | null
          id: string
          theme_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          theme_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          theme_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_saved_themes_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "user_themes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_saved_themes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_servers: {
        Row: {
          created_at: string | null
          id: string
          is_admin: boolean | null
          server_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_admin?: boolean | null
          server_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_admin?: boolean | null
          server_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_servers_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_servers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_themes: {
        Row: {
          accent_color: string
          border_radius: number
          created_at: string | null
          creator_name: string | null
          id: string
          is_public: boolean | null
          likes: number | null
          name: string
          primary_color: string | null
          secondary_color: string
          updated_at: string | null
          user_id: string
          user_id2: string
        }
        Insert: {
          accent_color: string
          border_radius: number
          created_at?: string | null
          creator_name?: string | null
          id?: string
          is_public?: boolean | null
          likes?: number | null
          name: string
          primary_color?: string | null
          secondary_color: string
          updated_at?: string | null
          user_id: string
          user_id2: string
        }
        Update: {
          accent_color?: string
          border_radius?: number
          created_at?: string | null
          creator_name?: string | null
          id?: string
          is_public?: boolean | null
          likes?: number | null
          name?: string
          primary_color?: string | null
          secondary_color?: string
          updated_at?: string | null
          user_id?: string
          user_id2?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_themes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["supabase_user_id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          discord_id: string
          discord_refresh_token: string | null
          discord_token: string | null
          discord_token_expires_at: number | null
          email: string | null
          id: string
          supabase_user_id: string
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          discord_id: string
          discord_refresh_token?: string | null
          discord_token?: string | null
          discord_token_expires_at?: number | null
          email?: string | null
          id?: string
          supabase_user_id: string
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          discord_id?: string
          discord_refresh_token?: string | null
          discord_token?: string | null
          discord_token_expires_at?: number | null
          email?: string | null
          id?: string
          supabase_user_id?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      case_status: "warn" | "mute" | "ban" | "unban" | "kick"
      ModerationStatus:
        | "ACTIVE"
        | "RESOLVED"
        | "EXPIRED"
        | "REMOVED"
        | "APPEALED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      case_status: ["warn", "mute", "ban", "unban", "kick"],
      ModerationStatus: [
        "ACTIVE",
        "RESOLVED",
        "EXPIRED",
        "REMOVED",
        "APPEALED",
      ],
    },
  },
} as const
