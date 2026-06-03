import redis from '@config/redis'

export interface CacheOptions {
  ttl?: number
  key?: string
}

/**
 * Redis cache utility for distributed caching
 */
class RedisCache {
  private defaultTTL = 300

  /**
   * Get cached value
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key)
      if (!data) return null
      return JSON.parse(data) as T
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error)
      return null
    }
  }

  /**
   * Set cache value
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const expiration = ttl || this.defaultTTL
      await redis.setex(key, expiration, JSON.stringify(value))
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error)
    }
  }

  /**
   * Delete cache key
   */
  async delete(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error)
    }
  }

  /**
   * Delete multiple cache keys
   */
  async deleteMany(keys: string[]): Promise<void> {
    try {
      if (keys.length === 0) return
      await redis.del(...keys)
    } catch (error) {
      console.error(`Cache deleteMany error:`, error)
    }
  }

  /**
   * Clear all cache
   */
  async flush(): Promise<void> {
    try {
      await redis.flushdb()
    } catch (error) {
      console.error('Cache flush error:', error)
    }
  }

  /**
   * Cache middleware for GET endpoints
   * @param keyPrefix - Prefix for cache key (e.g., 'bootcamps')
   * @param ttl - Time to live in seconds
   */
  middleware(keyPrefix: string, ttl?: number) {
    return async (req: any, res: any, next: any) => {
      if (req.method !== 'GET') {
        return next()
      }

      const cacheKey = `${keyPrefix}:${JSON.stringify({ query: req.query, params: req.params })}`

      try {
        const cachedData = await this.get(cacheKey)
        if (cachedData) {
          return res.status(200).json(cachedData)
        }
      } catch (error) {
        console.error('Cache middleware error:', error)
      }

      const originalJson = res.json.bind(res)
      res.json = (data: any) => {
        if (res.statusCode === 200 && data.success !== false) {
          this.set(cacheKey, data, ttl).catch((err) => {
            console.error('Failed to cache response:', err)
          })
        }
        return originalJson(data)
      }

      next()
    }
  }
}

export default new RedisCache()
