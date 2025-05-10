import { redis, CACHE_TTL, cacheKeys } from './redis'
import { v4 as uuidv4 } from 'uuid'

// Type for cache options
interface CacheOptions {
    ttl?: number
    forceRefresh?: boolean
}

/**
 * Generic cached fetch function
 * @param key Cache key
 * @param fetchFn Function to fetch data if not in cache
 * @param options Cache options
 */
export async function cachedFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions = {}
): Promise<T> {
    const { ttl = CACHE_TTL.GUILD, forceRefresh = false } = options

    // If force refresh, skip cache check
    if (!forceRefresh) {
        // Try to get from cache first
        const cached = await redis.get<T>(key)
        if (cached) {
            console.log(`Cache hit for ${key}`)
            return cached
        }
    }

    // Cache miss or force refresh, fetch fresh data
    console.log(`Cache miss for ${key}, fetching fresh data`)
    const data = await fetchFn()

    // Store in cache
    await redis.set(key, data, { ex: ttl })

    return data
}

/**
 * Invalidate a cache entry
 * @param key Cache key to invalidate
 */
export async function invalidateCache(key: string): Promise<void> {
    await redis.del(key)
    console.log(`Cache invalidated for ${key}`)
}

/**
 * Generate a new UUID for case IDs
 */
export function generateCaseId(): string {
    return uuidv4()
}
