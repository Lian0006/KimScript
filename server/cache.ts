import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface CacheItem {
  transcription: string;
  analysis: any;
  timestamp: number;
  ttl: number;
  videoUrl: string;
  platform: string;
}

interface CacheStats {
  totalItems: number;
  hitRate: number;
  missRate: number;
  totalHits: number;
  totalMisses: number;
  memoryUsage: number;
}

class VideoCache {
  private cache = new Map<string, CacheItem>();
  private stats = {
    hits: 0,
    misses: 0,
    totalRequests: 0
  };
  private cacheDir = '/tmp/video-cache';
  private maxMemoryItems = 100; // Máximo items en memoria
  private defaultTTL = 24 * 60 * 60 * 1000; // 24 horas

  constructor() {
    // Crear directorio de cache si no existe
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }

    // Cargar cache persistente al iniciar
    this.loadPersistentCache();
    
    // Limpiar cache expirado cada 30 minutos
    setInterval(() => {
      this.cleanup();
    }, 30 * 60 * 1000);
  }

  // Generar hash único para la URL del video
  private generateHash(videoUrl: string): string {
    return crypto.createHash('sha256').update(videoUrl).digest('hex').substring(0, 16);
  }

  // Generar clave de cache
  private getCacheKey(videoUrl: string, platform: string): string {
    return `${platform}_${this.generateHash(videoUrl)}`;
  }

  // Verificar si un item está en cache y no ha expirado
  has(videoUrl: string, platform: string): boolean {
    const key = this.getCacheKey(videoUrl, platform);
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      this.stats.totalRequests++;
      return false;
    }

    // Verificar si ha expirado
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.totalRequests++;
      return false;
    }

    this.stats.hits++;
    this.stats.totalRequests++;
    return true;
  }

  // Obtener transcripción y análisis del cache
  get(videoUrl: string, platform: string): { transcription: string; analysis: any } | null {
    const key = this.getCacheKey(videoUrl, platform);
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      this.stats.totalRequests++;
      return null;
    }

    // Verificar si ha expirado
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.totalRequests++;
      return null;
    }

    this.stats.hits++;
    this.stats.totalRequests++;
    return {
      transcription: item.transcription,
      analysis: item.analysis
    };
  }

  // Guardar transcripción y análisis en cache
  set(videoUrl: string, platform: string, transcription: string, analysis: any, ttl?: number): void {
    const key = this.getCacheKey(videoUrl, platform);
    
    // Si el cache está lleno, eliminar el item más antiguo
    if (this.cache.size >= this.maxMemoryItems) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    const item: CacheItem = {
      transcription,
      analysis,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
      videoUrl,
      platform
    };

    this.cache.set(key, item);
    
    // Guardar también en disco para persistencia
    this.saveToDisk(key, item);
  }

  // Guardar item en disco
  private saveToDisk(key: string, item: CacheItem): void {
    try {
      const filePath = path.join(this.cacheDir, `${key}.json`);
      fs.writeFileSync(filePath, JSON.stringify(item, null, 2));
    } catch (error) {
      console.error('Error saving cache to disk:', error);
    }
  }

  // Cargar cache persistente desde disco
  private loadPersistentCache(): void {
    try {
      const files = fs.readdirSync(this.cacheDir);
      let loadedCount = 0;

      for (const file of files) {
        if (file.endsWith('.json')) {
          try {
            const filePath = path.join(this.cacheDir, file);
            const data = fs.readFileSync(filePath, 'utf8');
            const item: CacheItem = JSON.parse(data);
            
            // Solo cargar si no ha expirado
            if (Date.now() - item.timestamp <= item.ttl) {
              const key = file.replace('.json', '');
              this.cache.set(key, item);
              loadedCount++;
            } else {
              // Eliminar archivo expirado
              fs.unlinkSync(filePath);
            }
          } catch (error) {
            console.error(`Error loading cache file ${file}:`, error);
          }
        }
      }

      console.log(`Loaded ${loadedCount} items from persistent cache`);
    } catch (error) {
      console.error('Error loading persistent cache:', error);
    }
  }

  // Limpiar cache expirado
  cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
        
        // Eliminar archivo del disco
        try {
          const filePath = path.join(this.cacheDir, `${key}.json`);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (error) {
          console.error(`Error deleting cache file ${key}:`, error);
        }
        
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired cache items`);
    }
  }

  // Obtener estadísticas del cache
  getStats(): CacheStats {
    const hitRate = this.stats.totalRequests > 0 
      ? (this.stats.hits / this.stats.totalRequests) * 100 
      : 0;

    return {
      totalItems: this.cache.size,
      hitRate: Math.round(hitRate * 100) / 100,
      missRate: Math.round((100 - hitRate) * 100) / 100,
      totalHits: this.stats.hits,
      totalMisses: this.stats.misses,
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024 // MB
    };
  }

  // Limpiar todo el cache
  clear(): void {
    this.cache.clear();
    
    // Limpiar archivos del disco
    try {
      const files = fs.readdirSync(this.cacheDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          fs.unlinkSync(path.join(this.cacheDir, file));
        }
      }
    } catch (error) {
      console.error('Error clearing disk cache:', error);
    }
  }

  // Obtener información de un item específico
  getItemInfo(videoUrl: string, platform: string): any {
    const key = this.getCacheKey(videoUrl, platform);
    const item = this.cache.get(key);
    
    if (!item) return null;

    return {
      videoUrl: item.videoUrl,
      platform: item.platform,
      timestamp: new Date(item.timestamp).toISOString(),
      ttl: item.ttl,
      expiresAt: new Date(item.timestamp + item.ttl).toISOString(),
      transcriptionLength: item.transcription.length,
      hasAnalysis: !!item.analysis
    };
  }
}

// Crear instancia singleton
export const videoCache = new VideoCache();

// Función helper para verificar si un video ya está en cache
export function isVideoCached(videoUrl: string, platform: string): boolean {
  return videoCache.has(videoUrl, platform);
}

// Función helper para obtener datos del cache
export function getCachedVideoData(videoUrl: string, platform: string): { transcription: string; analysis: any } | null {
  return videoCache.get(videoUrl, platform);
}

// Función helper para guardar en cache
export function setCachedVideoData(videoUrl: string, platform: string, transcription: string, analysis: any, ttl?: number): void {
  videoCache.set(videoUrl, platform, transcription, analysis, ttl);
}

export default videoCache;
