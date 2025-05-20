import { Redis } from "@upstash/redis"

export const redis = Redis.fromEnv();

export const CACHE_TTL = {
  GUILDS: 60 * 30, // 30 minutes
  GUILD: 60 * 60, // 1 hour
  USER_GUILDS: 60 * 15, // 15 minutes
  BOT_GUILDS: 60 * 10, // 10 minutes
  MODERATION_CASES: 60 * 5, // 5 minutes
  AUTO_MODERATION_SETTINGS: 60 * 5, // 5 minutes
}

export const CACHE_KEYS = {
  USER_GUILDS: "user:guilds:",
  GUILD: "guild:",
  BOT_GUILDS: "bot:guilds",
  MODERATION_CASES: "moderation:cases:",
  AUTO_MODERATION_SETTINGS: "autoModSettings:"
}

/**
 * Retrieves a cached value from Redis by key.
 *
 * @param key - The cache key to look up.
 * @returns The cached value if found, or null if the key does not exist.
 */
export async function getCache<T>(key: string): Promise<T | null> {
  return await redis.get(key);
}

export async function setCache<T>(key: string, value: T, ttl: number): Promise<void> {
  await redis.set(key, value, { ex: ttl });
}

export async function invalidateCache(key: string): Promise<void> {
  await redis.del(key);
}