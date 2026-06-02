'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Trophy, Filter, ChevronDown, Loader2, LayoutList, Users } from 'lucide-react'
import {
  getWorldCupStandings,
  getWorldCupStandingsByGroup,
  STANDINGS_GROUPS,
  getGroupEndpointName,
  type StandingEntry,
} from '@/lib/standings-client'

interface StandingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatNumber(value: number | undefined) {
  return Number.isFinite(value ?? NaN) ? String(value) : '0'
}

function getTeamBadge(entry: StandingEntry) {
  const name = entry.teamName || 'Equipo'
  return name.split(' ').map((p) => p.charAt(0)).join('').slice(0, 2).toUpperCase()
}

function PositionBadge({ pos }: { pos: number }) {
  const cls =
    pos === 1
      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
      : pos === 2
        ? 'bg-slate-300/20 text-slate-300 border-slate-300/30'
        : pos === 3
          ? 'bg-orange-600/20 text-orange-400 border-orange-600/30'
          : 'bg-white/5 text-white/50 border-white/10'
  return (
    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-black ${cls}`}>
      {pos}
    </span>
  )
}

function StandingsTable({
  rows,
  loading,
  error,
  showGroupColumn,
}: {
  rows: StandingEntry[]
  loading: boolean
  error: string | null
  showGroupColumn: boolean
}) {
  if (loading) {
    return (
      <div className="flex h-56 items-center justify-center gap-3 text-white/50">
        <Loader2 className="h-6 w-6 animate-spin text-[#5ea8e8]" />
        <span className="text-sm font-medium">Cargando tabla...</span>
      </div>
    )
  }
  if (error) {
    return (
      <div className="m-4 flex h-40 items-center justify-center rounded-2xl border border-dashed border-red-500/30 bg-red-500/5 px-8 text-center text-sm text-red-300">
        {error}
      </div>
    )
  }
  if (rows.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-white/40">
        No hay datos disponibles.
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse" style={{ minWidth: 680 }}>
        <thead>
          <tr className="border-b border-white/10">
            <th className="w-16 py-3 pl-6 pr-2 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">
              Pos
            </th>
            <th className="py-3 pl-2 pr-6 text-left text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">
              País
            </th>
            {showGroupColumn && (
              <th className="w-20 py-3 px-3 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">
                Grupo
              </th>
            )}
            <th className="w-14 py-3 px-3 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">PJ</th>
            <th className="w-14 py-3 px-3 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400/70">G</th>
            <th className="w-14 py-3 px-3 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400/70">E</th>
            <th className="w-14 py-3 px-3 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-rose-400/70">P</th>
            <th className="w-14 py-3 px-3 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">GF</th>
            <th className="w-14 py-3 px-3 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">GC</th>
            <th className="w-14 py-3 px-3 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400/70">DG</th>
            <th className="w-16 py-3 pl-3 pr-6 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-[#5ea8e8]/90">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((entry, idx) => (
            <tr
              key={`${entry.groupId}-${entry.teamId}`}
              className={`border-b border-white/[0.04] transition-colors duration-150 hover:bg-white/[0.04] ${
                idx % 2 !== 0 ? 'bg-white/[0.012]' : ''
              }`}
            >
              <td className="py-3 pl-6 pr-2 text-center">
                <PositionBadge pos={entry.position} />
              </td>
              <td className="py-3 pl-2 pr-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5">
                    {entry.teamLogo ? (
                      <img src={entry.teamLogo} alt={entry.teamName || ''} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <span className="text-[10px] font-black text-white/60">{getTeamBadge(entry)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold leading-tight text-white">{entry.teamName || 'Sin nombre'}</p>
                    <p className="text-[11px] leading-tight text-white/40">{entry.teamCode}</p>
                  </div>
                </div>
              </td>
              {showGroupColumn && (
                <td className="py-3 px-3 text-center">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#5ea8e8]/15 text-[11px] font-black text-[#5ea8e8]">
                    {entry.groupLetter}
                  </span>
                </td>
              )}
              <td className="py-3 px-3 text-center text-sm font-semibold text-white/65">{formatNumber(entry.played)}</td>
              <td className="py-3 px-3 text-center text-sm font-bold text-emerald-400">{formatNumber(entry.won)}</td>
              <td className="py-3 px-3 text-center text-sm font-bold text-amber-400">{formatNumber(entry.draw)}</td>
              <td className="py-3 px-3 text-center text-sm font-bold text-rose-400">{formatNumber(entry.lost)}</td>
              <td className="py-3 px-3 text-center text-sm font-semibold text-white/65">{formatNumber(entry.goalsFor)}</td>
              <td className="py-3 px-3 text-center text-sm font-semibold text-white/65">{formatNumber(entry.goalsAgainst)}</td>
              <td className="py-3 px-3 text-center text-sm font-bold text-cyan-400">{formatNumber(entry.goalDifference)}</td>
              <td className="py-3 pl-3 pr-6 text-center">
                <span className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-lg bg-[#5ea8e8]/20 px-2 text-sm font-black text-[#5ea8e8]">
                  {formatNumber(entry.points)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function StandingsModal({ open, onOpenChange }: StandingsModalProps) {
  const [mounted, setMounted] = useState(false)
  const [view, setView] = useState<'general' | 'group'>('general')
  const [overallStandings, setOverallStandings] = useState<StandingEntry[]>([])
  const [selectedGroup, setSelectedGroup] = useState('')
  const [groupStandings, setGroupStandings] = useState<StandingEntry[]>([])
  const [loadingOverall, setLoadingOverall] = useState(false)
  const [loadingGroup, setLoadingGroup] = useState(false)
  const [overallError, setOverallError] = useState<string | null>(null)
  const [groupError, setGroupError] = useState<string | null>(null)
  const [groupRequested, setGroupRequested] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  /* close on Escape */
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onOpenChange(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onOpenChange])

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  /* load overall standings */
  useEffect(() => {
    if (!open) return
    let cancelled = false
    async function load() {
      setLoadingOverall(true)
      setOverallError(null)
      try {
        const data = await getWorldCupStandings()
        if (!cancelled) setOverallStandings(data)
      } catch (err) {
        if (!cancelled) setOverallError(err instanceof Error ? err.message : 'No se pudo cargar la tabla.')
      } finally {
        if (!cancelled) setLoadingOverall(false)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [open])

  async function handleLoadGroup() {
    if (!selectedGroup) return
    setLoadingGroup(true)
    setGroupError(null)
    setGroupRequested(true)
    try {
      const data = await getWorldCupStandingsByGroup(selectedGroup)
      setGroupStandings(data)
    } catch (err) {
      setGroupError(err instanceof Error ? err.message : 'No se pudo cargar la tabla del grupo.')
    } finally {
      setLoadingGroup(false)
    }
  }

  if (!mounted || !open) return null

  const modal = (
    /* ── Backdrop ── */
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onOpenChange(false) }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 lg:p-10"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
      aria-modal="true"
      role="dialog"
      aria-label="Tabla de posiciones"
    >
      {/* ── Modal card ── */}
      <div
        className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 text-white shadow-2xl"
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
              <Trophy className="h-5 w-5 text-[#5ea8e8]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/45">Mundial 2026</p>
              <h1 className="text-2xl font-black uppercase tracking-wide text-white">
                Tabla de posiciones
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Cerrar"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* ── TOOLBAR ── */}
        <div
          className="flex shrink-0 flex-wrap items-center gap-3 px-6 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
        >
          {/* Toggle */}
          <div className="flex rounded-xl border border-white/10 bg-black/30 p-1">
            <button
              type="button"
              onClick={() => setView('general')}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all ${
                view === 'general'
                  ? 'bg-[#5ea8e8] text-white shadow-lg shadow-[#5ea8e8]/20'
                  : 'text-white/45 hover:text-white/75'
              }`}
            >
              <LayoutList className="h-3.5 w-3.5" />
              General
            </button>
            <button
              type="button"
              onClick={() => setView('group')}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all ${
                view === 'group'
                  ? 'bg-[#5ea8e8] text-white shadow-lg shadow-[#5ea8e8]/20'
                  : 'text-white/45 hover:text-white/75'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              Por grupo
            </button>
          </div>

          {/* Group selector */}
          {view === 'group' && (
            <>
              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35" />
                <select
                  id="group-select"
                  value={selectedGroup}
                  onChange={(e) => {
                    setSelectedGroup(e.target.value)
                    setGroupRequested(false)
                    setGroupStandings([])
                    setGroupError(null)
                  }}
                  className="appearance-none rounded-xl border border-white/12 bg-white/5 py-2 pl-9 pr-9 text-sm font-bold uppercase tracking-widest text-white outline-none transition focus:border-[#5ea8e8]/60 focus:ring-2 focus:ring-[#5ea8e8]/20"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  <option value="" style={{ background: '#0d1117' }}>Selecciona un grupo</option>
                  {STANDINGS_GROUPS.map((g) => (
                    <option key={g} value={g} style={{ background: '#0d1117' }}>
                      Grupo {g}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              </div>

              <button
                type="button"
                id="load-group-btn"
                onClick={handleLoadGroup}
                disabled={!selectedGroup || loadingGroup}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-black text-white transition-all hover:brightness-110 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                  background: !selectedGroup || loadingGroup
                    ? 'rgba(94,168,232,0.3)'
                    : 'linear-gradient(135deg, #5ea8e8, #4090d0)',
                  boxShadow: selectedGroup && !loadingGroup ? '0 4px 14px rgba(94,168,232,0.3)' : 'none',
                }}
              >
                {loadingGroup ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Cargando...</>
                ) : (
                  <><Users className="h-4 w-4" />Ver {selectedGroup ? `Grupo ${selectedGroup}` : 'grupo'}</>
                )}
              </button>

              {groupRequested && !loadingGroup && selectedGroup && (
                <span
                  className="rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#5ea8e8]"
                  style={{ background: 'rgba(94,168,232,0.12)', border: '1px solid rgba(94,168,232,0.2)' }}
                >
                  {getGroupEndpointName(selectedGroup)} · {groupStandings.length} equipos
                </span>
              )}
            </>
          )}

          {/* Count — general */}
          {view === 'general' && !loadingOverall && (
            <span className="ml-auto rounded-lg px-3 py-1 text-xs font-semibold text-white/40" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {overallStandings.length} selecciones
            </span>
          )}
        </div>

        {/* ── TABLE AREA ── */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          {view === 'general' ? (
            <StandingsTable rows={overallStandings} loading={loadingOverall} error={overallError} showGroupColumn />
          ) : groupRequested ? (
            <StandingsTable rows={groupStandings} loading={loadingGroup} error={groupError} showGroupColumn={false} />
          ) : (
            <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 px-8 text-center">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <Users className="h-8 w-8 text-white/25" />
              </div>
              <div>
                <p className="text-sm font-bold text-white/50">Selecciona un grupo</p>
                <p className="mt-1 text-xs text-white/30">
                  Elige un grupo (A – L) y presiona &ldquo;Ver grupo&rdquo;
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}