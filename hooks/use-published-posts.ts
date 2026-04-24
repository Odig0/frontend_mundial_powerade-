'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'powerade_published'

interface UsePublishedPostsReturn {
  publishedIds: Set<string> | null
  isPublished: (id: string) => boolean
  togglePublished: (id: string) => void
  clearAll: () => void
  isLoaded: boolean
}

export function usePublishedPosts(): UsePublishedPostsReturn {
  const [publishedIds, setPublishedIds] = useState<Set<string> | null>(null)

  // Load from localStorage after mount (avoid hydration mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const arr: string[] = raw ? JSON.parse(raw) : []
      setPublishedIds(new Set(arr))
    } catch {
      setPublishedIds(new Set())
    }
  }, [])

  const isPublished = (id: string): boolean => {
    return publishedIds?.has(id) ?? false
  }

  const togglePublished = (id: string) => {
    setPublishedIds((prev) => {
      if (!prev) return null
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      // Persist to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...newSet]))
      return newSet
    })
  }

  const clearAll = () => {
    setPublishedIds(new Set())
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    publishedIds,
    isPublished,
    togglePublished,
    clearAll,
    isLoaded: publishedIds !== null,
  }
}
