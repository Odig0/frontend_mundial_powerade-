'use client'

import { useState, useMemo } from 'react'
import { ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react'
import { useFixture } from '@/hooks/useFixture'
import { getMatchDate, getMatchTime, getStageBadge, isGroupStage, extractGroupLetter, hasScore } from '@/services/fixtureService'
import type { FixtureApiMatch } from '@/services/fixtureService'
import { countries } from '@/data/fixtures'
import StandingsModal from '@/components/home/StandingsModal'
import FixtureModal from '@/components/home/FixtureModal'

/** Map name → flagcdn URL from the local countries list */
const countryFlagMap = new Map<string, string>(
  countries.map((c) => [c.name.toLowerCase(), c.flag])
)

const MONTHS_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

function formatDateLabel(dateStr: string) {
  const [, m, d] = dateStr.split('-').map(Number)
  return `${d} DE ${MONTHS_ES[m - 1].toUpperCase()}`
}

const TBD_FLAG = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Flag_of_None.svg/320px-Flag_of_None.svg.png'

function getFlag(team: FixtureApiMatch['home']): string {
  const local = countryFlagMap.get(team.name.toLowerCase())
  if (local) return local
  if (team.image_path && team.image_path.trim()) return team.image_path
  return TBD_FLAG
}

/** Tournament round sort order */
const STAGE_ORDER: Record<string, number> = {
  'fase de grupos':             0,
  'dieciseisavos de final':     1,
  'dieciseisavos':              1,
  'octavos de final':           2,
  'octavos':                    2,
  'cuartos de final':           3,
  'cuartos':                    3,
  'semifinales':                4,
  'semifinal':                  4,
  'final por el tercer puesto': 5,
  'tercer puesto':              5,
  'final':                      6,
}

const GROUP_STAGE_LABELS = new Set(['fase de grupos', 'group stage'])

function isTbd(name: string): boolean {
  return !name || name === 'Por definir' || name === 'TBD' || name.startsWith('Ganador') || name.startsWith('Winner')
}

/** Returns today as YYYY-MM-DD in local time */
function todayStr(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function ScoreOrVS({ match }: { match: FixtureApiMatch }) {
  const { score, is_live, finished } = match

  if (hasScore(score)) {
    return (
      <div
        className={`shrink-0 flex flex-col items-center justify-center rounded-xl px-2.5 py-1 text-center min-w-[52px] ${
          is_live
            ? 'bg-blue-500/20 border border-blue-400/50'
            : finished
            ? 'bg-blue-500/10 border border-blue-500/30'
            : 'bg-accent/10 border border-accent/25'
        }`}
      >
        <span
          className={`text-sm font-black tabular-nums leading-none ${
            is_live ? 'text-blue-300' : finished ? 'text-blue-200' : 'text-accent'
          }`}
        >
          {score!.home ?? 0} - {score!.away ?? 0}
        </span>

        {is_live && (
          <span className="mt-0.5 flex items-center gap-1 text-[8px] uppercase tracking-widest text-blue-400 font-bold">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            EN VIVO
          </span>
        )}

        {!is_live && finished && (
          <span className="mt-0.5 text-[9px] uppercase tracking-wide text-blue-300 font-black">
            FINALIZADO
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="shrink-0 rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-xs font-black text-foreground">
      VS
    </div>
  )
}

export default function FixtureBlock() {
  const { matches, loading, error, refetch } = useFixture()
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [standingsOpen, setStandingsOpen] = useState(false)
  const [fixtureOpen, setFixtureOpen] = useState(false)
  const [dayIdxOverride, setDayIdxOverride] = useState<number | null>(null)

  // All unique match days from the API, sorted
  const allDays = useMemo(() => {
    return Array.from(new Set(matches.map(getMatchDate))).sort()
  }, [matches])

  // Find today's index (or nearest future day, or last day)
  const todayIdx = useMemo(() => {
    if (allDays.length === 0) return 0
    const today = todayStr()
    const exact = allDays.indexOf(today)
    if (exact !== -1) return exact
    const future = allDays.findIndex((d) => d > today)
    if (future !== -1) return future
    return allDays.length - 1
  }, [allDays])

  const activeDayIdx = dayIdxOverride !== null ? dayIdxOverride : todayIdx
  const activeDay = allDays[activeDayIdx] ?? null

  // Unique group letters from group stage matches
  const groups = useMemo(() => {
    return Array.from(
      new Set(
        matches
          .filter(isGroupStage)
          .map((m) => extractGroupLetter(m.group))
          .filter((l): l is string => l !== null)
      )
    ).sort()
  }, [matches])

  // Knockout stages
  const knockoutStages = useMemo(() => {
    const stageSet = new Set(
      matches
        .filter((m) => !isGroupStage(m) && !GROUP_STAGE_LABELS.has(m.stage.toLowerCase()))
        .map((m) => m.stage)
    )
    return Array.from(stageSet).sort((a, b) => {
      const oa = STAGE_ORDER[a.toLowerCase()] ?? 99
      const ob = STAGE_ORDER[b.toLowerCase()] ?? 99
      return oa - ob
    })
  }, [matches])

  const filterActive = selectedGroup !== null

  // When a filter is active: show ALL matches of that type across all days
  // When no filter: show matches for the active day only
  const displayMatches = useMemo(() => {
    if (filterActive) {
      if (selectedGroup!.length === 1) {
        // group letter filter
        return matches.filter(
          (m) => isGroupStage(m) && extractGroupLetter(m.group) === selectedGroup
        )
      } else {
        // knockout stage filter
        return matches.filter((m) => m.stage === selectedGroup)
      }
    }
    // day mode
    if (!activeDay) return []
    return matches.filter((m) => getMatchDate(m) === activeDay)
  }, [matches, activeDay, selectedGroup, filterActive])

  const canPrev = !filterActive && activeDayIdx > 0
  const canNext = !filterActive && activeDayIdx < allDays.length - 1

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGroup(e.target.value === 'TODOS' ? null : e.target.value)
    setDayIdxOverride(null) // reset to today when clearing filter
  }

  return (
    <div
      id="partidos"
      className="flex flex-col max-h-[800px]"
      style={{ scrollMarginTop: '88px' }}
    >
      {/* ── Header ── */}
      <div className="bg-accent text-accent-foreground mx-3 md:mx-4 mt-2 rounded-xl px-3 py-1.5 font-bold text-xs uppercase tracking-wider flex items-center justify-between gap-2">
        <span className="typography-section-title !text-xs md:!text-sm">Fixture del mundial</span>
        {loading && <RefreshCw className="h-3 w-3 animate-spin opacity-70" />}
      </div>

      {/* ── Filters + button ── */}
      <div className="border-b border-white/8 bg-background/50 px-3 pt-2 pb-3 md:px-4 flex flex-col gap-2">
        <select
          value={selectedGroup || 'TODOS'}
          onChange={handleGroupChange}
          className="w-full rounded-lg border-2 border-accent bg-slate-950 px-3 py-1.5 text-xs font-bold text-accent uppercase tracking-wider hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer"
        >
          <option value="TODOS">Todos los partidos</option>
          {groups.map((letter) => (
            <option key={letter} value={letter}>Grupo {letter}</option>
          ))}
          {knockoutStages.map((stage) => (
            <option key={stage} value={stage}>{stage}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setFixtureOpen(true)}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-accent px-2 py-2 text-[10px] font-black uppercase tracking-wider text-white transition-all hover:brightness-110 active:scale-95 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Fixture Completo
        </button>
      </div>

      {/* ── Match list ── */}
      <div className="flex flex-col gap-2 flex-1 bg-card p-2 md:p-3 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl border border-white/8 bg-background/70 p-3 animate-pulse">
                <div className="h-3 bg-white/10 rounded mb-2 w-2/3" />
                <div className="h-5 bg-white/10 rounded w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-24 gap-2">
            <p className="text-red-400 text-xs text-center">{error}</p>
            <button onClick={refetch} className="text-accent text-xs underline">Reintentar</button>
          </div>
        ) : displayMatches.length > 0 ? (
          displayMatches.map((match) => {
            const date = getMatchDate(match)
            const time = getMatchTime(match)
            const badge = getStageBadge(match)
            const homeName = isTbd(match.home.name) ? 'Por definir' : match.home.name
            const awayName = isTbd(match.away.name) ? 'Por definir' : match.away.name
            const homeFlag = getFlag(match.home)
            const awayFlag = getFlag(match.away)

            return (
              <article
                key={match.id}
                className="rounded-xl border border-white/8 bg-background/70 p-3 shadow-sm shadow-black/10"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-accent font-bold uppercase tracking-wider">
                    <span>{formatDateLabel(date)}</span>
                    <span>|</span>
                    <span>{time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-accent">
                      {isGroupStage(match)
                        ? extractGroupLetter(match.group)
                          ? `FASE DE GRUPOS · ${getStageBadge(match)}`
                          : 'FASE DE GRUPOS'
                        : getStageBadge(match)}
                    </span>
                    {match.is_live && (
                      <span className="text-[9px] font-bold uppercase text-blue-300 bg-blue-500/20 border border-blue-400/40 rounded px-1 py-0.5 animate-pulse">
                        EN VIVO
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1 flex items-center gap-2">
                    <img src={homeFlag} alt={homeName} className="h-6 w-8 rounded object-cover" />
                    <p className="truncate text-sm font-black text-foreground">{homeName}</p>
                  </div>

                  <ScoreOrVS match={match} />

                  <div className="min-w-0 flex-1 text-right flex items-center justify-end gap-2">
                    <p className="truncate text-sm font-black text-foreground">{awayName}</p>
                    <img src={awayFlag} alt={awayName} className="h-6 w-8 rounded object-cover" />
                  </div>
                </div>
              </article>
            )
          })
        ) : (
          <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
            No hay partidos este día
          </div>
        )}
      </div>

      {/* ── Day navigation footer (same style as before) ── */}
      <div className="flex items-center justify-between gap-2 border-t border-white/8 bg-background/50 px-3 py-2 md:px-4">
        <button
          onClick={() => setDayIdxOverride(activeDayIdx - 1)}
          disabled={!canPrev}
          className="flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-white/10 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        <span className="text-[10px] text-white/30 font-semibold text-center">
          {filterActive
            ? `${displayMatches.length} partidos`
            : activeDay
            ? `${formatDateLabel(activeDay)} · ${displayMatches.length} partido${displayMatches.length !== 1 ? 's' : ''}`
            : '—'}
        </span>

        <button
          onClick={() => setDayIdxOverride(activeDayIdx + 1)}
          disabled={!canNext}
          className="flex items-center justify-center gap-1 rounded-lg bg-accent text-accent-foreground px-2 py-1.5 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:opacity-90 transition-opacity"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <StandingsModal open={standingsOpen} onOpenChange={setStandingsOpen} />
      <FixtureModal open={fixtureOpen} onOpenChange={setFixtureOpen} />
    </div>
  )
}
