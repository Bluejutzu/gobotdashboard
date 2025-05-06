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
    id: string
    server_id: string
    user_id: string
    command: string
    executed_at: string
}

export interface UserServer {
    id: string
    user_id: string
    server_id: string
    is_admin: boolean
    created_at: string
}

export interface Role {
    id: string
    server_id: string
    discord_role_id: string
    name: string
    color: string
    position: number
    permissions: string
    mentionable: boolean
    hoist: boolean // Whether the role is displayed separately in the sidebar
    created_at: string
    updated_at: string
}

export interface ModerationAction {
    id: string
    server_id: string
    moderator_id: string // User ID of the moderator
    target_id: string // User ID of the target
    action_type: "ban" | "kick" | "timeout" | "warn" | "unban" | "mute" | "unmute"
    reason: string
    duration?: number // Duration in seconds for timeouts
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