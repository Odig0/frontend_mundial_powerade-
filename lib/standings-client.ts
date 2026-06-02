const DEFAULT_API_URL = 'http://localhost:3000/v1'

function getConfiguredApiUrl() {
  return DEFAULT_API_URL
}

export interface StandingEntry {
  seasonId: number
  teamId: number
  createdAt: string
  draw: number
  goalDifference: number
  goalsAgainst: number
  goalsFor: number
  groupId: number
  groupLetter: string
  groupName: string
  lastSyncedAt: string
  lost: number
  played: number
  points: number
  position: number
  teamCode: string
  teamLogo: string
  teamName: string
  updatedAt: string
  won: number
}

function getApiUrl() {
  const apiUrl = getConfiguredApiUrl()

  if (!apiUrl) {
    throw new Error('Missing NEXT_PUBLIC_API_URL. Set it to your backend base URL, for example http://localhost:3000/v1')
  }

  return apiUrl.replace(/\/$/, '')
}

function buildUrl(path: string) {
  // If the path is a local Next.js API route, use a relative URL so the
  // browser requests the same origin (avoids accidental prefixing with the
  // backend base URL which caused requests to hit `.../v1/api/...`).
  if (path.startsWith('/api/')) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getApiUrl()}${normalizedPath}`
}

async function requestJson<T>(path: string): Promise<T> {
  const response = await fetch(buildUrl(path), {
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

function sortStandings(rows: StandingEntry[]) {
  return [...rows].sort((left, right) => {
    if (left.position !== right.position) {
      return left.position - right.position
    }

    if (right.points !== left.points) {
      return right.points - left.points
    }

    return right.goalDifference - left.goalDifference
  })
}

export const STANDINGS_GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export function getGroupEndpointName(groupLetter: string) {
  return `Group ${groupLetter.toUpperCase()}`
}

export async function getWorldCupStandings(): Promise<StandingEntry[]> {
  const raw = await requestJson<unknown>('/api/standings')

  // Backend may return an array of groups: [{ groupName, groupLetter, teams: [..] }, ...]
  // Normalize to a flat list of team entries for the UI.
  try {
    if (Array.isArray(raw) && raw.length > 0 && (raw[0] as any).teams) {
      const groups = raw as Array<any>
      const teams = groups.flatMap((g) => (Array.isArray(g.teams) ? g.teams.map((t: any) => ({ ...t, groupLetter: g.groupLetter, groupName: g.groupName })) : []))
      return sortStandings(teams)
    }

    const standings = raw as StandingEntry[]
    return Array.isArray(standings) ? sortStandings(standings) : []
  } catch (err) {
    console.warn('[standings-client] Failed to normalize standings response', err)
    return []
  }
}

export async function getWorldCupStandingsByGroup(groupLetter: string): Promise<StandingEntry[]> {
  const raw = await requestJson<unknown>(`/api/standings/group/${encodeURIComponent(getGroupEndpointName(groupLetter))}`)

  try {
    // Some backends return { groupName, groupLetter, teams: [...] }
    if (raw && typeof raw === 'object' && 'teams' in (raw as any)) {
      const group = raw as any
      const teams = Array.isArray(group.teams) ? group.teams.map((t: any) => ({ ...t, groupLetter: group.groupLetter, groupName: group.groupName })) : []
      return sortStandings(teams)
    }

    const standings = raw as StandingEntry[]
    return Array.isArray(standings) ? sortStandings(standings) : []
  } catch (err) {
    console.warn('[standings-client] Failed to normalize group standings response', err)
    return []
  }
}