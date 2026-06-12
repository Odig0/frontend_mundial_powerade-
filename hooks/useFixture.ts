'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import type { FixtureApiMatch } from '@/services/fixtureService'

const CACHE_KEY = 'fixture_cache_v1'
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 min — only skip network if no live matches

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

  const load = useCallback(async (background = false) => {
    if (!background) setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/fixture', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: FixtureApiMatch[] = await res.json()
      setMatches(data)
      writeCache(data)
    } catch (e) {
      // If we already have cached data shown, don't show the error
      if (!background) {
        setError(e instanceof Error ? e.message : 'Error al cargar fixture')
      }
    } finally {
      if (!background) setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (initialised.current) return
    initialised.current = true

    // 1. Show cached data immediately (zero wait)
    const cached = readCache()
    const hasLive = cached?.some((m) => m.is_live) ?? false

    if (cached && cached.length > 0) {
      setMatches(cached)
      setLoading(false)

      if (hasLive) {
        // Live match — always fetch fresh in background
        load(true)
      }
      // No live match + cache fresh enough → skip network hit entirely
    } else {
      // No cache → fetch normally with loading spinner
      load(false)
    }
  }, [load])

  return { matches, loading, error, refetch: () => load(false) }
}
