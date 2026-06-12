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
  stage_id: number
  name: string
  stage: string
  group: string | null
  round: string
  details: string
  starting_at: string          // "YYYY-MM-DD HH:mm:ss"
  starting_at_timestamp: number
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
      next: { revalidate: 20 }, // revalidate every 20 seconds
    })

    if (!res.ok) {
      console.error('[fixtureService] HTTP error', res.status)
      return []
    }

    const data: FixtureApiResponse = await res.json()

    // Convert the object map to a sorted array
    const matches = Object.values(data)
      .map((m) => ({
        ...m,
        // Patch null group using local partidos lookup
        group: m.group ?? resolveGroup(m.home.name, m.away.name),
      }))
      .sort((a, b) => a.starting_at_timestamp - b.starting_at_timestamp)

    return matches
  } catch (err) {
    console.error('[fixtureService] fetch error', err)
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
  return match.stage
}

/** True when the team slot is "Por definir" (team name starts with certain patterns) */
export function isTeamTbd(team: ApiTeam): boolean {
  const tbd = ['Por definir', 'TBD', 'TBC', 'Ganador', 'Perdedor', 'Winner', 'Loser']
  return tbd.some((t) => team.name.toLowerCase().includes(t.toLowerCase()))
}
