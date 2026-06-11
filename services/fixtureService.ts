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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dev.eldeber.bo/v1'

export async function fetchFixture(): Promise<FixtureApiMatch[]> {
  try {
    const res = await fetch(`${API_BASE}/mundial-2026/fixture/results`, {
      next: { revalidate: 60 }, // revalidate every 60 seconds
    })

    if (!res.ok) {
      console.error('[fixtureService] HTTP error', res.status)
      return []
    }

    const data: FixtureApiResponse = await res.json()

    // Convert the object map to a sorted array
    const matches = Object.values(data).sort(
      (a, b) => a.starting_at_timestamp - b.starting_at_timestamp
    )

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

/** True when a match belongs to the group stage */
export function isGroupStage(match: FixtureApiMatch): boolean {
  return match.group !== null && match.group !== ''
}

/** Label shown for the stage badge (e.g. "Grupo A", "Octavos de Final") */
export function getStageBadge(match: FixtureApiMatch): string {
  if (isGroupStage(match)) {
    return `Grupo ${match.group}`
  }
  return match.stage
}

/** True when the team slot is "Por definir" (team name starts with certain patterns) */
export function isTeamTbd(team: ApiTeam): boolean {
  const tbd = ['Por definir', 'TBD', 'TBC', 'Ganador', 'Perdedor', 'Winner', 'Loser']
  return tbd.some((t) => team.name.toLowerCase().includes(t.toLowerCase()))
}
