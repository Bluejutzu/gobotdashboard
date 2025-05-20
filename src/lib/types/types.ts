import { GuildFeature } from "./DiscordGuildFeatures"
import { Database } from "./supabase"

export interface User {
    id: string
    discord_id: string
    username: string
    avatar_url: string
    email: string
    created_at: string
    updated_at: string
    supabase_user_id?: string
}

export interface DiscordPartialGuild {
    id: string
    name: string
    icon: string | null
    splash?: string
    features: GuildFeature[]
    permissions: number
    approximate_member_count: number
    approximate_presence_count: number
    description?: string,
    stickers: DiscordSticker[]
}

export interface Server extends DiscordPartialGuild {
    name: string
    created_at: string
    updated_at: string
    botPresent: boolean
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

export type ModerationCase = Database["public"]["Tables"]["moderation_cases"]["Row"];
export enum ModerationStatus {
    ACTIVE = "ACTIVE",
    RESOLVED = "RESOLVED",
    EXPIRED = "EXPIRED",
    REMOVED = "REMOVED",
    APPEALED = "APPEALED",
}

interface TriggerMetadata {
    // Define the structure based on your application's requirements
    [key: string]: any;
}

interface Action {
    // Define the structure based on your application's requirements
    [key: string]: any;
}

export interface AutoModerationRule {
    id: string; // Snowflake ID
    guild_id: string;
    name: string;
    creator_id: string;
    event_type: number;
    trigger_type: number;
    trigger_metadata: TriggerMetadata;
    actions: Action[];
    enabled: boolean;
    exempt_roles: string[];    // Max 20
    exempt_channels: string[]; // Max 50
}
