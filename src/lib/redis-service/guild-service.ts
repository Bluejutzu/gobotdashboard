import supabase from "@/lib/supabase/client"
import { getBearerToken } from "@/lib/utils"
import {
    getCachedUserGuilds,
    cacheUserGuilds,
    getCachedBotGuilds,
    cacheBotGuilds,
    invalidateUserGuildsCache,
    invalidateBotGuildsCache,
} from "@/lib/cache-utils"
import type { DiscordPartialGuild, Server } from "@/lib/types"



const PERMISSION_ADMIN = 0x8
const PERMISSION_MANAGE_SERVER = 0x20
const PERMISSION_MANAGE_CHANNELS = 0x10
const PERMISSION_MANAGE_ROLES = 0x10000000

/**
 * Fetch user's Discord guilds with caching
 */
export async function fetchUserGuilds(userId: string, superbase_user_id: string, forceRefresh = false): Promise<DiscordPartialGuild[]> {
    // Try to get from cache first (unless force refresh is requested)
    if (!forceRefresh) {
        const cachedGuilds = await getCachedUserGuilds(userId)
        if (cachedGuilds) {
            return cachedGuilds
        }
    }

    // If not in cache or force refresh, fetch from Discord API
    try {
        // Get Discord bearer token
        const bearerToken = await getBearerToken(userId, superbase_user_id)
        if (!bearerToken) {
            throw new Error("Could not retrieve Discord token")
        }

        // Fetch guilds from Discord API
        const response = await fetch("https://discord.com/api/v10/users/@me/guilds", {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Discord API error: ${response.status}`)
        }

        const rawDiscordGuilds: DiscordPartialGuild[] = await response.json()
        const discordGuilds = rawDiscordGuilds.filter((guild) => {
            const permInt = Number.parseInt(`${guild.permissions}`, 10)
            return (permInt & PERMISSION_ADMIN) !== 0 ||
                (permInt & PERMISSION_MANAGE_SERVER) !== 0 ||
                (permInt & PERMISSION_MANAGE_CHANNELS) !== 0 ||
                (permInt & PERMISSION_MANAGE_ROLES) !== 0
        })

        await cacheUserGuilds(userId, discordGuilds)

        return discordGuilds
    } catch (error) {
        console.error("Error fetching user guilds:", error)
        throw error
    }
}

/**
 * Fetch bot's guilds with caching
 */
export async function fetchBotGuilds(forceRefresh = false): Promise<string[]> {
    // Try to get from cache first (unless force refresh is requested)
    if (!forceRefresh) {
        const cachedGuildIds = await getCachedBotGuilds()
        if (cachedGuildIds) {
            return cachedGuildIds
        }
    }

    // If not in cache or force refresh, fetch from database
    try {
        const { data: botServers, error } = await supabase.from("servers").select("discord_id")

        if (error) {
            throw error
        }

        const guildIds = botServers?.map((s) => s.discord_id) || []

        // Cache the results
        await cacheBotGuilds(guildIds)

        return guildIds
    } catch (error) {
        console.error("Error fetching bot guilds:", error)
        throw error
    }
}

/**
 * Get formatted server list with bot presence information
 * @returns discordGuilds Array of Server[]
 */
export async function getFormattedServerList(userId: string, superbase_user_id: string, forceRefresh = false): Promise<Server[]> {
    try {
        // Fetch user guilds and bot guilds in parallel
        const [discordGuilds, botGuildIds] = await Promise.all([
            fetchUserGuilds(userId, superbase_user_id, forceRefresh),
            fetchBotGuilds(forceRefresh),
        ])

        const botServerIds = new Set(botGuildIds)

        return (
            discordGuilds
                .filter((guild) => {
                    const permInt = Number.parseInt(`${guild.permissions}`, 10)
                    return (permInt & 0x8) !== 0 || (permInt & 0x20) !== 0
                })

                .map((guild) => ({
                    discord_id: guild.discord_id,
                    name: guild.name,
                    icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.discord_id}/${guild.icon}.png` : null,
                    permissions: Number.parseInt(`${guild.permissions}`, 10),
                    botPresent: botServerIds.has(guild.discord_id),
                    approximate_member_count: guild.approximate_member_count || 0, // fallback if not always available
                    approximate_presence_count: guild.approximate_presence_count || 0, // fallback if not always available
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    features: guild.features,
                    stickers: guild.stickers,
                }))
        )
    } catch (error) {
        console.error("Error getting formatted server list:", error)
        throw error
    }
}

/**
 * Invalidate all guild-related caches for a user
 */
export async function invalidateGuildCaches(userId: string): Promise<void> {
    await Promise.all([invalidateUserGuildsCache(userId), invalidateBotGuildsCache()])
}
