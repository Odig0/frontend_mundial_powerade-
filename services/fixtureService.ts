import { partidos } from '@/data/fixtures'

export interface ApiGoal {
  event_id: number
  minute: number
  extra_time: number | null
  type: string          // 'goal' | 'own-goal' | 'penalty'
  team_id: number
  team_name: string
  player_id: number
  player_name: string
  score: string         // e.g. "1-0"
  created_at: string
}


export interface ApiTeam {
  name: string
  short_code: string
  image_path: string
  winner: boolean | null
}

export interface ApiScore {
  home: number | null
  away: number | null
  home_ht: number | null
  away_ht: number | null
  home_et: number | null
  away_et: number | null
  home_penalties: number | null
  away_penalties: number | null
}

/** Returns true when a score object has at least one non-null value */
export function hasScore(score: ApiScore | null): boolean {
  return score !== null && (score.home !== null || score.away !== null)
}

export interface FixtureApiMatch {
  id: number
  stage_id?: number
  name: string
  stage?: string
  group: string | null
  round?: string
  details?: string
  starting_at: string          // "YYYY-MM-DD HH:mm:ss"
  starting_at_timestamp?: number
  state_id: number
  state: string
  is_live: boolean
  finished: boolean
  home: ApiTeam
  away: ApiTeam
  score: ApiScore | null
  goals: ApiGoal[]
  result_info: string | null
  last_sync: string
  // Live-match extra fields (from /fixture/live)
  match_minute?: number | null
  match_seconds?: number | null
  match_time_ticking?: boolean
  state_short?: string
  period_description?: string
  state_developer_name?: string
  time_added?: number | null
}

export type FixtureApiResponse = Record<string, FixtureApiMatch>

/**
 * Build a lookup map: "homeTeamName|awayTeamName" → group letter
 * using the local `partidos` data (which has all group assignments).
 */
const localGroupMap = new Map<string, string>(
  partidos.map((p) => [
    `${p.homeTeam.name.toLowerCase()}|${p.awayTeam.name.toLowerCase()}`,
    p.group,
  ])
)

/**
 * Look up the group letter for a match using team names.
 * Tries both home|away and away|home to handle name order differences.
 */
function resolveGroup(homeName: string, awayName: string): string | null {
  const key1 = `${homeName.toLowerCase()}|${awayName.toLowerCase()}`
  const key2 = `${awayName.toLowerCase()}|${homeName.toLowerCase()}`
  return localGroupMap.get(key1) ?? localGroupMap.get(key2) ?? null
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dev.eldeber.bo/v1'

export async function fetchFixture(): Promise<FixtureApiMatch[]> {
  try {
    const res = await fetch(`${API_BASE}/mundial-2026/fixture/results`, {
      next: { revalidate: 20 },
    })

    if (!res.ok) {
      console.error('[fixtureService] HTTP error', res.status)
      return []
    }

    const data: FixtureApiResponse = await res.json()

    const matches = Object.values(data)
      .map((m) => ({
        ...m,
        group: m.group ?? resolveGroup(m.home.name, m.away.name),
      }))
      .sort((a, b) => (a.starting_at_timestamp ?? 0) - (b.starting_at_timestamp ?? 0))

    return matches
  } catch (err) {
    console.error('[fixtureService] fetch error', err)
    return []
  }
}

/**
 * Fetch only the matches that are currently LIVE from the dedicated live endpoint.
 * The live endpoint returns an array (not a map), with extra fields like
 * match_minute, state_short, period_description, time_added, etc.
 */
export async function fetchLiveFixture(): Promise<FixtureApiMatch[]> {
  try {
    const res = await fetch(`${API_BASE}/mundial-2026/fixture/live`, {
      cache: 'no-store', // always fresh for live data
    })

    if (!res.ok) {
      console.error('[fixtureService] live HTTP error', res.status)
      return []
    }

    const data: unknown = await res.json()

    // The live endpoint returns an array directly
    const arr: FixtureApiMatch[] = Array.isArray(data) ? (data as FixtureApiMatch[]) : []

    return arr.map((m) => ({
      ...m,
      group: m.group ?? resolveGroup(m.home.name, m.away.name),
      is_live: true,
    }))
  } catch (err) {
    console.error('[fixtureService] live fetch error', err)
    return []
  }
}

/** Extract YYYY-MM-DD from "YYYY-MM-DD HH:mm:ss" */
export function getMatchDate(match: FixtureApiMatch): string {
  return match.starting_at.slice(0, 10)
}

/** Extract HH:mm from "YYYY-MM-DD HH:mm:ss" */
export function getMatchTime(match: FixtureApiMatch): string {
  return match.starting_at.slice(11, 16)
}

/**
 * Extract a single uppercase letter from group strings sent by the backend.
 * Handles: "Group J" → "J", "J" → "J", null → null
 */
export function extractGroupLetter(group: string | null | undefined): string | null {
  if (!group) return null
  const m = group.match(/(?:group\s+)?([A-L])\s*$/i)
  return m ? m[1].toUpperCase() : null
}

/** True when a match belongs to the group stage */
export function isGroupStage(match: FixtureApiMatch): boolean {
  if (match.group !== null && match.group !== '') return true
  const s = match.stage?.toLowerCase() ?? ''
  return s.includes('fase de grupos') || s.includes('group stage')
}

/** Label shown for the stage badge — just the group letter (e.g. "A") */
export function getStageBadge(match: FixtureApiMatch): string {
  if (isGroupStage(match)) {
    const letter = extractGroupLetter(match.group)
    return letter ?? ''
  }
  return match.stage ?? ''
}

/** True when the team slot is "Por definir" (team name starts with certain patterns) */
export function isTeamTbd(team: ApiTeam): boolean {
  const tbd = ['Por definir', 'TBD', 'TBC', 'Ganador', 'Perdedor', 'Winner', 'Loser']
  return tbd.some((t) => team.name.toLowerCase().includes(t.toLowerCase()))
}
