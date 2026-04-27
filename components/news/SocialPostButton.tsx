'use client'

import { useState, useRef } from 'react'
import { Share2, Download, X, Loader2, Copy, RefreshCw, Check } from 'lucide-react'
import { getAuthToken } from '@/lib/api-client'

interface SocialPostButtonProps {
  id: string
  titulo: string
  inline?: boolean
}

const IMAGE_BASE_URL = 'https://cdn.diez.bo/diez/'

interface GeneratedPost {
  imagen: string
  imagenUrl: string      // URL CDN original
  processedUrl: string   // blob URL con sello aplicado
  link: string
  titulo: string
  formato: 'horizontal' | 'vertical'
}

export default function SocialPostButton({ id, titulo, inline = false }: SocialPostButtonProps) {
  const [open, setOpen] = useState(false)
  const [tituloEditado, setTituloEditado] = useState(titulo)
  const [post, setPost] = useState<GeneratedPost | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedImg, setCopiedImg] = useState(false)
  const [publishingFacebook, setPublishingFacebook] = useState(false)
  const [publishSuccessFacebook, setPublishSuccessFacebook] = useState(false)
  const [publishingInstagram, setPublishingInstagram] = useState(false)
  const [publishSuccessInstagram, setPublishSuccessInstagram] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function generate(tituloToUse: string) {
    setLoading(true)
    setError(null)
    try {
      const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/v1'
      const token = getAuthToken()
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      const res = await fetch(`${base}/social-post/generate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ id, tituloEditado: tituloToUse }),
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      console.log('[SocialPost] data completa:', JSON.stringify(data))

      // Construir URL pública: manager.diez.bo requiere auth → usar cdn.diez.bo/diez/
      const rawImagen: string = data.imagen ?? ''
      let imagenUrl = ''
      if (rawImagen.startsWith('http')) {
        // Extraer solo el path y construir con CDN público
        const path = new URL(rawImagen).pathname.replace(/^\/+/, '')
        imagenUrl = `${IMAGE_BASE_URL}${path}`
      } else {
        imagenUrl = `${IMAGE_BASE_URL}${rawImagen.replace(/^\/+/, '')}`
      }

      console.log('[SocialPost] imagenUrl construida:', imagenUrl)

      // Generar imagen con sello via API server-side
      const processRes = await fetch('/api/generate-social-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: imagenUrl, formato: data.formato ?? 'horizontal' }),
      })

      let processedUrl = imagenUrl
      if (processRes.ok) {
        const blob = await processRes.blob()
        processedUrl = URL.createObjectURL(blob)
      } else {
        console.warn('[SocialPost] procesamiento falló, usando imagen original')
      }

      setPost({ ...data, imagenUrl, processedUrl })
      setTituloEditado(data.titulo ?? tituloToUse)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generando imagen')
    } finally {
      setLoading(false)
    }
  }

  function handleOpen(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setOpen(true)
    setTituloEditado(titulo)
    setPost(null)
    generate(titulo)
  }

  function handleClose(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setOpen(false)
    setPost(null)
    setError(null)
  }

  function handleRegenerate() {
    generate(tituloEditado)
  }

  async function handlePublishFacebook() {
    if (!post?.processedUrl) return
    setPublishingFacebook(true)
    try {
      const response = await fetch('/api/publish/facebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: tituloEditado,
          imageUrl: post.imagenUrl,
          link: post.link,
          newsId: id,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        setError(error.error || 'Error al publicar en Facebook')
        setPublishingFacebook(false)
        return
      }

      setPublishSuccessFacebook(true)
      setTimeout(() => setPublishSuccessFacebook(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al publicar')
    } finally {
      setPublishingFacebook(false)
    }
  }

  async function handlePublishInstagram() {
    if (!post?.processedUrl) return
    setPublishingInstagram(true)
    try {
      const response = await fetch('/api/publish/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: tituloEditado,
          imageUrl: post.imagenUrl,
          link: post.link,
          newsId: id,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        setError(error.error || 'Error al publicar en Instagram')
        setPublishingInstagram(false)
        return
      }

      setPublishSuccessInstagram(true)
      setTimeout(() => setPublishSuccessInstagram(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al publicar')
    } finally {
      setPublishingInstagram(false)
    }
  }

  function handleDownload() {
    if (!post?.processedUrl) return
    const a = document.createElement('a')
    a.href = post.processedUrl
    a.download = `post-${id}.jpg`
    a.click()
  }

  async function handleCopyImage() {
    if (!post?.processedUrl) return
    try {
      const res = await fetch(post.processedUrl)
      const blob = await res.blob()
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopiedImg(true)
      setTimeout(() => setCopiedImg(false), 2000)
    } catch {
      handleDownload()
    }
  }


  const isHorizontal = post?.formato !== 'vertical'

  return (
    <>
      {inline ? (
        <button
          onClick={handleOpen}
          className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 text-sm font-bold rounded hover:opacity-90 transition-opacity"
        >
          <Share2 className="w-4 h-4" />
          Generar imagen para redes
        </button>
      ) : (
        <button
          onClick={handleOpen}
          title="Generar imagen para redes sociales"
          className="absolute top-2 right-2 z-10 p-1.5 bg-black/60 hover:bg-accent hover:text-accent-foreground text-white rounded transition-all opacity-0 group-hover:opacity-100"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={handleClose}
        >
          <div
            className="bg-[#0d1a2e] border border-[#162032] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#162032]">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-accent" />
                <h2 className="font-bold text-white text-sm">Generador de Post para Redes</h2>
              </div>
              <button onClick={handleClose} className="text-muted-foreground hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-5">
              {/* Editar título */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Título</label>
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    value={tituloEditado}
                    onChange={(e) => setTituloEditado(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRegenerate()}
                    className="flex-1 bg-[#162032] border border-[#1e3048] text-white text-sm px-3 py-2 rounded outline-none focus:border-accent transition-colors"
                    placeholder="Editar título..."
                  />
                  <button
                    onClick={handleRegenerate}
                    disabled={loading}
                    title="Regenerar"
                    className="px-3 py-2 bg-accent text-accent-foreground rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className={`relative w-full overflow-hidden rounded-lg bg-[#162032] ${isHorizontal ? 'aspect-[1200/628]' : 'aspect-[1080/1350] max-w-xs mx-auto'}`}>
                {loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                    <span className="text-sm text-muted-foreground">Generando imagen...</span>
                  </div>
                )}
                {error && !loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
                    <p className="text-destructive text-sm text-center">{error}</p>
                    <button onClick={handleRegenerate} className="text-xs text-accent hover:underline">Reintentar</button>
                  </div>
                )}
                {post && !loading && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.processedUrl}
                    alt={post.titulo}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Botones */}
              {post && !loading && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleDownload}
                      className="flex items-center justify-center gap-2 bg-accent text-accent-foreground font-bold py-2.5 rounded hover:opacity-90 transition-opacity text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Descargar imagen
                    </button>
                    <button
                      onClick={handleCopyImage}
                      className="flex items-center justify-center gap-2 bg-[#162032] border border-[#1e3048] text-white font-semibold py-2.5 rounded hover:border-accent transition-colors text-sm"
                    >
                      {copiedImg ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      {copiedImg ? 'Copiada!' : 'Copiar imagen'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handlePublishFacebook}
                      disabled={publishingFacebook}
                      className="flex items-center justify-center gap-2 bg-[#1877f2] text-white font-bold py-2.5 rounded hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                    >
                      {publishingFacebook ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Publicando...
                        </>
                      ) : publishSuccessFacebook ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" />
                          ¡Publicado!
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" />
                          Facebook
                        </>
                      )}
                    </button>

                    {/* TODO: Habilitar Instagram  */}
                    {/* <button
                      onClick={handlePublishInstagram}
                      disabled={publishingInstagram}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888] text-white font-bold py-2.5 rounded hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                    >
                      {publishingInstagram ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Publicando...
                        </>
                      ) : publishSuccessInstagram ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" />
                          ¡Publicado!
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" />
                          Instagram
                        </>
                      )}
                    </button> */}
                  </div>

                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
