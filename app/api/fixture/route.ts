import { NextResponse } from 'next/server'
import { fetchFixture } from '@/services/fixtureService'
import fs from 'fs'
import path from 'path'

export const revalidate = 20 // ISR: revalidate every 20 seconds

// File-based cache: public/fixture-cache.json
// This file is served statically and acts as a last-resort fallback
// when the upstream API is unreachable.
const CACHE_FILE = path.join(process.cwd(), 'public', 'fixture-cache.json')

function writeDiskCache(matches: unknown[]) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(matches, null, 0), 'utf-8')
  } catch (err) {
    // Non-fatal — disk may be read-only in some hosting environments
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
    const matches = await fetchFixture()

    if (matches.length > 0) {
      // Persist to disk so the static file stays fresh
      writeDiskCache(matches)

      return NextResponse.json(matches, {
        headers: {
          'Cache-Control': 'public, s-maxage=20, stale-while-revalidate=40',
        },
      })
    }

    // fetchFixture returned empty (upstream error) — serve disk cache
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

    // Nothing at all — return empty array (not a 502)
    return NextResponse.json([])
  } catch (error) {
    console.error('[fixture/route] Unexpected error:', error)

    // Try disk cache before giving up
    const cached = readDiskCache()
    if (cached && cached.length > 0) {
      return NextResponse.json(cached, {
        headers: { 'X-Fixture-Source': 'disk-cache-error-fallback' },
      })
    }

    return NextResponse.json([], { status: 200 })
  }
}
