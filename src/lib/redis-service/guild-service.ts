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
import axios from "axios"

const PERMISSION_ADMIN = 0x8
const PERMISSION_MANAGE_SERVER = 0x20
const PERMISSION_MANAGE_CHANNELS = 0x10
const PERMISSION_MANAGE_ROLES = 0x10000000

const BASE_URL = process.env.NODE_ENV === "production" ? "https://gobotdashboard.vercel.app" : "http://localhost:3000"

/**
 * Fetch user's Discord guilds with caching
 */
export async function fetchUserGuilds(userId: string, supabase_user_id: string, forceRefresh = false, src: string): Promise<DiscordPartialGuild[]> {
    console.log("[GUILD-SERVICE]: ", src, userId, supabase_user_id)
    let retries: number = 0
    // Try to get from cache first (unless force refresh is requested)
    if (!forceRefresh) {
        const cachedGuilds = await getCachedUserGuilds(userId)
        if (cachedGuilds) {
            return cachedGuilds
        }
    }

    try {
        // Get Discord bearer token
        const { data: userData, error: bearerTokenError } = await supabase
            .from("users")
            .select("discord_token")
            .eq("discord_id", userId)
            .eq("supabase_user_id", supabase_user_id)
            .single()

        if (bearerTokenError) {
            console.error(bearerTokenError)
            throw new Error("[GUILD-SERVICE]: Could not retrieve Discord token", { cause: bearerTokenError.message })
        }

        if (!userData) {
            throw new Error("No discord token found")
        }

        // Fetch guilds from Discord API
        const response = await fetch("https://discord.com/api/v10/users/@me/guilds", {
            headers: {
                Authorization: `Bearer ${userData.discord_token}`,
            },
        })

        if (response.status === 401) {
            console.log("[GUILD-SERVICE]: 401 Unauthorized, refreshing token...")
            retries++
            if (retries > 3) {
                throw new Error("[GUILD-SERVICE]: Could not refresh Discord token", { cause: response.statusText })
            }

            console.log("Refreshing token...")
            const refreshToken = await axios.post(
                `${BASE_URL}/api/refresh-token`,
                {
                    userId,
                    supabase_user_id,
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            )

            if (refreshToken.status !== 200) {
                throw new Error("Could not refresh Discord token", { cause: refreshToken.statusText })
            }

            const refreshTokenData = refreshToken.data
            const newBearerToken = refreshTokenData.access_token

            const { error: updateError } = await supabase.from("users").update({
                discord_access_token: newBearerToken,
                discord_refresh_token: refreshTokenData.refresh_token,
            })
                .eq("supabase_user_id", supabase_user_id)
                .eq("discord_id", userId)

            if (updateError) {
                throw new Error("Could not update Discord token", { cause: updateError.message })
            }

            console.log("Token refreshed successfully")
            return []
        }

        if (!response.ok) {
            console.error(bearerTokenError)
            throw new Error(`Discord API error: ${response.status}`, { cause: response.statusText + bearerTokenError })
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
export async function getFormattedServerList(userId: string, supabase_user_id: string, forceRefresh = false): Promise<Server[]> {
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
