// Intelligent caching system for performance optimization
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class IntelligentCache {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize = 100; // Maximum number of items in cache
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL

  set<T>(key: string, data: T, ttl?: number): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let expired = 0;
    let valid = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        expired++;
      } else {
        valid++;
      }
    }

    return {
      total: this.cache.size,
      valid,
      expired,
      hitRate: 0 // This would need to be calculated with hit/miss tracking
    };
  }

  // Clean up expired items
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Create singleton instance
export const cache = new IntelligentCache();

// Cache keys constants
export const CACHE_KEYS = {
  SCRIPTS: 'scripts',
  ANALYTICS: 'analytics',
  USER_PROFILE: 'user_profile',
  VIDEO_ANALYSIS: 'video_analysis',
  SCRIPT_GENERATION: 'script_generation',
} as const;

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  SHORT: 2 * 60 * 1000,      // 2 minutes
  MEDIUM: 5 * 60 * 1000,     // 5 minutes
  LONG: 15 * 60 * 1000,      // 15 minutes
  VERY_LONG: 60 * 60 * 1000, // 1 hour
} as const;

// Cache wrapper for API calls
export function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<T> {
  return new Promise((resolve, reject) => {
    // Check cache first
    const cached = cache.get<T>(key);
    if (cached !== null) {
      resolve(cached);
      return;
    }

    // Fetch data and cache it
    fetcher()
      .then((data) => {
        cache.set(key, data, ttl);
        resolve(data);
      })
      .catch(reject);
  });
}

// Cleanup expired items every 5 minutes
setInterval(() => {
  cache.cleanup();
}, 5 * 60 * 1000);

export default cache;
