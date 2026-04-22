'use client'

import { useState, useRef } from 'react'
import { Share2, Download, X, Loader2, Copy, RefreshCw, Check, Link2 } from 'lucide-react'

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

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}
function TwitterXIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="var(--background)" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="var(--background)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.532 5.847L.057 23.5l5.764-1.513A11.938 11.938 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 0 1-5.04-1.378l-.36-.214-3.733.98.998-3.648-.235-.374A9.86 9.86 0 0 1 2.1 12c0-5.463 4.437-9.9 9.9-9.9 5.464 0 9.9 4.437 9.9 9.9 0 5.464-4.436 9.9-9.9 9.9z" />
    </svg>
  )
}

export default function SocialPostButton({ id, titulo, inline = false }: SocialPostButtonProps) {
  const [open, setOpen] = useState(false)
  const [tituloEditado, setTituloEditado] = useState(titulo)
  const [post, setPost] = useState<GeneratedPost | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [copiedImg, setCopiedImg] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function generate(tituloToUse: string) {
    setLoading(true)
    setError(null)
    try {
      const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/v1'
      const res = await fetch(`${base}/social-post/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  function handleDownload() {
    if (!post?.processedUrl) return
    const a = document.createElement('a')
    a.href = post.processedUrl
    a.download = `post-${id}.jpg`
    a.click()
  }

  async function handleCopyLink() {
    if (!post?.link) return
    await navigator.clipboard.writeText(post.link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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

  function shareUrl(platform: string) {
    if (!post) return
    const url = encodeURIComponent(post.link)
    const text = encodeURIComponent(tituloEditado)
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://api.whatsapp.com/send?text=${text}%20${url}`,
    }
    window.open(urls[platform], '_blank', 'width=600,height=500')
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

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[#162032]" />
                    <span className="text-xs text-muted-foreground">Compartir enlace</span>
                    <div className="flex-1 h-px bg-[#162032]" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => shareUrl('facebook')} className="flex items-center justify-center gap-2 bg-[#1877f2] text-white font-semibold py-2.5 rounded hover:opacity-90 text-sm">
                      <FacebookIcon />Facebook
                    </button>
                    <button onClick={() => shareUrl('twitter')} className="flex items-center justify-center gap-2 bg-black border border-white/20 text-white font-semibold py-2.5 rounded hover:opacity-90 text-sm">
                      <TwitterXIcon />Twitter / X
                    </button>
                    <button onClick={handleCopyImage} className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888] text-white font-semibold py-2.5 rounded hover:opacity-90 text-sm">
                      <InstagramIcon />
                      {copiedImg ? 'Imagen copiada!' : 'Instagram (copiar)'}
                    </button>
                    <button onClick={() => shareUrl('linkedin')} className="flex items-center justify-center gap-2 bg-[#0a66c2] text-white font-semibold py-2.5 rounded hover:opacity-90 text-sm">
                      <LinkedInIcon />LinkedIn
                    </button>
                    <button onClick={() => shareUrl('whatsapp')} className="flex items-center justify-center gap-2 bg-[#25d366] text-white font-semibold py-2.5 rounded hover:opacity-90 text-sm col-span-2">
                      <WhatsAppIcon />WhatsApp
                    </button>
                  </div>

                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 bg-[#162032] border border-[#1e3048] text-muted-foreground hover:text-white hover:border-accent font-semibold py-2 rounded transition-colors text-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Link2 className="w-3.5 h-3.5" />}
                    {copied ? '¡Enlace copiado!' : post.link}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
