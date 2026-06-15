'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Calendar, Clock, MapPin, RefreshCw, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { DayPicker, DayButton } from 'react-day-picker'
import { es } from 'date-fns/locale'
import { useFixture } from '@/hooks/useFixture'
import { getMatchDate, getMatchTime, getStageBadge, isGroupStage, extractGroupLetter, hasScore } from '@/services/fixtureService'
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

function stateLabel(state: string): string {
  const s = state.toLowerCase()
  if (s.includes('primera') || s.includes('first half')) return '1ª Mitad'
  if (s.includes('segunda') || s.includes('segundo') || s.includes('second half')) return '2ª Mitad'
  if (s.includes('descanso') || s.includes('half time') || s.includes('half-time')) return 'Descanso'
  if (s.includes('prórroga') || s.includes('tiempo extra') || s.includes('extra')) return 'Prórroga'
  if (s.includes('penal')) return 'Penales'
  return state
}

function ScoreDisplay({ match }: { match: FixtureApiMatch }) {
  const { score, is_live, finished, state } = match

  if (hasScore(score)) {
    const hasPenalties = score!.home_penalties !== null || score!.away_penalties !== null
    const hasET       = score!.home_et !== null || score!.away_et !== null
    const hasHT       = score!.home_ht !== null || score!.away_ht !== null
    const label       = stateLabel(state)
    const isDone      = !is_live && finished

    return (
      <div
        className={`shrink-0 flex flex-col items-center justify-center rounded-xl px-3 py-1.5 text-center min-w-[64px] ${
          is_live
            ? 'bg-blue-500/20 border border-blue-400/50'
            : isDone
            ? 'border border-blue-500/30'
            : 'bg-accent/10 border border-accent/25'
        }`}
        style={!is_live ? { background: isDone ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.06)' } : undefined}
      >
        {/* main score */}
        <span
          className={`text-base font-black tabular-nums leading-none ${
            is_live ? 'text-blue-300' : isDone ? 'text-blue-200' : 'text-accent'
          }`}
        >
          {score!.home ?? 0} - {score!.away ?? 0}
        </span>

        {/* live state label */}
        {is_live && (
          <span className="mt-0.5 flex items-center gap-1 text-[8px] uppercase tracking-widest text-blue-400 font-bold">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            {label}
          </span>
        )}

        {/* finished label */}
        {isDone && (
          <span className="mt-0.5 text-[9px] uppercase tracking-wide text-blue-300 font-black">
            Finalizado
          </span>
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
          {isGroupStage(match)
            ? extractGroupLetter(match.group)
              ? `FASE DE GRUPOS · ${getStageBadge(match)}`
              : 'FASE DE GRUPOS'
            : badge}
        </span>
        {match.is_live && (
          <span className="rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/40 animate-pulse">
            {stateLabel(match.state)}
          </span>
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

      {/* goals by scorers */}
      {match.goals && match.goals.length > 0 && (() => {
        const homeGoals = match.goals.filter(g => g.team_name === match.home.name)
        const awayGoals = match.goals.filter(g => g.team_name === match.away.name)
        const maxRows = Math.max(homeGoals.length, awayGoals.length)
        return (
          <div
            className="mt-3 rounded-xl px-3 py-2 space-y-1"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            {Array.from({ length: maxRows }).map((_, i) => {
              const hg = homeGoals[i]
              const ag = awayGoals[i]
              const goalIcon = (type: string) =>
                type === 'own-goal' ? '⚽🔴' : type === 'penalty' ? '⚽🎯' : '⚽'
              return (
                <div key={i} className="grid grid-cols-2 gap-2 text-[11px]">
                  {/* home goal */}
                  <div className="flex items-center gap-1 min-w-0">
                    {hg ? (
                      <>
                        <span className="shrink-0">{goalIcon(hg.type)}</span>
                        <span className="truncate text-white/70 font-medium">{hg.player_name}</span>
                        <span className="shrink-0 text-white/35 font-semibold">
                          {hg.minute}{hg.extra_time ? `+${hg.extra_time}'` : "'"}
                        </span>
                      </>
                    ) : null}
                  </div>
                  {/* away goal */}
                  <div className="flex items-center justify-end gap-1 min-w-0">
                    {ag ? (
                      <>
                        <span className="shrink-0 text-white/35 font-semibold">
                          {ag.minute}{ag.extra_time ? `+${ag.extra_time}` : "'"}
                        </span>
                        <span className="truncate text-white/70 font-medium">{ag.player_name}</span>
                        <span className="shrink-0">{goalIcon(ag.type)}</span>
                      </>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })()}



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

/* ─────────────────────────────────────────────────────────────────────────
   Custom DayButton for the fixture calendar.
   ALL styling is done with inline styles so there is NO dependency on CSS
   class-name specificity — works regardless of react-day-picker version.
───────────────────────────────────────────────────────────────────────── */
function FixtureCalDayButton({
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const hasMatch   = !!modifiers.hasMatch
  const isSelected = !!modifiers.selected
  const isDisabled = !!modifiers.disabled   // disabled = no match on this day
  const isOutside  = !!modifiers.outside

  /* ── resolve visual state ── */
  let bg      = 'transparent'
  let color   = isOutside ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.16)'
  let border  = isOutside ? '1px solid transparent' : '1px solid rgba(255,255,255,0.07)'
  let shadow  = 'none'
  let fw      = 500
  let cursor  = isDisabled ? 'not-allowed' : 'pointer'
  let opacity = isOutside ? 0.5 : 1

  if (hasMatch && !isSelected) {
    bg      = 'rgba(94,168,232,0.18)'
    color   = '#ffffff'
    border  = '1px solid rgba(94,168,232,0.48)'
    shadow  = '0 0 10px rgba(94,168,232,0.20), inset 0 1px 0 rgba(255,255,255,0.10)'
    fw      = 800
    cursor  = 'pointer'
    opacity = 1
  }

  if (isSelected) {
    bg      = '#5ea8e8'
    color   = '#ffffff'
    border  = '1px solid #7ec8f0'
    shadow  = '0 0 22px rgba(94,168,232,0.65), 0 2px 10px rgba(0,0,0,0.45)'
    fw      = 900
    cursor  = 'pointer'
    opacity = 1
  }

  /* Extract onClick so non-match days don't fire */
  const { children, onClick, ...rest } = props as any

  return (
    <button
      type="button"
      onClick={hasMatch ? onClick : undefined}
      disabled={!hasMatch && isDisabled}
      {...rest}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2px',
        borderRadius: '9px',
        fontSize: '11px',
        fontWeight: fw,
        color,
        background: bg,
        border,
        boxShadow: shadow,
        cursor,
        opacity,
        transition: 'all 0.15s ease',
        position: 'relative',
        outline: 'none',
        padding: 0,
      }}
      onMouseEnter={hasMatch && !isSelected ? (e) => {
        const b = e.currentTarget as HTMLButtonElement
        b.style.background = 'rgba(94,168,232,0.32)'
        b.style.borderColor = 'rgba(94,168,232,0.72)'
        b.style.boxShadow   = '0 0 18px rgba(94,168,232,0.38)'
        b.style.transform   = 'scale(1.12)'
      } : undefined}
      onMouseLeave={hasMatch && !isSelected ? (e) => {
        const b = e.currentTarget as HTMLButtonElement
        b.style.background = 'rgba(94,168,232,0.18)'
        b.style.borderColor = 'rgba(94,168,232,0.48)'
        b.style.boxShadow   = '0 0 10px rgba(94,168,232,0.20), inset 0 1px 0 rgba(255,255,255,0.10)'
        b.style.transform   = 'scale(1)'
      } : undefined}
    >
      {/* day number */}
      <span style={{ lineHeight: 1 }}>{day.date.getDate()}</span>
      {/* glowing dot — only for days with matches */}
      {hasMatch && (
        <span style={{
          display: 'block',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: isSelected ? 'rgba(255,255,255,0.9)' : '#5ea8e8',
          boxShadow: isSelected ? 'none' : '0 0 5px #5ea8e8',
          flexShrink: 0,
        }} />
      )}
    </button>
  )
}

export default function FixtureModal({ open, onOpenChange }: FixtureModalProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const dayScrollRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
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

  /* Date objects for days that have matches — used by DayPicker */
  const matchDays = useMemo(() => {
    return allDates.map((d) => parseDate(d))
  }, [allDates])

  /* The currently-selected Date object for DayPicker */
  const pickerSelected = useMemo(() => {
    return selectedDay ? parseDate(selectedDay) : undefined
  }, [selectedDay])

  /* Default month shown in picker (first match month or today) */
  const defaultPickerMonth = useMemo(() => {
    return matchDays.length > 0 ? matchDays[0] : new Date()
  }, [matchDays])

  /* Close calendar popover on outside click */
  useEffect(() => {
    if (!calendarOpen) return
    const handler = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setCalendarOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [calendarOpen])

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

  /* Handle day selection from the popover picker */
  const handlePickerSelect = (day: Date | undefined) => {
    if (!day) return
    const y = day.getFullYear()
    const m = String(day.getMonth() + 1).padStart(2, '0')
    const d = String(day.getDate()).padStart(2, '0')
    const dateStr = `${y}-${m}-${d}`
    // Only navigate if there are matches on that day
    if (allDates.includes(dateStr)) {
      scrollDayIntoView(dateStr)
    }
    setCalendarOpen(false)
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
            {/* Calendar icon — click to open date picker */}
            <div className="relative" ref={calendarRef}>
              <button
                type="button"
                onClick={() => setCalendarOpen((v) => !v)}
                aria-label="Abrir calendario"
                title="Filtrar por fecha"
                className={`group flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-200 ${
                  calendarOpen
                    ? 'ring-2 ring-[#5ea8e8]/60 scale-105'
                    : 'hover:scale-105 hover:ring-2 hover:ring-[#5ea8e8]/40'
                }`}
                style={{
                  background: calendarOpen
                    ? 'rgba(94,168,232,0.30)'
                    : 'rgba(94,168,232,0.18)',
                  border: '1px solid rgba(94,168,232,0.25)',
                }}
              >
                <Calendar className="h-5 w-5 text-[#5ea8e8] transition-transform duration-200 group-hover:rotate-6" />
              </button>

              {/* ── Floating calendar popover ── */}
              {calendarOpen && (
                <div
                  className="absolute left-0 top-[calc(100%+10px)] z-[10000] overflow-hidden rounded-2xl shadow-2xl"
                  style={{
                    background: 'rgba(8,14,26,0.97)',
                    border: '1px solid rgba(94,168,232,0.25)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(94,168,232,0.15)',
                    minWidth: '300px',
                  }}
                >
                  {/* Popover header */}
                  <div
                    className="px-4 pt-3 pb-2 flex items-center justify-center"
                    style={{ borderBottom: '1px solid rgba(94,168,232,0.12)' }}
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5ea8e8]/70">
                      Selecciona un día
                    </span>
                  </div>

                  {/* Custom DayButton — inline styles, no CSS specificity issues */}
                  <div style={{ padding: '4px 8px 8px' }}>
                    <DayPicker
                      locale={es}
                      mode="single"
                      selected={pickerSelected}
                      onSelect={handlePickerSelect}
                      defaultMonth={defaultPickerMonth}
                      startMonth={new Date(2026, 5)}
                      endMonth={new Date(2026, 6)}
                      disabled={(day) => {
                        const y = day.getFullYear()
                        const m = String(day.getMonth() + 1).padStart(2, '0')
                        const d = String(day.getDate()).padStart(2, '0')
                        return !allDates.includes(`${y}-${m}-${d}`)
                      }}
                      modifiers={{ hasMatch: matchDays }}
                      components={{
                        DayButton: FixtureCalDayButton,
                        Chevron: ({ orientation, ...props }) => {
                          if (orientation === 'left') {
                            return <ChevronLeft className="h-4 w-4 text-[#5ea8e8]" {...props} />
                          }
                          if (orientation === 'right') {
                            return <ChevronRight className="h-4 w-4 text-[#5ea8e8]" {...props} />
                          }
                          return <ChevronDown className="h-4 w-4 text-[#5ea8e8]" {...props} />
                        }
                      }}
                      classNames={{
                        root: 'relative select-none',
                        months: 'flex flex-col relative',
                        month: 'flex flex-col gap-2',
                        month_caption: 'flex items-center justify-center h-9 px-9 relative mb-1',
                        caption_label: 'text-[11px] font-black uppercase tracking-[0.2em]',
                        nav: 'flex items-center justify-between absolute inset-x-0 top-0 z-10',
                        button_previous: 'h-9 w-9 flex items-center justify-center rounded-xl transition-all cursor-pointer hover:bg-[rgba(94,168,232,0.15)]',
                        button_next: 'h-9 w-9 flex items-center justify-center rounded-xl transition-all cursor-pointer hover:bg-[rgba(94,168,232,0.15)]',
                        weekdays: 'flex gap-1',
                        weekday: 'flex-1 text-center text-[9px] font-bold uppercase tracking-widest h-6 flex items-center justify-center',
                        weeks: 'flex flex-col gap-1',
                        week: 'flex gap-1',
                        day: 'flex-1 aspect-square p-0',
                        day_button: 'w-full h-full',
                        hidden: 'invisible',
                      }}
                      style={{
                        '--rdp-day-height': '36px',
                        '--rdp-day-width': '36px',
                        color: 'rgba(255,255,255,0.5)',
                      } as React.CSSProperties}
                    />
                  </div>

                  {/* Legend */}
                  <div
                    className="px-4 pb-3 flex items-center gap-3"
                    style={{ borderTop: '1px solid rgba(94,168,232,0.1)' }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block h-2 w-2 rounded-full bg-[#5ea8e8]" />
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-white/35">Día con partidos</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block h-2 w-2 rounded-full bg-white/15" />
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-white/35">Sin partidos</span>
                    </div>
                  </div>
                </div>
              )}
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
