import { getCachedData, invalidateCache } from '@/lib/redis'
import { v4 as uuidv4 } from 'uuid'
import { createClient } from '../supabase/client'

// Type definitions
export type ModerationAction = 'warn' | 'mute' | 'kick' | 'ban' | 'unban'
export type ModerationStatus = 'active' | 'resolved' | 'appealed' | 'expired'

export interface ModerationCase {
    id: string
    serverId: string
    userId: string
    username: string
    avatar: string | null
    action: ModerationAction
    reason: string
    moderatorId: string
    moderatorName: string
    timestamp: string
    status: ModerationStatus
    duration?: string
    expiresAt?: string
}

export interface AutoModerationSettings {
    profanityFilter: boolean
    profanityLevel: number
    profanityAction: string
    spamProtection: boolean
    spamThreshold: number
    spamAction: string
    linkFilter: boolean
    linkAction: string
    mentionProtection: boolean
    mentionAction: string
    capsFilter: boolean
    capsAction: string
}

export interface CustomFlag {
    id: string
    name: string
    pattern: string
    type: 'keyword' | 'regex'
    severity: 'low' | 'medium' | 'high'
    enabled: boolean
}

export interface CommandSetting {
    id: string
    name: string
    description: string
    usage: string
    example: string
    permission: 'everyone' | 'moderator' | 'admin'
    enabled: boolean
    cooldown: number
}

// Cache keys
const getCasesCacheKey = (serverId: string) => `moderation:cases:${serverId}`
const getCaseCacheKey = (caseId: string) => `moderation:case:${caseId}`
const getAutoModCacheKey = (serverId: string) => `moderation:automod:${serverId}`
const getFlagsCacheKey = (serverId: string) => `moderation:flags:${serverId}`
const getCommandsCacheKey = (serverId: string) => `moderation:commands:${serverId}`

// Get all moderation cases for a server
export async function getModerationCases(serverId: string): Promise<ModerationCase[]> {
    return getCachedData(
        getCasesCacheKey(serverId),
        async () => {
            const supabase = createClient()

            const { data, error } = await supabase
                .from('moderation_cases')
                .select(`
          id,
          server_id,
          user_id,
          moderator_id,
          action,
          reason,
          duration,
          expires_at,
          status,
          created_at,
          updated_at
        `)
                .eq('server_id', serverId)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching moderation cases:', error)
                throw error
            }

            // Add type assertion for the database response
            const typedData = data as Array<{
                id: string;
                server_id: string;
                user_id: string;
                moderator_id: string;
                action: ModerationAction;
                reason: string;
                duration: string | null;
                expires_at: string | null;
                status: ModerationStatus;
                created_at: string;
                updated_at: string;
            }>

            // We need to fetch user data for both users and moderators
            const cases: ModerationCase[] = await Promise.all(
                typedData.map(async (caseData) => {
                    // Get user data
                    const { data: userData } = await supabase
                        .from('users')
                        .select('username, avatar_url')
                        .eq('discord_id', caseData.user_id)
                        .single()

                    // Get moderator data
                    const { data: modData } = await supabase
                        .from('users')
                        .select('username')
                        .eq('discord_id', caseData.moderator_id)
                        .single()

                    return {
                        id: caseData.id,
                        serverId: caseData.server_id,
                        userId: caseData.user_id,
                        username: (userData as { username: string })?.username || 'Unknown User',
                        avatar: (userData as { avatar_url: string | null })?.avatar_url,
                        action: caseData.action,
                        reason: caseData.reason,
                        moderatorId: caseData.moderator_id,
                        moderatorName: (modData as { username: string })?.username || 'Unknown Moderator',
                        timestamp: caseData.created_at,
                        status: caseData.status,
                        duration: caseData.duration || undefined,
                        expiresAt: caseData.expires_at || undefined,
                    }
                })
            )

            return cases
        },
        60 * 5 // 5 minutes cache
    )
}

// Get a single moderation case
export async function getModerationCase(caseId: string): Promise<ModerationCase> {
    return getCachedData(
        getCaseCacheKey(caseId),
        async () => {
            const supabase = createClient()

            const { data, error } = await supabase
                .from('moderation_cases')
                .select(`
          id,
          server_id,
          user_id,
          moderator_id,
          action,
          reason,
          duration,
          expires_at,
          status,
          created_at,
          updated_at
        `)
                .eq('id', caseId)
                .single()

            if (error) {
                console.error('Error fetching moderation case:', error)
                throw error
            }

            // Add type assertion for the database response
            const typedData = data as {
                id: string;
                server_id: string;
                user_id: string;
                moderator_id: string;
                action: ModerationAction;
                reason: string;
                duration: string | null;
                expires_at: string | null;
                status: ModerationStatus;
                created_at: string;
                updated_at: string;
            }

            // Get user data
            const { data: userData } = await supabase
                .from('users')
                .select('username, avatar_url')
                .eq('discord_id', typedData.user_id)
                .single()

            // Get moderator data
            const { data: modData } = await supabase
                .from('users')
                .select('username')
                .eq('discord_id', typedData.moderator_id)
                .single()

            return {
                id: typedData.id,
                serverId: typedData.server_id,
                userId: typedData.user_id,
                username: (userData as { username: string })?.username || 'Unknown User',
                avatar: (userData as { avatar_url: string | null })?.avatar_url,
                action: typedData.action,
                reason: typedData.reason,
                moderatorId: typedData.moderator_id,
                moderatorName: (modData as { username: string })?.username || 'Unknown Moderator',
                timestamp: typedData.created_at,
                status: typedData.status,
                duration: typedData.duration || undefined,
                expiresAt: typedData.expires_at || undefined,
            }
        },
        60 * 15 // 15 minutes cache
    )
}

// Create a new moderation case
export async function createModerationCase(
    serverId: string,
    userId: string,
    moderatorId: string,
    action: ModerationAction,
    reason: string,
    duration?: string,
    expiresAt?: string
): Promise<string> {
    const supabase = createClient()

    // Generate a UUID for the case ID
    const caseId = uuidv4()

    const { error } = await supabase
        .from('moderation_cases')
        .insert({
            id: caseId,
            server_id: serverId,
            user_id: userId,
            moderator_id: moderatorId,
            action,
            reason,
            duration,
            expires_at: expiresAt,
            status: 'active',
        })

    if (error) {
        console.error('Error creating moderation case:', error)
        throw error
    }

    // Invalidate the cases cache for this server
    await invalidateCache(getCasesCacheKey(serverId))

    return caseId
}

// Update a moderation case
export async function updateModerationCase(
    caseId: string,
    updates: {
        reason?: string
        status?: ModerationStatus
        duration?: string
        expiresAt?: string
    }
): Promise<void> {
    const supabase = createClient()

    // First get the current case to know which server cache to invalidate
    const { data: currentCase, error: fetchError } = await supabase
        .from('moderation_cases')
        .select('server_id')
        .eq('id', caseId)
        .single()

    if (fetchError) {
        console.error('Error fetching case for update:', fetchError)
        throw fetchError
    }

    // Add type assertion for the database response
    const typedCurrentCase = currentCase as {
        server_id: string;
    }

    const { error } = await supabase
        .from('moderation_cases')
        .update({
            reason: updates.reason,
            status: updates.status,
            duration: updates.duration,
            expires_at: updates.expiresAt,
            updated_at: new Date().toISOString(),
        })
        .eq('id', caseId)

    if (error) {
        console.error('Error updating moderation case:', error)
        throw error
    }

    // Invalidate both the specific case cache and the server cases cache
    await invalidateCache(getCaseCacheKey(caseId))
    await invalidateCache(getCasesCacheKey(typedCurrentCase.server_id))
}

// Delete a moderation case
export async function deleteModerationCase(caseId: string): Promise<void> {
    const supabase = createClient()

    // First get the current case to know which server cache to invalidate
    const { data: currentCase, error: fetchError } = await supabase
        .from('moderation_cases')
        .select('server_id')
        .eq('id', caseId)
        .single()

    if (fetchError) {
        console.error('Error fetching case for deletion:', fetchError)
        throw fetchError
    }

    // Add type assertion for the database response
    const typedCurrentCase = currentCase as {
        server_id: string;
    }

    const { error } = await supabase
        .from('moderation_cases')
        .delete()
        .eq('id', caseId)

    if (error) {
        console.error('Error deleting moderation case:', error)
        throw error
    }

    // Invalidate both the specific case cache and the server cases cache
    await invalidateCache(getCaseCacheKey(caseId))
    await invalidateCache(getCasesCacheKey(typedCurrentCase.server_id))
}

// Get auto-moderation settings for a server
export async function getAutoModerationSettings(serverId: string): Promise<AutoModerationSettings> {
    return getCachedData(
        getAutoModCacheKey(serverId),
        async () => {
            const supabase = createClient()

            const { data, error } = await supabase
                .from('auto_moderation_settings')
                .select('*')
                .eq('server_id', serverId)
                .single()

            if (error) {
                if (error.code === 'PGRST116') {
                    // No settings found, return defaults
                    return {
                        profanityFilter: true,
                        profanityLevel: 2,
                        profanityAction: 'delete',
                        spamProtection: true,
                        spamThreshold: 5,
                        spamAction: 'mute',
                        linkFilter: false,
                        linkAction: 'delete',
                        mentionProtection: true,
                        mentionAction: 'warn',
                        capsFilter: false,
                        capsAction: 'warn',
                    }
                }

                console.error('Error fetching auto-moderation settings:', error)
                throw error
            }

            // Add type assertion for the database response
            const typedData = data as {
                profanity_filter: boolean;
                profanity_level: number;
                profanity_action: string;
                spam_protection: boolean;
                spam_threshold: number;
                spam_action: string;
                link_filter: boolean;
                link_action: string;
                mention_protection: boolean;
                mention_action: string;
                caps_filter: boolean;
                caps_action: string;
            }

            return {
                profanityFilter: typedData.profanity_filter,
                profanityLevel: typedData.profanity_level,
                profanityAction: typedData.profanity_action,
                spamProtection: typedData.spam_protection,
                spamThreshold: typedData.spam_threshold,
                spamAction: typedData.spam_action,
                linkFilter: typedData.link_filter,
                linkAction: typedData.link_action,
                mentionProtection: typedData.mention_protection,
                mentionAction: typedData.mention_action,
                capsFilter: typedData.caps_filter,
                capsAction: typedData.caps_action,
            }
        },
        60 * 30 // 30 minutes cache
    )
}

// Update auto-moderation settings
export async function updateAutoModerationSettings(
    serverId: string,
    settings: Partial<AutoModerationSettings>
): Promise<void> {
    const supabase = createClient()

    // Check if settings exist
    const { data, error: checkError } = await supabase
        .from('auto_moderation_settings')
        .select('id')
        .eq('server_id', serverId)
        .single()

    if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking auto-moderation settings:', checkError)
        throw checkError
    }

    // Add type assertion for the database response
    const typedData = data as {
        id: string;
    } | null

    const updates = {
        server_id: serverId,
        profanity_filter: settings.profanityFilter,
        profanity_level: settings.profanityLevel,
        profanity_action: settings.profanityAction,
        spam_protection: settings.spamProtection,
        spam_threshold: settings.spamThreshold,
        spam_action: settings.spamAction,
        link_filter: settings.linkFilter,
        link_action: settings.linkAction,
        mention_protection: settings.mentionProtection,
        mention_action: settings.mentionAction,
        caps_filter: settings.capsFilter,
        caps_action: settings.capsAction,
        updated_at: new Date().toISOString(),
    }

    if (!typedData) {
        // Insert new settings
        const { error } = await supabase
            .from('auto_moderation_settings')
            .insert({
                ...updates,
                id: uuidv4(),
            })

        if (error) {
            console.error('Error creating auto-moderation settings:', error)
            throw error
        }
    } else {
        // Update existing settings
        const { error } = await supabase
            .from('auto_moderation_settings')
            .update(updates)
            .eq('id', typedData.id)

        if (error) {
            console.error('Error updating auto-moderation settings:', error)
            throw error
        }
    }

    // Invalidate the auto-mod settings cache
    await invalidateCache(getAutoModCacheKey(serverId))
}

// Get custom flags for a server
export async function getCustomFlags(serverId: string): Promise<CustomFlag[]> {
    return getCachedData(
        getFlagsCacheKey(serverId),
        async () => {
            const supabase = createClient()

            const { data, error } = await supabase
                .from('custom_flags')
                .select('*')
                .eq('server_id', serverId)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching custom flags:', error)
                throw error
            }

            // Add type assertion for the database response
            const typedData = data as Array<{
                id: string;
                name: string;
                pattern: string;
                type: 'keyword' | 'regex';
                severity: 'low' | 'medium' | 'high';
                enabled: boolean;
            }>

            return typedData.map(flag => ({
                id: flag.id,
                name: flag.name,
                pattern: flag.pattern,
                type: flag.type,
                severity: flag.severity,
                enabled: flag.enabled,
            }))
        },
        60 * 15 // 15 minutes cache
    )
}

// Create a custom flag
export async function createCustomFlag(
    serverId: string,
    flag: Omit<CustomFlag, 'id'>
): Promise<string> {
    const supabase = createClient()

    const flagId = uuidv4()

    const { error } = await supabase
        .from('custom_flags')
        .insert({
            id: flagId,
            server_id: serverId,
            name: flag.name,
            pattern: flag.pattern,
            type: flag.type,
            severity: flag.severity,
            enabled: flag.enabled,
        })

    if (error) {
        console.error('Error creating custom flag:', error)
        throw error
    }

    // Invalidate the flags cache
    await invalidateCache(getFlagsCacheKey(serverId))

    return flagId
}

// Update a custom flag
export async function updateCustomFlag(
    flagId: string,
    updates: Partial<Omit<CustomFlag, 'id'>>
): Promise<void> {
    const supabase = createClient()

    // First get the current flag to know which server cache to invalidate
    const { data: currentFlag, error: fetchError } = await supabase
        .from('custom_flags')
        .select('server_id')
        .eq('id', flagId)
        .single()

    if (fetchError) {
        console.error('Error fetching flag for update:', fetchError)
        throw fetchError
    }

    // Add type assertion for the database response
    const typedCurrentFlag = currentFlag as {
        server_id: string;
    }

    const { error } = await supabase
        .from('custom_flags')
        .update({
            name: updates.name,
            pattern: updates.pattern,
            type: updates.type,
            severity: updates.severity,
            enabled: updates.enabled,
            updated_at: new Date().toISOString(),
        })
        .eq('id', flagId)

    if (error) {
        console.error('Error updating custom flag:', error)
        throw error
    }

    // Invalidate the flags cache
    await invalidateCache(getFlagsCacheKey(typedCurrentFlag.server_id))
}

// Delete a custom flag
export async function deleteCustomFlag(flagId: string): Promise<void> {
    const supabase = createClient()

    // First get the current flag to know which server cache to invalidate
    const { data: currentFlag, error: fetchError } = await supabase
        .from('custom_flags')
        .select('server_id')
        .eq('id', flagId)
        .single()

    if (fetchError) {
        console.error('Error fetching flag for deletion:', fetchError)
        throw fetchError
    }

    // Add type assertion for the database response
    const typedCurrentFlag = currentFlag as {
        server_id: string;
    }

    const { error } = await supabase
        .from('custom_flags')
        .delete()
        .eq('id', flagId)

    if (error) {
        console.error('Error deleting custom flag:', error)
        throw error
    }

    // Invalidate the flags cache
    await invalidateCache(getFlagsCacheKey(typedCurrentFlag.server_id))
}

// Get command settings for a server
export async function getCommandSettings(serverId: string): Promise<CommandSetting[]> {
    return getCachedData(
        getCommandsCacheKey(serverId),
        async () => {
            const supabase = createClient()

            const { data, error } = await supabase
                .from('command_settings')
                .select('*')
                .eq('server_id', serverId)

            if (error) {
                console.error('Error fetching command settings:', error)
                throw error
            }

            // Add type assertion for the database response
            const typedData = data as Array<{
                id: string;
                command_name: string;
                permission: 'everyone' | 'moderator' | 'admin';
                enabled: boolean;
                cooldown: number;
            }>

            // Map to our command settings format with hardcoded descriptions, usage, and examples
            // In a real app, these would likely come from a separate table or config
            const commandDescriptions: Record<string, { description: string, usage: string, example: string }> = {
                warn: {
                    description: "Warn a user for breaking server rules",
                    usage: "warn <user> <reason>",
                    example: "warn @User Spamming in #general",
                },
                mute: {
                    description: "Temporarily mute a user",
                    usage: "mute <user> <duration> <reason>",
                    example: "mute @User 1h Excessive caps",
                },
                kick: {
                    description: "Kick a user from the server",
                    usage: "kick <user> <reason>",
                    example: "kick @User Advertising",
                },
                ban: {
                    description: "Ban a user from the server",
                    usage: "ban <user> <reason>",
                    example: "ban @User NSFW content",
                },
                purge: {
                    description: "Delete multiple messages at once",
                    usage: "purge <amount>",
                    example: "purge 10",
                },
            }

            return typedData.map(cmd => ({
                id: cmd.id,
                name: cmd.command_name,
                description: commandDescriptions[cmd.command_name]?.description || "No description available",
                usage: commandDescriptions[cmd.command_name]?.usage || `${cmd.command_name} <args>`,
                example: commandDescriptions[cmd.command_name]?.example || `${cmd.command_name} ...`,
                permission: cmd.permission,
                enabled: cmd.enabled,
                cooldown: cmd.cooldown,
            }))
        },
        60 * 30 // 30 minutes cache
    )
}

// Update command settings
export async function updateCommandSettings(
    serverId: string,
    commandId: string,
    updates: {
        enabled?: boolean
        permission?: 'everyone' | 'moderator' | 'admin'
        cooldown?: number
    }
): Promise<void> {
    const supabase = createClient()

    const { error } = await supabase
        .from('command_settings')
        .update({
            enabled: updates.enabled,
            permission: updates.permission,
            cooldown: updates.cooldown,
            updated_at: new Date().toISOString(),
        })
        .eq('id', commandId)

    if (error) {
        console.error('Error updating command settings:', error)
        throw error
    }

    // Invalidate the commands cache
    await invalidateCache(getCommandsCacheKey(serverId))
}

// Get server settings (prefix)
export async function getServerSettings(serverId: string): Promise<{ prefix: string }> {
    return getCachedData(
        `server:settings:${serverId}`,
        async () => {
            const supabase = createClient()

            const { data, error } = await supabase
                .from('server_settings')
                .select('prefix')
                .eq('server_id', serverId)
                .single()

            if (error) {
                if (error.code === 'PGRST116') {
                    // No settings found, return default
                    return { prefix: '!' }
                }

                console.error('Error fetching server settings:', error)
                throw error
            }

            // Add type assertion for the database response
            const typedData = data as {
                prefix: string;
            }

            return { prefix: typedData.prefix }
        },
        60 * 60 // 1 hour cache
    )
}

// Update server settings
export async function updateServerSettings(
    serverId: string,
    settings: { prefix: string }
): Promise<void> {
    const supabase = createClient()

    // Check if settings exist
    const { data, error: checkError } = await supabase
        .from('server_settings')
        .select('id')
        .eq('server_id', serverId)
        .single()

    if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking server settings:', checkError)
        throw checkError
    }

    // Add type assertion for the database response
    const typedData = data as {
        id: string;
    } | null

    if (!typedData) {
        // Insert new settings
        const { error } = await supabase
            .from('server_settings')
            .insert({
                id: uuidv4(),
                server_id: serverId,
                prefix: settings.prefix,
            })

        if (error) {
            console.error('Error creating server settings:', error)
            throw error
        }
    } else {
        // Update existing settings
        const { error } = await supabase
            .from('server_settings')
            .update({
                prefix: settings.prefix,
                updated_at: new Date().toISOString(),
            })
            .eq('id', typedData.id)

        if (error) {
            console.error('Error updating server settings:', error)
            throw error
        }
    }

    // Invalidate the server settings cache
    await invalidateCache(`server:settings:${serverId}`)
}
