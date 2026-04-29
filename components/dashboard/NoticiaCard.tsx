'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronDown, Edit3 } from 'lucide-react'
import { NewsItem } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
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
import PublishToggle from './PublishToggle'
import { formatSectionLabel, updateNewsSections } from '@/lib/api'

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
  // Initialize with the current sections, splitting any comma-joined strings
  const [selectedSections, setSelectedSections] = useState<string[]>(() =>
    (news.secciones ?? []).flatMap((s) => s.split(',').map((x) => x.trim())).filter(Boolean)
  )
  const [savingSection, setSavingSection] = useState(false)
  const safeAvailableSections = Array.isArray(availableSections) ? availableSections : []

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

  // Split any combined "Section A, Section B" entries into individual flat options
  const sectionOptions = useMemo(() => {
    const current = (news.secciones ?? []).flatMap((s) => s.split(',').map((x) => x.trim()))
    const available = safeAvailableSections.flatMap((s) => s.split(',').map((x) => x.trim()))
    return Array.from(new Set([...current, ...available])).filter(Boolean).sort()
  }, [safeAvailableSections, news.secciones])

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
        description: `${news.titulo} → ${selectedSections.join(', ')}.`,
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

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-accent hover:shadow-lg lg:flex-row">
        {/* Image Container */}
        <div className="relative w-full overflow-hidden bg-muted aspect-video lg:w-[420px] lg:shrink-0 lg:aspect-auto">
          <Image
            src={news.imagen_home}
            alt={news.titulo}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Badge - Published */}
          {publicada && (
            <Badge className="absolute top-2 right-2 bg-green-500/90 text-white">
              Publicada
            </Badge>
          )}

          {/* Badge - Section */}
          <Badge variant="secondary" className="absolute top-2 left-2 capitalize">
            {seccion}
          </Badge>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-3 gap-3 lg:p-4">
          {/* Title */}
          <div className="min-h-[2.5rem]">
            <h3 className="font-semibold text-sm leading-snug text-foreground line-clamp-2 group-hover:text-accent transition-colors">
              {news.titulo}
            </h3>
          </div>

          {/* Date */}
          {news.fecha_a && (
            <p className="text-xs text-muted-foreground">
              {new Date(news.fecha_a).toLocaleDateString('es-BO', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          )}

          {/* Actions */}
          <div className="mt-auto flex flex-col items-stretch gap-2 pt-2 border-t border-border/50">
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
              disabled={sectionOptions.length === 0}
            >
              <Edit3 className="h-4 w-4" />
              Actualizar sección
            </Button>

            {/* Publish Toggle */}
            {isLoaded ? (
              <PublishToggle
                isPublished={publicada}
                onToggle={() => togglePublished(news._id)}
                className="w-full"
              />
            ) : (
              <Skeleton className="h-9 w-full rounded-md" />
            )}
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar sección</DialogTitle>
            <DialogDescription>
              Cambia la sección principal de esta noticia y guarda el ajuste en la base de datos.
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
                    ? selectedSections.map(formatSectionLabel).join(', ')
                    : 'Seleccionar sección...'}
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 ml-2 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <ul className="absolute z-50 mt-1 w-full rounded-md border border-border bg-background shadow-lg overflow-hidden">
                  {sectionOptions.map((section) => {
                    const active = selectedSections.includes(section)
                    return (
                      <li
                        key={section}
                        onClick={() => toggleSection(section)}
                        className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                          active
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-muted text-foreground'
                        }`}
                      >
                        {formatSectionLabel(section)}
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
            <Button onClick={handleUpdateSection} disabled={savingSection || selectedSections.length === 0}>
              {savingSection ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
