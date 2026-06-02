'use client'

import { useEffect, useState, useCallback } from 'react'
import type { FixtureApiMatch } from '@/services/fixtureService'

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

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/fixture', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: FixtureApiMatch[] = await res.json()
      setMatches(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar fixture')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { matches, loading, error, refetch: load }
}
