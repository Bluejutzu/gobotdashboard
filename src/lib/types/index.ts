import type { GuildFeature } from "./DiscordGuildFeatures"

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

export interface DiscordPartialGuild {
  id: string
  name: string
  icon: string
  splash?: string
  features: GuildFeature[]
  permissions: string
  approximate_member_count: number
  approximate_presence_count: number
  description?: string,
  stickers: DiscordSticker[]
}

export interface DiscordGuild extends DiscordPartialGuild {
  owner?: boolean
}

export interface DiscordSticker {
  id: string
  pack_id?: string
  name: string
  description?: string
  tags: string[]
  type: number,
  format: number,
  available?: boolean,
  guild_id?: string,
  user?: DiscordUser,
  sort_value?: number
}

export interface DiscordUser {
  id: string
  username: string
  avatar: string
  discriminator: string
  public_flags: number
  flags: number
  banner?: string
  accent_color?: number
  banner_color?: string
}

export interface DBThemeData extends ThemeData {
  primary_color?: string
  secondary_color?: string
  accent_color?: string
  border_radius?: number
  creator_name?: string

}

export interface ThemeData {
  id: number | string
  name: string
  primary: string
  secondary: string
  accent: string
  borderRadius: number
  creator?: string
  likes?: number
  isPublic?: boolean
  userId?: string
  createdAt?: string
  category?: string // Add category property
}

export interface ThemeContextType {
  currentTheme: ThemeData
  setCurrentTheme: (theme: ThemeData) => void
  savedThemes: ThemeData[]
  communityThemes: ThemeData[]
  saveTheme: (theme: ThemeData) => Promise<void>
  importTheme: (theme: ThemeData) => Promise<void>
  applyTheme: (theme: ThemeData) => void
  likeTheme: (themeId: number | string) => Promise<void>
  deleteTheme: (themeId: number | string) => Promise<void>
  isLoading: boolean
  error: string | null
}

export interface BlockDataProperties {
  name?: string
  description?: string
  cooldown?: number
  cooldownType?: 'user' | 'server'
  hideReplies?: boolean
  content?: string
  channel?: 'same_channel' | 'dm' | 'custom_channel'
  ephemeral?: boolean
  userId?: string
  channelId?: string
  title?: string
  color?: string
  leftValue?: string
  comparisonType?: 'equal_to' | 'not_equal_to' | 'greater_than' | 'less_than' | 'greater_than_equal' | 'less_than_equal' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with'
  rightValue?: string
  hasElseNode?: boolean
  required?: boolean
  min?: number | null
  max?: number | null
  errorMessage?: string
}

export interface Connection {
  id: string
  fromId: string
  toId: string
  fromSocket: string
  toSocket: string
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
          server_id: number
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
          server_id: number
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
          server_id?: number
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
