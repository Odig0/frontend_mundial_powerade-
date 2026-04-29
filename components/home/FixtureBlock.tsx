'use client'

import { useState, useMemo } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { partidos } from '@/data/fixtures'

export default function FixtureBlock() {
  const [page, setPage] = useState(0)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const itemsPerPage = 6

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-')
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    const monthIndex = parseInt(month) - 1
    return `${day} de ${months[monthIndex]}`
  }

  // Obtener grupos únicos
  const groups = useMemo(() => {
    const uniqueGroups = Array.from(new Set(partidos.map(p => p.group))).sort()
    return uniqueGroups
  }, [])

  // Filtrar partidos por grupo seleccionado
  const filteredMatches = useMemo(() => {
    if (!selectedGroup) return partidos
    return partidos.filter(p => p.group === selectedGroup)
  }, [selectedGroup])

  const totalPages = Math.ceil(filteredMatches.length / itemsPerPage)
  const start = page * itemsPerPage
  const end = start + itemsPerPage
  const currentMatches = filteredMatches.slice(start, end)

  const handleNext = () => {
    if (page < totalPages - 1) {
      setPage(page + 1)
    }
  }

  const handlePrev = () => {
    if (page > 0) {
      setPage(page - 1)
    }
  }

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedGroup(value === 'TODOS' ? null : value)
    setPage(0)
  }

  return (
    <div
      id="partidos"
      className="flex flex-col h-full"
      style={{ scrollMarginTop: '88px' }}
    >
      <div className="bg-accent text-accent-foreground px-4 py-2 text-center font-bold text-sm uppercase tracking-wider flex items-center justify-between">
        <span>Fixture del mundial</span>
        <span className="text-[10px] font-semibold opacity-80">
          {page + 1} / {totalPages}
        </span>
      </div>

      <div className="border-b border-white/8 bg-background/50 px-3 py-2 md:px-4">
        <select
          value={selectedGroup || 'TODOS'}
          onChange={handleGroupChange}
          className="w-full rounded-lg border-2 border-accent bg-slate-950 px-3 py-2 text-xs font-bold text-accent uppercase tracking-wider hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer"
        >
          <option value="TODOS">Todos los grupos</option>
          {groups.map(group => (
            <option key={group} value={group}>
              Grupo {group}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3 flex-1 bg-card p-3 md:p-4 overflow-y-auto">
        {currentMatches.length > 0 ? (
          currentMatches.map((partido) => (
            <article
              key={`${partido.date}-${partido.time}-${partido.homeTeam}-${partido.awayTeam}`}
              className="rounded-2xl border border-white/8 bg-background/70 p-4 shadow-sm shadow-black/10"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-accent font-bold uppercase tracking-wider">
                  <span>{formatDate(partido.date)}</span>
                  <span>|</span>
                  <span>{partido.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-accent">
                    Grupo {partido.group}
                  </span>
                  <span className="text-[10px] text-white/30">|</span>
                  <span className="text-[10px] text-muted-foreground uppercase">
                    {partido.city}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base md:text-lg font-black text-foreground">
                    {partido.homeTeam}
                  </p>
                </div>

                <div className="shrink-0 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-black text-foreground">
                  VS
                </div>

                <div className="min-w-0 flex-1 text-right">
                  <p className="truncate text-base md:text-lg font-black text-foreground">
                    {partido.awayTeam}
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-xl bg-white/5 px-3 py-2">
                <p className="text-xs text-muted-foreground truncate">
                  {partido.stadium}
                </p>
              </div>
            </article>
          ))
        ) : (
          <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
            No hay partidos en este grupo
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-white/8 bg-background/50 px-3 py-3 md:px-4">
        <button
          onClick={handlePrev}
          disabled={page === 0}
          className="flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-white/10 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Anterior</span>
        </button>

        <button
          onClick={handleNext}
          disabled={page >= totalPages - 1}
          className="flex items-center justify-center gap-1 rounded-lg bg-accent text-accent-foreground px-3 py-2 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:opacity-90 transition-opacity"
        >
          <span>Siguiente</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
