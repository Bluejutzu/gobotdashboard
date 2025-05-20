import supabase from "@/lib/supabase/client"
import {
    getCachedUserGuilds,
    cacheUserGuilds,
    getCachedBotGuilds,
    cacheBotGuilds,
    invalidateUserGuildsCache,
    invalidateBotGuildsCache,
} from "@/lib/cache-utils"
import type { DiscordPartialGuild, Server } from "../types/types"
import { refreshDiscordToken } from "../utils"

const PERMISSION_ADMIN = 0x8
const PERMISSION_MANAGE_SERVER = 0x20
const PERMISSION_MANAGE_CHANNELS = 0x10
const PERMISSION_MANAGE_ROLES = 0x10000000

/**
 * Retrieves a user's Discord guilds from cache or the Discord API, filtering to those where the user has management permissions.
 *
 * Attempts to return cached guilds unless a refresh is forced. If the Discord token is expired, automatically refreshes the token and retries up to three times. Only guilds where the user has admin, manage server, manage channels, or manage roles permissions are included.
 *
 * @param userId - The Discord user ID.
 * @param supabase_user_id - The corresponding Supabase user ID.
 * @param forceRefresh - If true, bypasses cache and fetches fresh data.
 * @param src - Context string for logging.
 * @returns An array of guilds where the user has management permissions.
 *
 * @throws {Error} If required user identifiers are missing, the Discord token cannot be retrieved, or the Discord API returns an error.
 * @throws {Error} If the Discord token cannot be refreshed after three attempts.
 */
export async function fetchUserGuilds(userId: string, supabase_user_id: string, forceRefresh = false, src: string): Promise<DiscordPartialGuild[]> {
    console.log(`[GUILD-SERVICE ${src}]: Fetching guilds for ${userId}, ${supabase_user_id}`)
    let retries: number = 0

    // Try to get from cache first (unless force refresh is requested)
    if (!forceRefresh) {
        const cachedGuilds = await getCachedUserGuilds(userId)
        if (cachedGuilds && cachedGuilds.length > 0) {
            console.log(`[GUILD-SERVICE ${src}]: Returning ${cachedGuilds.length} cached guilds`)
            return cachedGuilds
        }
    }

    try {
        // Validate inputs
        if (!userId || !supabase_user_id) {
            throw new Error("[GUILD-SERVICE]: Missing required userId or supabase_user_id")
        }

        // Get Discord bearer token - improved query with better error handling
        console.log(`[GUILD-SERVICE ${src}]: Querying for discord_token with discord_id=${userId} and supabase_user_id=${supabase_user_id}`)

        const { data: userData, error: bearerTokenError } = await supabase
            .from("users")
            .select("discord_token")
            .eq("discord_id", userId)
            .eq("supabase_user_id", supabase_user_id)
            .single()

        if (bearerTokenError) {
            console.error("[GUILD-SERVICE]: Error retrieving Discord token:", bearerTokenError)
            throw new Error("[GUILD-SERVICE]: Could not retrieve Discord token: " + bearerTokenError.message)
        }

        if (!userData || !userData.discord_token) {
            console.error("[GUILD-SERVICE]: No discord token found for user:", { userId, supabase_user_id })
            throw new Error("[GUILD-SERVICE]: No discord token found")
        }

        console.log(`[GUILD-SERVICE ${src}]: Successfully retrieved token, fetching guilds from Discord API`)

        // Fetch guilds from Discord API
        const response = await fetch("https://discord.com/api/v10/users/@me/guilds", {
            headers: {
                Authorization: `Bearer ${userData.discord_token}`,
            },
        })

        if (response.status === 401) {
            console.log(`[GUILD-SERVICE ${src}]: 401 Unauthorized, refreshing token...`)
            retries++
            if (retries > 3) {
                throw new Error("[GUILD-SERVICE]: Could not refresh Discord token", { cause: response.statusText })
            }

            await refreshDiscordToken(userId, supabase_user_id, supabase)
            return fetchUserGuilds(userId, supabase_user_id, forceRefresh, src)
        }

        if (!response.ok) {
            console.error(`[GUILD-SERVICE ${src}]: Discord API error:`, response.status, response.statusText)
            throw new Error(`Discord API error: ${response.status}`, { cause: response.statusText })
        }

        const rawDiscordGuilds: DiscordPartialGuild[] = await response.json()
        console.log(`[GUILD-SERVICE ${src}]: Received ${rawDiscordGuilds.length} guilds from Discord API`)

        const discordGuilds = rawDiscordGuilds.filter((guild) => {
            const permInt = Number.parseInt(`${guild.permissions}`, 10)
            return (permInt & PERMISSION_ADMIN) !== 0 ||
                (permInt & PERMISSION_MANAGE_SERVER) !== 0 ||
                (permInt & PERMISSION_MANAGE_CHANNELS) !== 0 ||
                (permInt & PERMISSION_MANAGE_ROLES) !== 0
        })

        console.log(`[GUILD-SERVICE ${src}]: Filtered to ${discordGuilds.length} guilds with management permissions`)

        await cacheUserGuilds(userId, discordGuilds)
        return discordGuilds
    } catch (error) {
        console.error(`[GUILD-SERVICE ${src}]: Error fetching user guilds:`, error)
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
 * Returns a list of Discord servers the user can manage, including bot presence and server details.
 *
 * Filters the user's guilds to those where they have administrator or manage server permissions, and combines this with information about whether the bot is present in each guild. Each server entry includes metadata such as icon URL, permissions, member counts, features, and stickers.
 *
 * @param userId - The Discord user ID.
 * @param supabase_user_id - The corresponding Supabase user ID.
 * @param forceRefresh - If true, bypasses cache and fetches fresh data.
 * @param src - Optional context string for logging.
 * @returns An array of {@link Server} objects representing the user's manageable Discord servers, annotated with bot presence and additional metadata.
 *
 * @throws {Error} If fetching user guilds or bot guilds fails.
 */
export async function getFormattedServerList(userId: string, supabase_user_id: string, forceRefresh = false, src?: string): Promise<Server[]> {
    console.log("[GUILD-SERVICE]: ", src, userId, supabase_user_id)
    try {
        // Fetch user guilds and bot guilds in parallel
        const [discordGuilds, botGuildIds] = await Promise.all([
            fetchUserGuilds(userId, supabase_user_id, forceRefresh, "getFormattedServerList"),
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
                    id: guild.id,
                    name: guild.name,
                    icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
                    permissions: Number.parseInt(`${guild.permissions}`, 10),
                    botPresent: botServerIds.has(guild.id),
                    approximate_member_count: guild.approximate_member_count || 0,
                    approximate_presence_count: guild.approximate_presence_count || 0,
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
