import { Redis } from "@upstash/redis"

export const redis = Redis.fromEnv();

export const CACHE_TTL = {
    GUILDS: 60 * 30, // 30 minutes
    GUILD: 60 * 60, // 1 hour
    USER_GUILDS: 60 * 15, // 15 minutes
    BOT_GUILDS: 60 * 10, // 10 minutes
}

export const CACHE_KEYS = {
    USER_GUILDS: "user:guilds:",
    GUILD: "guild:",
    BOT_GUILDS: "bot:guilds",
}
