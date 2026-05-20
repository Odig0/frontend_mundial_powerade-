/**
 * Cache utilities for server-side news fallback
 * Reads and writes to /data/news-cache.json
 */

import { promises as fs } from 'fs'
import path from 'path'
import { NewsItem } from './api'

export interface CacheMetadata {
  version: '1'
  timestamp: number
  count: number
}

export interface NewsCache {
  metadata: CacheMetadata
  news: NewsItem[]
}

const CACHE_FILE_PATH = path.join(process.cwd(), 'data', 'news-cache.json')

/**
 * Ensure the data directory exists
 */
async function ensureDataDir(): Promise<void> {
  try {
    const dataDir = path.dirname(CACHE_FILE_PATH)
    await fs.mkdir(dataDir, { recursive: true })
  } catch (error) {
    console.error('[Cache] Failed to create data directory:', error)
    throw error
  }
}

/**
 * Read the news cache from disk
 * Returns null if cache doesn't exist or is corrupted
 */
export async function readNewsCache(): Promise<NewsCache | null> {
  try {
    const data = await fs.readFile(CACHE_FILE_PATH, 'utf-8')
    const cache: NewsCache = JSON.parse(data)

    // Validate cache structure
    if (!cache.metadata || !Array.isArray(cache.news)) {
      console.warn('[Cache] Invalid cache structure')
      return null
    }

    return cache
  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error && error.code === 'ENOENT') {
        // File doesn't exist yet - this is normal on first run
        return null
      }
      console.warn('[Cache] Failed to read cache:', error.message)
    }
    return null
  }
}

/**
 * Write the news cache to disk
 */
export async function writeNewsCache(news: NewsItem[]): Promise<void> {
  try {
    await ensureDataDir()

    const cache: NewsCache = {
      metadata: {
        version: '1',
        timestamp: Date.now(),
        count: news.length,
      },
      news,
    }

    await fs.writeFile(
      CACHE_FILE_PATH,
      JSON.stringify(cache, null, 2),
      'utf-8'
    )

    console.log(
      `[Cache] Successfully cached ${news.length} news items`,
      new Date(cache.metadata.timestamp).toISOString()
    )
  } catch (error) {
    console.error('[Cache] Failed to write cache:', error)
    throw error
  }
}

/**
 * Get cache age in milliseconds
 * Returns Infinity if cache doesn't exist
 */
export function getCacheAge(cache: NewsCache | null): number {
  if (!cache) {
    return Infinity
  }
  return Date.now() - cache.metadata.timestamp
}

/**
 * Check if cache is still fresh (less than 24 hours old)
 */
export function isCacheFresh(cache: NewsCache | null, maxAge: number = 1000 * 60 * 60 * 24): boolean {
  if (!cache) {
    return false
  }
  return getCacheAge(cache) < maxAge
}
