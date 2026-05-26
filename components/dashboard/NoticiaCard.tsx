'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronDown, Edit3 } from 'lucide-react'
import type { NewsItem } from '@/lib/news-types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { usePublishedPosts } from '@/hooks/use-published-posts'
import { useToast } from '@/hooks/use-toast'
import SocialPostButton from '@/components/news/SocialPostButton'
import { formatSectionLabel, updateNewsSections, assignPosicionPortada } from '@/lib/news-client'

const ALLOWED_SECTION_OPTIONS = [
  { value: 'mundial-2026', label: 'Mundial 2026' },
  { value: 'fuera-de-juego', label: 'Fuera de juego' },
]

function normalizeSectionValue(section: string) {
  const value = section.trim().toLowerCase()


  if (value === 'mundial' || value === 'mundial-2026') {
    return 'mundial-2026'
  }

  if (value === 'fuera de juego' || value === 'fueradejuego' || value === 'fuera-de-juego') {
    return 'fuera-de-juego'
  }

  return value
}

interface NoticiaCardProps {
  news: NewsItem
  availableSections?: string[]
}

export default function NoticiaCard({ news, availableSections = [] }: NoticiaCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { isPublished, togglePublished, isLoaded } = usePublishedPosts()
  const publicada = isPublished(news._id)
  const seccion = news.secciones?.[0] ?? 'general'
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [positionDialogOpen, setPositionDialogOpen] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)
  const [savingPosition, setSavingPosition] = useState(false)
  // Initialize with the current sections, normalizing legacy values to the new API slugs
  const [selectedSections, setSelectedSections] = useState<string[]>(() =>
    (news.secciones ?? [])
      .flatMap((s) => s.split(',').map((x) => normalizeSectionValue(x)))
      .filter((section): section is string => ALLOWED_SECTION_OPTIONS.some((option) => option.value === section))
  )
  const [savingSection, setSavingSection] = useState(false)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const selectedSectionLabels = useMemo(
    () => selectedSections.map((section) => ALLOWED_SECTION_OPTIONS.find((option) => option.value === section)?.label ?? formatSectionLabel(section)),
    [selectedSections]
  )

  function toggleSection(section: string) {
    setSelectedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }

  async function handleUpdateSection() {
    if (selectedSections.length === 0) {
      toast({
        title: 'Sección requerida',
        description: 'Selecciona al menos una sección antes de guardar.',
        variant: 'destructive',
      })
      return
    }

    setSavingSection(true)
    try {
      await updateNewsSections(news._id, selectedSections)
      toast({
        title: 'Secciones actualizadas',
        description: `${news.titulo} → ${selectedSectionLabels.join(', ')}.`,
      })
      setDialogOpen(false)
      router.refresh()
    } catch (error) {
      toast({
        title: 'No se pudo actualizar',
        description: error instanceof Error ? error.message : 'Revisa el endpoint de actualización de secciones.',
        variant: 'destructive',
      })
    } finally {
      setSavingSection(false)
    }
  }

  async function handleAssignPosition() {
    if (!selectedPosition) {
      toast({
        title: 'Posición requerida',
        description: 'Selecciona una posición entre 1 y 5 antes de guardar.',
        variant: 'destructive',
      })
      return
    }

    setSavingPosition(true)
    try {
      await assignPosicionPortada(news._id, selectedPosition)
      toast({
        title: 'Orden en portada actualizado',
        description: `${news.titulo} → posición ${selectedPosition}.`,
      })
      setPositionDialogOpen(false)
      router.refresh()
    } catch (error) {
      toast({
        title: 'No se pudo actualizar',
        description: error instanceof Error ? error.message : 'Revisa el endpoint de posición en portada.',
        variant: 'destructive',
      })
    } finally {
      setSavingPosition(false)
    }
  }

  return (
    <>
      <div className="db-card">
        {/* Image Container */}
        <div className="db-card-img-wrap">
          <Image
            src={news.imagen_home}
            alt={news.titulo}
            fill
            className="object-cover transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, 240px"
          />

          {/* Badge - Published */}
          {publicada && (
            <span className="db-badge-published">Publicada</span>
          )}

          {/* Badge - Section */}
          <span className="db-badge-section capitalize">{seccion}</span>
        </div>

        {/* Content */}
        <div className="db-card-body">
          {/* Title */}
          <h3 className="db-card-title">{news.titulo}</h3>

          {/* Date */}
          {news.fecha_a && (
            <p className="db-card-date">
              {new Date(news.fecha_a).toLocaleDateString('es-BO', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          )}

          {/* Actions */}
          <div className="db-card-actions">
            {/* Generate Image Button */}
            <SocialPostButton id={news._id} titulo={news.titulo} inline className="w-full justify-center" />

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-center"
              onClick={() => {
                setSelectedSections(
                  (news.secciones ?? []).flatMap((s) => s.split(',').map((x) => x.trim())).filter(Boolean)
                )
                setDialogOpen(true)
              }}
              disabled={ALLOWED_SECTION_OPTIONS.length === 0}
            >
              <Edit3 className="h-4 w-4" />
              Actualizar sección
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-center"
              onClick={() => {
                setSelectedPosition(null)
                setPositionDialogOpen(true)
              }}
            >
              <Edit3 className="h-4 w-4" />
              Orden en portada
            </Button>

            {/* Publicar / despublicar oculto temporalmente en la UI */}
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar sección</DialogTitle>
            <DialogDescription>
              Cambia la sección principal de esta noticia y se mostrara en la sección correspondiente del sitio.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Secciones</label>
            {/* Custom multi-select dropdown — same look as native select */}
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className="w-full flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              >
                <span className="truncate">
                  {selectedSections.length > 0
                      ? selectedSectionLabels.join(', ')
                    : 'Seleccionar sección...'}
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 ml-2 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <ul className="absolute z-50 mt-1 w-full rounded-md border border-border bg-background shadow-lg overflow-hidden">
                    {ALLOWED_SECTION_OPTIONS.map((section) => {
                      const active = selectedSections.includes(section.value)
                    return (
                      <li
                          key={section.value}
                          onClick={() => toggleSection(section.value)}
                        className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                          active
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-muted text-foreground'
                        }`}
                      >
                          {section.label}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={savingSection}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateSection} disabled={savingSection}>
              {savingSection ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={positionDialogOpen} onOpenChange={setPositionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Orden en portada</DialogTitle>
            <DialogDescription>
              Selecciona una sola posición del 1 al 5. Si otra noticia ya ocupa esa posición, se moverá automáticamente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Posición</label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((position) => {
                const active = selectedPosition === position
                return (
                  <button
                    key={position}
                    type="button"
                    onClick={() => setSelectedPosition(position)}
                    className={`rounded-md border px-3 py-3 text-sm font-semibold transition-colors ${
                      active
                        ? 'border-accent bg-accent text-accent-foreground'
                        : 'border-border bg-background text-foreground hover:border-accent'
                    }`}
                  >
                    {position}
                  </button>
                )
              })}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPositionDialogOpen(false)} disabled={savingPosition}>
              Cancelar
            </Button>
            <Button onClick={handleAssignPosition} disabled={savingPosition || selectedPosition === null}>
              {savingPosition ? 'Guardando...' : 'Guardar posición'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
