'use client'

import { useState, useMemo } from 'react'
import { ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react'
import { useFixture } from '@/hooks/useFixture'
import { getMatchDate, getMatchTime, getStageBadge, isGroupStage } from '@/services/fixtureService'
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
  return `${d} de ${MONTHS_ES[m - 1]}`
}

const TBD_FLAG = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Flag_of_None.svg/320px-Flag_of_None.svg.png'

function getFlag(team: FixtureApiMatch['home']): string {
  const local = countryFlagMap.get(team.name.toLowerCase())
  if (local) return local
  // fallback to API image if not in our list
  if (team.image_path && team.image_path.trim()) return team.image_path
  return TBD_FLAG
}

/** Tournament round sort order — lower = earlier */
const STAGE_ORDER: Record<string, number> = {
  'fase de grupos':             0,  // excluded from knockout list
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

/** Stages that are NOT true knockout rounds (keep them out of the knockout filter list) */
const GROUP_STAGE_LABELS = new Set(['fase de grupos', 'group stage'])

function isTbd(name: string): boolean {
  return !name || name === 'Por definir' || name === 'TBD' || name.startsWith('Ganador') || name.startsWith('Winner')
}

function ScoreOrVS({ match }: { match: FixtureApiMatch }) {
  const { score, is_live, finished } = match
  if (score && (score.home !== null || score.away !== null)) {
    return (
      <div
        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-black text-center min-w-[44px] ${
          is_live
            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
            : finished
            ? 'bg-white/10 text-white border border-white/10'
            : 'bg-accent/10 text-accent border border-accent/20'
        }`}
      >
        {score.home ?? '-'} - {score.away ?? '-'}
        {is_live && <span className="block text-[8px] uppercase tracking-widest text-red-400">EN VIVO</span>}
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
  const [page, setPage] = useState(0)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [standingsOpen, setStandingsOpen] = useState(false)
  const [fixtureOpen, setFixtureOpen] = useState(false)
  const itemsPerPage = 4

  // Unique groups from group stage only
  const groups = useMemo(() => {
    const unique = Array.from(
      new Set(
        matches
          .filter(isGroupStage)
          .map((m) => m.group as string)
      )
    ).sort()
    return unique
  }, [matches])

  // Knockout stages — extracted from API, excluding group-stage labels, sorted by tournament round
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

  // Filter: group → by group letter; knockout stage name → by stage; null → all
  const filteredMatches = useMemo(() => {
    if (!selectedGroup) return matches
    // is it a group letter?
    if (selectedGroup.length === 1) {
      return matches.filter((m) => isGroupStage(m) && m.group === selectedGroup)
    }
    // it's a knockout stage name
    return matches.filter((m) => m.stage === selectedGroup)
  }, [matches, selectedGroup])

  const totalPages = Math.ceil(filteredMatches.length / itemsPerPage)
  const currentMatches = filteredMatches.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage)

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGroup(e.target.value === 'TODOS' ? null : e.target.value)
    setPage(0)
  }

  return (
    <div
      id="partidos"
      className="flex flex-col max-h-[800px]"
      style={{ scrollMarginTop: '88px' }}
    >
      <div className="bg-accent text-accent-foreground mx-3 md:mx-4 mt-2 rounded-xl px-3 py-1.5 font-bold text-xs uppercase tracking-wider flex items-center justify-between gap-2">
        <span className="typography-section-title !text-xs md:!text-sm">Fixture del mundial</span>
        {loading && (
          <RefreshCw className="h-3 w-3 animate-spin opacity-70" />
        )}
      </div>

      <div className="border-b border-white/8 bg-background/50 px-3 pt-2 pb-3 md:px-4 flex flex-col gap-2">
        <select
          value={selectedGroup || 'TODOS'}
          onChange={handleGroupChange}
          className="w-full rounded-lg border-2 border-accent bg-slate-950 px-3 py-1.5 text-xs font-bold text-accent uppercase tracking-wider hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer"
        >
          <option value="TODOS">Todos los partidos</option>
          {groups.map((group) => (
            <option key={group} value={group}>
              Grupo {group}
            </option>
          ))}
          {knockoutStages.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setFixtureOpen(true)}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-accent px-2 py-2 text-[10px] font-black uppercase tracking-wider text-white transition-all hover:brightness-110 active:scale-95 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Fixture Completo
          </button>
        </div>
      </div>

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
        ) : currentMatches.length > 0 ? (
          currentMatches.map((match) => {
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
                      {badge}
                    </span>
                    {match.is_live && (
                      <span className="text-[9px] font-bold uppercase text-red-400 bg-red-500/10 border border-red-500/30 rounded px-1 py-0.5 animate-pulse">
                        EN VIVO
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1 flex items-center gap-2">
                    <img
                      src={homeFlag}
                      alt={homeName}
                      className="h-6 w-8 rounded object-cover"
                    />
                    <p className="truncate text-sm font-black text-foreground">
                      {homeName}
                    </p>
                  </div>

                  <ScoreOrVS match={match} />

                  <div className="min-w-0 flex-1 text-right flex items-center justify-end gap-2">
                    <p className="truncate text-sm font-black text-foreground">
                      {awayName}
                    </p>
                    <img
                      src={awayFlag}
                      alt={awayName}
                      className="h-6 w-8 rounded object-cover"
                    />
                  </div>
                </div>

                {match.result_info && (
                  <div className="mt-2 rounded-lg bg-white/5 px-2 py-1.5">
                    <p className="text-xs text-muted-foreground truncate">{match.result_info}</p>
                  </div>
                )}
              </article>
            )
          })
        ) : (
          <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
            No hay partidos en este grupo
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-white/8 bg-background/50 px-3 py-2 md:px-4">
        <button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          className="flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-white/10 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        <span className="text-[10px] text-white/30 font-semibold">
          {Math.min((page + 1) * itemsPerPage, filteredMatches.length)} / {filteredMatches.length}
        </span>

        <button
          onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
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
