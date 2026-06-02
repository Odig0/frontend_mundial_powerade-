'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Calendar, Clock, MapPin, RefreshCw } from 'lucide-react'
import { useFixture } from '@/hooks/useFixture'
import { getMatchDate, getMatchTime, getStageBadge, isGroupStage } from '@/services/fixtureService'
import type { FixtureApiMatch } from '@/services/fixtureService'
import { countries } from '@/data/fixtures'

/** Map name → flagcdn URL from the local countries list */
const countryFlagMap = new Map<string, string>(
  countries.map((c) => [c.name.toLowerCase(), c.flag])
)

interface FixtureModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/* ── helpers ── */
const MONTHS_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]
const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const TBD_FLAG =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Flag_of_None.svg/320px-Flag_of_None.svg.png'

function parseDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatLongDate(dateStr: string) {
  const d = parseDate(dateStr)
  return `${d.getDate()} de ${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`
}

function formatShortDate(dateStr: string) {
  const d = parseDate(dateStr)
  return `${DAYS_ES[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`
}

function isTbd(name: string): boolean {
  if (!name) return true
  const n = name.toLowerCase()
  return n === 'por definir' || n === 'tbd' || n === 'tbc' || n.startsWith('ganador') || n.startsWith('winner')
}

function getFlag(team: FixtureApiMatch['home']): string {
  const local = countryFlagMap.get(team.name.toLowerCase())
  if (local) return local
  if (team.image_path && team.image_path.trim()) return team.image_path
  return TBD_FLAG
}

/* group badge colour by group letter */
function groupColor(g: string | null) {
  if (!g) return 'bg-amber-500/20 text-amber-300' // knockout
  const palette: Record<string, string> = {
    A: 'bg-rose-500/20 text-rose-300',
    B: 'bg-orange-500/20 text-orange-300',
    C: 'bg-amber-500/20 text-amber-300',
    D: 'bg-emerald-500/20 text-emerald-300',
    E: 'bg-teal-500/20 text-teal-300',
    F: 'bg-cyan-500/20 text-cyan-300',
    G: 'bg-sky-500/20 text-sky-300',
    H: 'bg-blue-500/20 text-blue-300',
    I: 'bg-indigo-500/20 text-indigo-300',
    J: 'bg-violet-500/20 text-violet-300',
    K: 'bg-purple-500/20 text-purple-300',
    L: 'bg-pink-500/20 text-pink-300',
  }
  return palette[g] ?? 'bg-white/10 text-white/60'
}

function ScoreDisplay({ match }: { match: FixtureApiMatch }) {
  const { score, is_live, finished } = match
  if (score && (score.home !== null || score.away !== null)) {
    return (
      <div
        className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-black text-center min-w-[56px] ${
          is_live
            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
            : finished
            ? 'bg-white/10 text-white border border-white/10'
            : 'bg-accent/10 text-accent border border-accent/20'
        }`}
        style={{ background: is_live ? undefined : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {score.home ?? '-'} - {score.away ?? '-'}
        {is_live && (
          <span className="block text-[8px] uppercase tracking-widest text-red-400 animate-pulse">EN VIVO</span>
        )}
      </div>
    )
  }
  return (
    <div
      className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-black text-white/60"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      VS
    </div>
  )
}

function MatchCard({ match }: { match: FixtureApiMatch }) {
  const time = getMatchTime(match)
  const badge = getStageBadge(match)
  const homeName = isTbd(match.home.name) ? 'Por definir' : match.home.name
  const awayName = isTbd(match.away.name) ? 'Por definir' : match.away.name
  const homeFlag = getFlag(match.home)
  const awayFlag = getFlag(match.away)

  return (
    <article
      className="rounded-2xl border border-white/[0.07] p-4 transition-colors hover:border-white/15 hover:bg-white/[0.03]"
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      {/* meta row */}
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#5ea8e8]">
          <Clock className="h-3 w-3" />
          {time}
        </div>
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${groupColor(match.group)}`}
        >
          {badge}
        </span>
        {match.is_live && (
          <span className="rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse">
            EN VIVO
          </span>
        )}
        {match.state && !isGroupStage(match) && (
          <div className="flex items-center gap-1 text-[11px] text-white/40">
            <span className="truncate">{match.state}</span>
          </div>
        )}
      </div>

      {/* teams */}
      <div className="flex items-center gap-3">
        {/* home */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <img
            src={homeFlag}
            alt={homeName}
            className="h-7 w-10 shrink-0 rounded object-cover shadow"
            loading="lazy"
          />
          <p className="truncate text-sm font-bold text-white">{homeName}</p>
        </div>

        <ScoreDisplay match={match} />

        {/* away */}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          <p className="truncate text-right text-sm font-bold text-white">{awayName}</p>
          <img
            src={awayFlag}
            alt={awayName}
            className="h-7 w-10 shrink-0 rounded object-cover shadow"
            loading="lazy"
          />
        </div>
      </div>

      {/* result info */}
      {match.result_info && (
        <p
          className="mt-2.5 truncate rounded-lg px-2.5 py-1.5 text-[11px] text-white/40"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          🏆 {match.result_info}
        </p>
      )}

      {/* match details (stadium / match number) */}
      {match.details && (
        <p
          className="mt-2 truncate rounded-lg px-2.5 py-1.5 text-[11px] text-white/30"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          🏟️ {match.details}
        </p>
      )}
    </article>
  )
}

/* Skeleton loader */
function SkeletonCard() {
  return (
    <div
      className="rounded-2xl border border-white/[0.07] p-4 animate-pulse"
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      <div className="h-3 bg-white/10 rounded mb-3 w-1/2" />
      <div className="flex items-center gap-3">
        <div className="h-7 w-10 bg-white/10 rounded" />
        <div className="flex-1 h-4 bg-white/10 rounded" />
        <div className="h-7 w-14 bg-white/10 rounded" />
        <div className="flex-1 h-4 bg-white/10 rounded" />
        <div className="h-7 w-10 bg-white/10 rounded" />
      </div>
    </div>
  )
}

export default function FixtureModal({ open, onOpenChange }: FixtureModalProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const dayScrollRef = useRef<HTMLDivElement>(null)
  const { matches, loading, error, refetch } = useFixture()

  useEffect(() => { setMounted(true) }, [])

  /* Escape key */
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onOpenChange(false) }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [open, onOpenChange])

  /* body scroll lock */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  /* unique sorted dates */
  const allDates = useMemo(() => {
    const unique = Array.from(new Set(matches.map((m) => getMatchDate(m)))).sort()
    return unique
  }, [matches])

  /* count per date (for the tabs) */
  const countByDate = useMemo(() => {
    const map: Record<string, number> = {}
    matches.forEach((m) => {
      const d = getMatchDate(m)
      map[d] = (map[d] ?? 0) + 1
    })
    return map
  }, [matches])

  /* matches for selected day (or all) */
  const visibleMatches = useMemo(() => {
    const sorted = [...matches].sort((a, b) => {
      const da = getMatchDate(a), db = getMatchDate(b)
      if (da !== db) return da.localeCompare(db)
      return getMatchTime(a).localeCompare(getMatchTime(b))
    })
    if (!selectedDay) return sorted
    return sorted.filter((m) => getMatchDate(m) === selectedDay)
  }, [matches, selectedDay])

  /* group matches by date for "all" view */
  const matchesByDate = useMemo(() => {
    const map = new Map<string, FixtureApiMatch[]>()
    visibleMatches.forEach((m) => {
      const d = getMatchDate(m)
      const arr = map.get(d) ?? []
      arr.push(m)
      map.set(d, arr)
    })
    return map
  }, [visibleMatches])

  const totalMatches = visibleMatches.length

  const scrollDayIntoView = (date: string | null) => {
    setSelectedDay(date)
    setTimeout(() => {
      if (!dayScrollRef.current) return
      const btn = dayScrollRef.current.querySelector(`[data-date="${date ?? 'all'}"]`) as HTMLElement | null
      btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }, 0)
  }

  if (!mounted || !open) return null

  const modal = (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onOpenChange(false) }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 lg:p-10"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
      aria-modal="true"
      role="dialog"
      aria-label="Fixture completo"
    >
      {/* ── Modal card ── */}
      <div
        className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 text-white shadow-2xl"
        style={{
          maxHeight: 'calc(100dvh - 5rem)',
          background: 'rgba(10, 14, 20, 0.88)',
          backdropFilter: 'blur(24px) saturate(1.4)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
        }}
      >
        {/* ── HEADER ── */}
        <header
          className="flex shrink-0 items-center justify-between gap-4 px-6 py-5"
          style={{
            background: 'linear-gradient(135deg, rgba(30,74,114,0.9) 0%, rgba(20,50,80,0.85) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
              style={{ background: 'rgba(94,168,232,0.18)', border: '1px solid rgba(94,168,232,0.25)' }}
            >
              <Calendar className="h-5 w-5 text-[#5ea8e8]" />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/45">Mundial 2026</p>
              <h1 className="text-2xl font-black uppercase tracking-wide text-white">
                Fixture Completo
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="hidden rounded-lg px-3 py-1 text-xs font-semibold text-white/50 sm:inline-flex items-center gap-2"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              {loading ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                `${totalMatches} partidos`
              )}
            </span>
            <button
              type="button"
              onClick={refetch}
              aria-label="Actualizar"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Cerrar"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* ── DAY SELECTOR ── */}
        <div
          className="shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
        >
          <div
            ref={dayScrollRef}
            className="flex items-center gap-1.5 overflow-x-auto px-4 py-2.5 scrollbar-none"
            style={{ scrollbarWidth: 'none' }}
          >
            {/* All button */}
            <button
              data-date="all"
              type="button"
              onClick={() => scrollDayIntoView(null)}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                selectedDay === null
                  ? 'bg-[#5ea8e8] text-white shadow-lg shadow-[#5ea8e8]/20'
                  : 'text-white/50 hover:bg-white/8 hover:text-white'
              }`}
            >
              Todos
            </button>

            {/* Per-day buttons */}
            {allDates.map((date) => {
              const count = countByDate[date] ?? 0
              const isActive = selectedDay === date
              return (
                <button
                  key={date}
                  data-date={date}
                  type="button"
                  onClick={() => scrollDayIntoView(date)}
                  className={`flex shrink-0 flex-col items-center rounded-xl px-3 py-1.5 text-center transition-all ${
                    isActive
                      ? 'bg-[#5ea8e8] text-white shadow-lg shadow-[#5ea8e8]/20'
                      : 'text-white/50 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <span className="text-[11px] font-black uppercase tracking-wider">
                    {formatShortDate(date)}
                  </span>
                  <span className={`text-[9px] font-semibold ${isActive ? 'text-white/75' : 'text-white/30'}`}>
                    {count} {count === 1 ? 'partido' : 'partidos'}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── MATCHES ── */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <div className="flex flex-col h-40 items-center justify-center gap-3">
              <p className="text-sm text-red-400">{error}</p>
              <button
                onClick={refetch}
                className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Reintentar
              </button>
            </div>
          ) : visibleMatches.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-white/35">
              No hay partidos para este día.
            </div>
          ) : selectedDay ? (
            /* single day — no date header */
            <div className="space-y-3">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-white/40">
                {formatLongDate(selectedDay)} · {visibleMatches.length} partidos
              </p>
              {visibleMatches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          ) : (
            /* all days — grouped by date */
            <div className="space-y-6">
              {Array.from(matchesByDate.entries()).map(([date, dayMatches]) => (
                <section key={date}>
                  {/* date header */}
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className="flex items-center gap-2 rounded-xl px-3 py-1.5"
                      style={{ background: 'rgba(94,168,232,0.1)', border: '1px solid rgba(94,168,232,0.2)' }}
                    >
                      <Calendar className="h-3.5 w-3.5 text-[#5ea8e8]" />
                      <span className="text-xs font-black uppercase tracking-widest text-[#5ea8e8]">
                        {formatLongDate(date)}
                      </span>
                    </div>
                    <span className="text-[11px] text-white/30">
                      {dayMatches.length} {dayMatches.length === 1 ? 'partido' : 'partidos'}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {dayMatches.map((m) => (
                      <MatchCard key={m.id} match={m} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
