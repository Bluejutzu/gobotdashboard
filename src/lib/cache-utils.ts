import { redis, CACHE_TTL, CACHE_KEYS } from "./redis";

// Types
import type { DiscordPartialGuild, ModerationCase } from "./types/types";

/**
 * Cache user's Discord guilds
 */
export async function cacheUserGuilds(userId: string, guilds: DiscordPartialGuild[]): Promise<void> {
    const key = `${CACHE_KEYS.USER_GUILDS}${userId}`;
    await redis.set(key, JSON.stringify(guilds), { ex: CACHE_TTL.USER_GUILDS });
    console.log(`Cached ${guilds.length} guilds for user ${userId}`);
}

/**
 * Retrieves a user's cached Discord guilds from Redis.
 *
 * Attempts to parse and return the cached guilds array for the specified user. If the cache is missing, corrupted, or in an unexpected format, logs the issue, invalidates the cache entry, and returns null.
 *
 * @param userId - The Discord user ID whose guilds are being retrieved.
 * @returns An array of {@link DiscordPartialGuild} objects if available and valid; otherwise, null.
 */
export async function getCachedUserGuilds(userId: string): Promise<DiscordPartialGuild[] | null> {
    const key = `${CACHE_KEYS.USER_GUILDS}${userId}`;
    // Retrieve data from Redis. It might be a string or a pre-parsed object/array.
    const cachedData: unknown = await redis.get(key); // Use 'unknown' or 'any' to handle potential auto-parsing

    if (!cachedData) {
        console.log(`No cached guilds found for user ${userId}`);
        return null;
    }

    try {
        let guilds: DiscordPartialGuild[];

        if (typeof cachedData === "string") {
            // If cachedData is a string, parse it
            guilds = JSON.parse(cachedData) as DiscordPartialGuild[];
        } else if (Array.isArray(cachedData)) {
            // If cachedData is already an array (likely auto-parsed by Redis client),
            // ensure it matches the expected structure (optional, but good for robustness)
            // For now, we cast it directly.
            guilds = cachedData as DiscordPartialGuild[];
        } else {
            // Data is in an unexpected format (e.g. an object but not an array, or other primitive)
            console.error(
                `Error parsing cached guild data: cachedData for user ${userId} is neither a string nor an array. Type: ${typeof cachedData}`,
                cachedData
            );
            // It's good practice to remove the corrupted/unexpected cache entry
            await redis.del(key);
            console.warn(`Invalidated corrupted cache for key: ${key}`);
            return null;
        }

        // console.log(`Retrieved ${guilds.length} guilds from cache for user ${userId}`);
        return guilds;
    } catch (error) {
        console.error(`Error processing cached guild data for user ${userId}:`, error);
        // If parsing a string failed, log the problematic string
        if (typeof cachedData === "string") {
            console.error("Problematic string data:", cachedData.substring(0, 100)); // Log a snippet
        }
        // Remove the cache entry if it caused a parsing error
        await redis.del(key);
        console.warn(`Invalidated corrupted cache (due to parse error) for key: ${key}`);
        return null;
    }
}

/**
 * Cache bot's guilds (servers where the bot is installed)
 */
export async function cacheBotGuilds(guildIds: string[]): Promise<void> {
    await redis.set(CACHE_KEYS.BOT_GUILDS, JSON.stringify(guildIds), {
        ex: CACHE_TTL.BOT_GUILDS
    });
    console.log(`Cached ${guildIds.length} bot guild IDs`);
}

/**
 * Retrieves the cached list of bot guild IDs from Redis.
 *
 * Returns an array of guild ID strings if valid cached data exists, or null if the cache is missing or corrupted.
 *
 * @returns An array of bot guild ID strings, or null if unavailable or invalid.
 */
export async function getCachedBotGuilds(): Promise<string[] | null> {
    const key = CACHE_KEYS.BOT_GUILDS;
    const cachedData: unknown = await redis.get(key);

    if (!cachedData) {
        return null;
    }

    try {
        let guildIds: string[];
        if (typeof cachedData === "string") {
            guildIds = JSON.parse(cachedData) as string[];
        } else if (Array.isArray(cachedData) && cachedData.every(item => typeof item === "string")) {
            // If it's already an array of strings
            guildIds = cachedData as string[];
        } else {
            console.error(
                "Error parsing cached bot guild data: cachedData is not a string or an array of strings.",
                cachedData
            );
            await redis.del(key);
            console.warn(`Invalidated corrupted cache for key: ${key}`);
            return null;
        }
        // console.log("Retrieved bot guilds from cache:", guildIds);
        return guildIds;
    } catch (error) {
        console.error("Error parsing cached bot guild data:", error);
        if (typeof cachedData === "string") {
            console.error("Problematic string data for bot guilds:", cachedData.substring(0, 100));
        }
        await redis.del(key);
        console.warn(`Invalidated corrupted cache (due to parse error) for key: ${key}`);
        return null;
    }
}

/**
 * Cache a specific guild's data
 */
export async function cacheGuild(guildId: string, guildData: any): Promise<void> {
    const key = `${CACHE_KEYS.GUILD}${guildId}`;
    await redis.set(key, JSON.stringify(guildData), { ex: CACHE_TTL.GUILD });
}

/**
 * Get a specific guild's data from cache
 */
export async function getCachedGuild(guildId: string): Promise<any | null> {
    const key = `${CACHE_KEYS.GUILD}${guildId}`;
    const cachedData: unknown = await redis.get(key);

    if (!cachedData) {
        return null;
    }

    try {
        if (typeof cachedData === "string") {
            return JSON.parse(cachedData);
        } else if (typeof cachedData === "object" && cachedData !== null) {
            // If it's already an object (auto-parsed)
            return cachedData;
        } else {
            console.error(
                `Error parsing cached data for guild ${guildId}: cachedData is not a string or object.`,
                cachedData
            );
            await redis.del(key);
            console.warn(`Invalidated corrupted cache for key: ${key}`);
            return null;
        }
    } catch (error) {
        console.error(`Error parsing cached data for guild ${guildId}:`, error);
        if (typeof cachedData === "string") {
            console.error(`Problematic string data for guild ${guildId}:`, cachedData.substring(0, 100));
        }
        await redis.del(key);
        console.warn(`Invalidated corrupted cache (due to parse error) for key: ${key}`);
        return null;
    }
}

/**
 * Invalidate user guilds cache
 */
export async function invalidateUserGuildsCache(userId: string): Promise<void> {
    const key = `${CACHE_KEYS.USER_GUILDS}${userId}`;
    await redis.del(key);
    console.log(`Invalidated guilds cache for user ${userId}`);
}

/**
 * Invalidate bot guilds cache
 */
export async function invalidateBotGuildsCache(): Promise<void> {
    await redis.del(CACHE_KEYS.BOT_GUILDS);
    console.log("Invalidated bot guilds cache");
}

/**
 * Invalidate specific guild cache
 */
export async function invalidateGuildCache(guildId: string): Promise<void> {
    const key = `${CACHE_KEYS.GUILD}${guildId}`;
    await redis.del(key);
    console.log(`Invalidated cache for guild ${guildId}`);
}

/**
 * Cache moderation cases for a specific guild
 */
export async function cacheModerationCases(guildId: string, cases: ModerationCase[]): Promise<void> {
    const key = `${CACHE_KEYS.MODERATION_CASES}${guildId}`;
    await redis.set(key, JSON.stringify(cases), {
        ex: CACHE_TTL.MODERATION_CASES
    });
    console.log(`Cached ${cases.length} moderation cases for guild ${guildId}`);
}

/**
 * Get cached moderation cases for a specific guild
 */
export async function getCachedModerationCases(guildId: string): Promise<ModerationCase[] | null> {
    const key = `${CACHE_KEYS.MODERATION_CASES}${guildId}`;
    const cachedData: unknown = await redis.get(key);

    if (!cachedData) return null;

    try {
        if (typeof cachedData === "string") {
            return JSON.parse(cachedData) as ModerationCase[];
        } else if (Array.isArray(cachedData)) {
            return cachedData as ModerationCase[];
        } else {
            console.error(`Unexpected cache format for guild ${guildId}:`, cachedData);
            await redis.del(key);
            return null;
        }
    } catch (error) {
        console.error(`Error parsing moderation cases for guild ${guildId}:`, error);
        if (typeof cachedData === "string") {
            console.error("Problematic data snippet:", cachedData.substring(0, 100));
        }
        await redis.del(key);
        return null;
    }
}

/**
 * Invalidate moderation cases cache for a guild
 */
export async function invalidateModerationCasesCache(guildId: string): Promise<void> {
    const key = `${CACHE_KEYS.MODERATION_CASES}${guildId}`;
    await redis.del(key);
    console.log(`Invalidated moderation case cache for guild ${guildId}`);
}
