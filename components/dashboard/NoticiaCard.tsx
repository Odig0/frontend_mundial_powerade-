'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Edit3 } from 'lucide-react'
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
  const [selectedSection, setSelectedSection] = useState(seccion)
  const [savingSection, setSavingSection] = useState(false)
  const safeAvailableSections = Array.isArray(availableSections) ? availableSections : []

  const sectionOptions = useMemo(() => {
    const current = news.secciones ?? []
    return Array.from(new Set([...current, ...safeAvailableSections])).filter(Boolean)
  }, [safeAvailableSections, news.secciones])

  async function handleUpdateSection() {
    if (!selectedSection) {
      toast({
        title: 'Sección requerida',
        description: 'Selecciona una sección antes de guardar.',
        variant: 'destructive',
      })
      return
    }

    setSavingSection(true)
    try {
      await updateNewsSections(news._id, [selectedSection])
      toast({
        title: 'Sección actualizada',
        description: `${news.titulo} ahora queda en ${selectedSection}.`,
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
                setSelectedSection(seccion)
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
            <label className="text-sm font-medium text-foreground">Sección</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            >
              {sectionOptions.map((section) => (
                <option key={section} value={section}>
                  {formatSectionLabel(section)}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={savingSection}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateSection} disabled={savingSection || !selectedSection}>
              {savingSection ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
