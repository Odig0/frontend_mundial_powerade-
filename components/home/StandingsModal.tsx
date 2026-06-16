'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Trophy, Loader2, Info } from 'lucide-react'
import {
  getWorldCupStandings,
  type StandingEntry,
} from '@/lib/standings-client'

interface StandingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Legend rows */
const LEGEND: { code: string; label: string; color?: string }[] = [
  { code: 'POS', label: 'Posicion en el grupo' },
  { code: 'PJ',  label: 'Partidos Jugados' },
  { code: 'PG',  label: 'Partidos Ganados',   color: 'text-emerald-400' },
  { code: 'PE',  label: 'Partidos Empatados', color: 'text-amber-400' },
  { code: 'PP',  label: 'Partidos Perdidos',  color: 'text-rose-400' },
  { code: 'GF',  label: 'Goles a Favor' },
  { code: 'GC',  label: 'Goles en Contra' },
  { code: 'DG',  label: 'Diferencia de Gol (GF - GC)', color: 'text-cyan-400' },
  { code: 'PTS', label: 'Puntos', color: 'text-[#5ea8e8]' },
]

function formatNumber(value: number | undefined) {
  return Number.isFinite(value ?? NaN) ? String(value) : '0'
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
    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-black ${cls}`}>
      {pos}
    </span>
  )
}

/** Groups the flat standings array by groupLetter */
function groupByLetter(rows: StandingEntry[]) {
  const map = new Map<string, StandingEntry[]>()
  for (const row of rows) {
    const key = row.groupLetter || '?'
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(row)
  }
  return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
}

function GroupTable({ rows }: { rows: StandingEntry[] }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse" style={{ minWidth: 520 }}>
        <thead>
          <tr className="border-b border-white/10">
            <th className="w-10 py-2 pl-3 pr-1 text-center text-[9px] font-bold uppercase tracking-widest text-white/35">Pos</th>
            <th className="py-2 pl-2 pr-4 text-left text-[9px] font-bold uppercase tracking-widest text-white/35">Pais</th>
            <th className="w-10 py-2 px-2 text-center text-[9px] font-bold uppercase tracking-widest text-white/35">PJ</th>
            <th className="w-10 py-2 px-2 text-center text-[9px] font-bold uppercase tracking-widest text-emerald-400/80">PG</th>
            <th className="w-10 py-2 px-2 text-center text-[9px] font-bold uppercase tracking-widest text-amber-400/80">PE</th>
            <th className="w-10 py-2 px-2 text-center text-[9px] font-bold uppercase tracking-widest text-rose-400/80">PP</th>
            <th className="w-10 py-2 px-2 text-center text-[9px] font-bold uppercase tracking-widest text-white/35">GF</th>
            <th className="w-10 py-2 px-2 text-center text-[9px] font-bold uppercase tracking-widest text-white/35">GC</th>
            <th className="w-10 py-2 px-2 text-center text-[9px] font-bold uppercase tracking-widest text-cyan-400/80">DG</th>
            <th className="w-12 py-2 pl-2 pr-3 text-center text-[9px] font-bold uppercase tracking-widest text-[#5ea8e8]/90">PTS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((entry, idx) => (
            <tr
              key={`${entry.groupId}-${entry.teamId}-${entry.teamCode}-${idx}`}
              className={`border-b border-white/[0.04] transition-colors duration-150 hover:bg-white/[0.05] ${idx % 2 !== 0 ? 'bg-white/[0.01]' : ''}`}
            >
              <td className="py-2.5 pl-3 pr-1 text-center">
                <PositionBadge pos={entry.position} />
              </td>
              <td className="py-2.5 pl-2 pr-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5">
                    {entry.teamLogo ? (
                      <img src={entry.teamLogo} alt={entry.teamName || ''} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <span className="text-[9px] font-black text-white/60">
                        {(entry.teamName || 'EQ').split(' ').map((p) => p.charAt(0)).join('').slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold leading-tight text-white">{entry.teamName || 'Sin nombre'}</p>
                    <p className="text-[10px] leading-tight text-white/40">{entry.teamCode}</p>
                  </div>
                </div>
              </td>
              <td className="py-2.5 px-2 text-center text-sm font-semibold text-white/65">{formatNumber(entry.played)}</td>
              <td className="py-2.5 px-2 text-center text-sm font-bold text-emerald-400">{formatNumber(entry.won)}</td>
              <td className="py-2.5 px-2 text-center text-sm font-bold text-amber-400">{formatNumber(entry.draw)}</td>
              <td className="py-2.5 px-2 text-center text-sm font-bold text-rose-400">{formatNumber(entry.lost)}</td>
              <td className="py-2.5 px-2 text-center text-sm font-semibold text-white/65">{formatNumber(entry.goalsFor)}</td>
              <td className="py-2.5 px-2 text-center text-sm font-semibold text-white/65">{formatNumber(entry.goalsAgainst)}</td>
              <td className="py-2.5 px-2 text-center text-sm font-bold text-cyan-400">{formatNumber(entry.goalDifference)}</td>
              <td className="py-2.5 pl-2 pr-3 text-center">
                <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-lg bg-[#5ea8e8]/20 px-2 text-sm font-black text-[#5ea8e8]">
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

function LegendSection() {
  return (
    <div className="mx-4 mb-4 mt-3 rounded-2xl border border-[#5ea8e8]/15 p-4" style={{ background: 'rgba(94,168,232,0.04)' }}>
      <div className="mb-3 flex items-center gap-2">
        <Info className="h-3.5 w-3.5 text-[#5ea8e8]/70" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#5ea8e8]/70">Guia de columnas</span>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3">
        {LEGEND.map(({ code, label, color }) => (
          <div key={code} className="flex items-baseline gap-2">
            <span className={`shrink-0 w-8 text-right text-xs font-black ${color ?? 'text-white/50'}`}>{code}</span>
            <span className="text-[11px] text-white/40 leading-snug">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function StandingsModal({ open, onOpenChange }: StandingsModalProps) {
  const [mounted, setMounted] = useState(false)
  const [standings, setStandings] = useState<StandingEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showLegend, setShowLegend] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onOpenChange(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onOpenChange])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getWorldCupStandings()
        if (!cancelled) setStandings(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'No se pudo cargar la tabla.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [open])

  if (!mounted || !open) return null

  const groups = groupByLetter(standings)

  const modal = (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onOpenChange(false) }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      aria-modal="true"
      role="dialog"
      aria-label="Tabla de posiciones"
    >
      <div
        className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 text-white shadow-2xl"
        style={{
          maxHeight: 'calc(100dvh - 4rem)',
          background: 'rgba(10, 14, 22, 0.92)',
          backdropFilter: 'blur(24px) saturate(1.4)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.06)',
        }}
      >
        {/* HEADER */}
        <header
          className="flex shrink-0 items-center justify-between gap-4 px-5 py-4"
          style={{
            background: 'linear-gradient(135deg, rgba(25,70,110,0.95) 0%, rgba(15,45,75,0.9) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex items-center gap-3.5">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'rgba(94,168,232,0.18)', border: '1px solid rgba(94,168,232,0.25)' }}
            >
              <Trophy className="h-5 w-5 text-[#5ea8e8]" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">Mundial 2026</p>
              <h1 className="text-xl font-black uppercase tracking-wide text-white">Tabla de Posiciones</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="standings-legend-toggle"
              onClick={() => setShowLegend((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                showLegend
                  ? 'border-[#5ea8e8]/50 bg-[#5ea8e8]/15 text-[#5ea8e8]'
                  : 'border-white/15 bg-white/5 text-white/50 hover:text-white/80'
              }`}
              aria-pressed={showLegend}
            >
              <Info className="h-3 w-3" />
              Guia
            </button>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Cerrar"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* BODY */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">

          {showLegend && <LegendSection />}

          {loading && (
            <div className="flex h-56 items-center justify-center gap-3 text-white/50">
              <Loader2 className="h-6 w-6 animate-spin text-[#5ea8e8]" />
              <span className="text-sm font-medium">Cargando tabla...</span>
            </div>
          )}

          {!loading && error && (
            <div className="m-4 flex h-40 items-center justify-center rounded-2xl border border-dashed border-red-500/30 bg-red-500/5 px-8 text-center text-sm text-red-300">
              {error}
            </div>
          )}

          {!loading && !error && standings.length === 0 && (
            <div className="flex h-56 items-center justify-center text-sm text-white/40">
              No hay datos disponibles.
            </div>
          )}

          {!loading && !error && groups.map(([letter, rows]) => {
            const groupName = rows[0]?.groupName || `Grupo ${letter}`
            return (
              <div key={letter} className="border-b border-white/[0.06] last:border-b-0">
                <div className="flex items-center gap-3 px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.025)' }}>
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-sm font-black text-[#5ea8e8]"
                    style={{ background: 'rgba(94,168,232,0.18)', border: '1px solid rgba(94,168,232,0.25)' }}
                  >
                    {letter}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-white/60">{groupName}</span>
                  <span className="ml-auto text-[10px] font-semibold text-white/30">{rows.length} equipos</span>
                </div>
                <GroupTable rows={rows} />
              </div>
            )
          })}

          <div className="h-4" />
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
