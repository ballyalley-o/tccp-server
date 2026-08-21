/**
 * Simple in-memory cache for frequently accessed data
 * Reduces database queries significantly
 */
class MemoryCache {
  private store: Map<string, { value: any; expiresAt: number }> = new Map()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes default TTL

  /**
   * Get value from cache
   * @param key - Cache key
   * @returns Cached value or null if expired/not found
   */
  get(key: string): any | null {
    const item = this.store.get(key)

    if (!item) {
      return null
    }

    if (Date.now() > item.expiresAt) {
      this.store.delete(key)
      return null
    }

    return item.value
  }

  /**
   * Set value in cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time to live in milliseconds (default: 5 minutes)
   */
  set(key: string, value: any, ttl: number = this.defaultTTL): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttl
    })
  }

  /**
   * Delete cache entry
   * @param key - Cache key
   */
  delete(key: string): boolean {
    return this.store.delete(key)
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.store.clear()
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.store.size
  }

  /**
   * Get cache stats
   */
  stats(): { size: number; keys: string[] } {
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys())
    }
  }
}

// Export singleton instance
export const cache = new MemoryCache()
