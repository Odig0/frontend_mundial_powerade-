import { NextResponse } from 'next/server'
import { fetchFixture, fetchLiveFixture } from '@/services/fixtureService'
import type { FixtureApiMatch } from '@/services/fixtureService'
import fs from 'fs'
import path from 'path'

export const revalidate = 20 // ISR: revalidate every 20 seconds

// File-based cache: public/fixture-cache.json
const CACHE_FILE = path.join(process.cwd(), 'public', 'fixture-cache.json')

function writeDiskCache(matches: unknown[]) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(matches, null, 0), 'utf-8')
  } catch (err) {
    console.warn('[fixture/route] Could not write disk cache:', err)
  }
}

function readDiskCache(): unknown[] | null {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null
    const raw = fs.readFileSync(CACHE_FILE, 'utf-8')
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : null
  } catch {
    return null
  }
}

export async function GET() {
  try {
    // Fetch all results + current live matches in parallel
    const [allMatches, liveMatches] = await Promise.all([
      fetchFixture(),
      fetchLiveFixture(),
    ])

    let merged: FixtureApiMatch[] = allMatches

    if (liveMatches.length > 0) {
      // Build a map of live matches keyed by id for fast lookup
      const liveMap = new Map<number, FixtureApiMatch>(
        liveMatches.map((m) => [m.id, m])
      )

      // Overwrite matching entries in allMatches with full live data
      // (live response has match_minute, period_description, etc.)
      merged = allMatches.map((m) => liveMap.get(m.id) ?? m)

      // If a live match is not yet in allMatches (edge case), append it
      for (const live of liveMatches) {
        if (!allMatches.find((m) => m.id === live.id)) {
          merged.push(live)
        }
      }

      // Re-sort after merge
      merged.sort((a, b) =>
        (a.starting_at_timestamp ?? 0) - (b.starting_at_timestamp ?? 0)
      )
    }

    if (merged.length > 0) {
      writeDiskCache(merged)
      return NextResponse.json(merged, {
        headers: {
          'Cache-Control': 'public, s-maxage=20, stale-while-revalidate=40',
        },
      })
    }

    // fetchFixture returned empty — serve disk cache
    const cached = readDiskCache()
    if (cached && cached.length > 0) {
      console.info('[fixture/route] Upstream empty — serving disk cache')
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
          'X-Fixture-Source': 'disk-cache',
        },
      })
    }

    return NextResponse.json([])
  } catch (error) {
    console.error('[fixture/route] Unexpected error:', error)

    const cached = readDiskCache()
    if (cached && cached.length > 0) {
      return NextResponse.json(cached, {
        headers: { 'X-Fixture-Source': 'disk-cache-error-fallback' },
      })
    }

    return NextResponse.json([], { status: 200 })
  }
}

