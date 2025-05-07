export interface User {
    id: string
    discord_id: string
    username: string
    avatar_url: string
    email: string
    created_at: string
    updated_at: string
}

export interface Server {
    id: string
    discord_id: string
    name: string
    icon_url: string
    member_count: number
    created_at: string
    updated_at: string
}

export interface BotSettings {
    id: string
    server_id: string
    prefix: string
    welcome_message: string
    auto_role: string
    moderation_enabled: boolean
    custom_commands: Record<string, string>
    created_at: string
    updated_at: string
}

export interface CommandLog {
  command: string;
  executed_at: string | null;
  id: string;
  server_id: string | null;
  user_id: string | null;
}

export interface UserServer {
    id: string
    user_id: string
    server_id: string
    is_admin: boolean
    created_at: string
}

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
        }
        Relationships: [
          {
            foreignKeyName: "data_requests_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          id: string
          is_public: boolean | null
          likes: number | null
          name: string
          primary_color: string
          secondary_color: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          accent_color: string
          border_radius: number
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          likes?: number | null
          name: string
          primary_color: string
          secondary_color: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          accent_color?: string
          border_radius?: number
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          likes?: number | null
          name?: string
          primary_color?: string
          secondary_color?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_themes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          discord_id: string
          discord_token: string | null
          email: string | null
          id: string
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          discord_id: string
          discord_token?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          discord_id?: string
          discord_token?: string | null
          email?: string | null
          id?: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const

export interface Role {
    id: string
    server_id: string
    discord_role_id: string
    name: string
    color: string
    position: number
    permissions: string
    mentionable: boolean
    hoist: boolean 
    created_at: string
    updated_at: string
}

export interface ModerationAction {
    id: string
    server_id: string
    moderator_id: string 
    target_id: string 
    action_type: "ban" | "kick" | "timeout" | "warn" | "unban" | "mute" | "unmute"
    reason: string
    duration?: number 
    created_at: string
}

export interface MessageAnalytics {
    id: string
    server_id: string
    user_id: string
    channel_id: string
    message_count: number
    date: string
}

export interface AutoModSetting {
    id: string
    server_id: string
    spam_protection: boolean
    max_mentions: number
    word_filter_enabled: boolean
    filtered_words: string[]
    link_filter: boolean
    invite_filter: boolean
    created_at: string
    updated_at: string
}

export interface ServerGrowth {
    id: string
    server_id: string
    member_count: number
    date: string
}

export interface ThemeData {
    id: number,
    name: string,
    creator: string,
    likes: number,
    primary: string,
    secondary: string,
    accent: string,
    borderRadius: number,
}

export type Snowflake = string;

export type DiscordPartialGuild = {
    id: string
    name: string
    icon: string | null
    banner?: string | null
    owner?: boolean
    permissions?: string
    features?: string[]
    approximate_member_count?: number
    approximate_presence_count?: number
}
