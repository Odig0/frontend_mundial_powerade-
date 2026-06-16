'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import type { FixtureApiMatch } from '@/services/fixtureService'

const CACHE_KEY = 'fixture_cache_v1'
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 min — only skip network if no live matches
const LIVE_POLL_MS = 30_000          // Re-fetch every 30s while a match is live

interface CacheEntry {
  data: FixtureApiMatch[]
  fetchedAt: number
}

function readCache(): FixtureApiMatch[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const entry: CacheEntry = JSON.parse(raw)
    const age = Date.now() - entry.fetchedAt
    if (age > CACHE_TTL_MS) return null
    return entry.data
  } catch {
    return null
  }
}

function writeCache(data: FixtureApiMatch[]) {
  try {
    const entry: CacheEntry = { data, fetchedAt: Date.now() }
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
  } catch {
    // storage full or unavailable — ignore
  }
}

interface UseFixtureResult {
  matches: FixtureApiMatch[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useFixture(): UseFixtureResult {
  const [matches, setMatches] = useState<FixtureApiMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const initialised = useRef(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const load = useCallback(async (background = false) => {
    if (!background) setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/fixture', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: FixtureApiMatch[] = await res.json()
      setMatches(data)
      writeCache(data)
      return data
    } catch (e) {
      if (!background) {
        setError(e instanceof Error ? e.message : 'Error al cargar fixture')
      }
      return null
    } finally {
      if (!background) setLoading(false)
    }
  }, [])

  // Start / stop live polling based on whether any match is live
  const syncPolling = useCallback((data: FixtureApiMatch[]) => {
    const hasLive = data.some((m) => m.is_live)

    if (hasLive && !pollRef.current) {
      // Start polling every 30s
      pollRef.current = setInterval(() => {
        load(true)
      }, LIVE_POLL_MS)
    } else if (!hasLive && pollRef.current) {
      // No more live matches — stop polling
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [load])

  useEffect(() => {
    if (initialised.current) return
    initialised.current = true

    const cached = readCache()
    const hasLive = cached?.some((m) => m.is_live) ?? false

    if (cached && cached.length > 0) {
      setMatches(cached)
      setLoading(false)
      syncPolling(cached)

      if (hasLive) {
        // Live match — fetch fresh immediately in background
        load(true).then((fresh) => { if (fresh) syncPolling(fresh) })
      }
    } else {
      load(false).then((fresh) => { if (fresh) syncPolling(fresh) })
    }

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [load, syncPolling])

  return { matches, loading, error, refetch: () => load(false) }
}

