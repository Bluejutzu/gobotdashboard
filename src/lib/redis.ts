import { Redis } from '@upstash/redis'

// Create a Redis client
const redis = Redis.fromEnv()

// Cache TTL in seconds
const DEFAULT_CACHE_TTL = 60 * 5 // 5 minutes

/**
 * Get data from cache or fetch it and store in cache
 */
export async function getCachedData<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = DEFAULT_CACHE_TTL
): Promise<T> {
    try {
        // Try to get data from cache
        const cachedData = await redis.get<T>(key)

        if (cachedData) {
            console.log(`Cache hit for key: ${key}`)
            return cachedData
        }

        // If not in cache, fetch data
        console.log(`Cache miss for key: ${key}, fetching data...`)
        const data = await fetchFn()

        // Store in cache
        await redis.set(key, data, { ex: ttl })

        return data
    } catch (error) {
        console.error(`Error with Redis cache for key ${key}:`, error)
        // Fallback to direct fetch if cache fails
        return fetchFn()
    }
}

/**
 * Invalidate a cache key
 */
export async function invalidateCache(key: string): Promise<void> {
    try {
        await redis.del(key)
        console.log(`Cache invalidated for key: ${key}`)
    } catch (error) {
        console.error(`Error invalidating cache for key ${key}:`, error)
    }
}

/**
 * Invalidate multiple cache keys with a pattern
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
    try {
        const keys = await redis.keys(pattern)
        if (keys.length > 0) {
            await redis.del(...keys)
            console.log(`Invalidated ${keys.length} keys matching pattern: ${pattern}`)
        }
    } catch (error) {
        console.error(`Error invalidating cache pattern ${pattern}:`, error)
    }
}
