import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const FORMATS = {
  horizontal: { width: 1200, height: 628, sello: 'Tribuna-Powerade.png' },
  vertical: { width: 1080, height: 1350, sello: 'Tribuna-Powerade.png' },
  instagram: { width: 1080, height: 1350, sello: 'Tribuna-Powerade.png' },
}

function wrapText(text: string, maxWidth: number = 50): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    if ((currentLine + word).length > maxWidth) {
      if (currentLine) lines.push(currentLine.trim())
      currentLine = word
    } else {
      currentLine += (currentLine ? ' ' : '') + word
    }
  }
  if (currentLine) lines.push(currentLine.trim())
  return lines
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, formato = 'instagram', titulo = '', fecha = '' } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: 'Missing imageUrl' }, { status: 400 })
    }

    const fmt = FORMATS[formato as keyof typeof FORMATS] ?? FORMATS.instagram

    // Fetch imagen desde CDN
    const imgRes = await fetch(imageUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      redirect: 'follow',
    })
    if (!imgRes.ok) throw new Error(`Error fetching image: ${imgRes.status}`)
    const imgBuffer = Buffer.from(await imgRes.arrayBuffer())

    // Cargar sello desde /public/sello/
    const selloPath = path.join(process.cwd(), 'public', 'sello', fmt.sello)
    if (!fs.existsSync(selloPath)) throw new Error(`Sello not found: ${selloPath}`)
    const selloBuffer = fs.readFileSync(selloPath)

    // Obtener dimensiones del sello
    const selloMeta = await sharp(selloBuffer).metadata()
    const selloW = selloMeta.width ?? 400
    const selloH = selloMeta.height ?? 200

    // Redimensionar sello al 40% del ancho de la imagen
    const targetSelloW = Math.round(fmt.width * 0.4)
    const targetSelloH = Math.round((selloH / selloW) * targetSelloW)

    const selloResized = await sharp(selloBuffer)
      .resize(targetSelloW, targetSelloH, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()

    // Procesar imagen principal: redimensionar EXACTAMENTE a fmt.width x fmt.height
    let imageProcessing = sharp(imgBuffer)
      .resize(fmt.width, fmt.height, { 
        fit: 'cover', 
        position: 'center',
        withoutEnlargement: false 
      })

    // Preparar overlays (composites)
    const overlays: Array<any> = []

    // Crear SVG con la fecha (esquina superior derecha)
    if (fecha) {
      const fechaSvg = `
        <svg width="${fmt.width}" height="${fmt.height}" xmlns="http://www.w3.org/2000/svg">
          <text 
            x="${fmt.width - 30}" 
            y="50" 
            font-family="Arial, sans-serif" 
            font-size="40" 
            font-weight="bold"
            fill="white"
            text-anchor="end"
            letter-spacing="1"
          >${fecha}</text>
        </svg>
      `.trim()
      
      const fechaBuffer = Buffer.from(fechaSvg)
      overlays.push({
        input: await sharp(fechaBuffer).png().toBuffer(),
        gravity: 'northeast'
      })
    }

    // Crear SVG con el título
    if (titulo) {
      const titleFontSize = 60
      const lineHeight = 62
      const padding = 24
      // El bloque de texto usa 2/3 del ancho de la imagen para forzar saltos de línea más naturales.
      const titleBoxWidth = Math.round(fmt.width * 0.80)
      const approxCharWidth = titleFontSize * 0.55
      const maxCharsPerLine = Math.max(12, Math.floor((titleBoxWidth - padding * 2) / approxCharWidth))
      const lines = wrapText(titulo, maxCharsPerLine)
      const titleOffsetY = 16
      const textHeight = lines.length * lineHeight + padding * 2
      const svgHeight = Math.min(textHeight, Math.round(fmt.height * 0.20))
      
      let textY = padding + 32 + titleOffsetY
      let textElements = lines
        .map((line) => {
          const y = textY
          textY += lineHeight
          return `<tspan x="${padding}" dy="${y === padding + 32 + titleOffsetY ? 0 : lineHeight}">${escapeXml(line)}</tspan>`
        })
        .join('\n')

      // Generamos solo el texto (sin rectángulo de fondo). Añadimos un trazo oscuro para mantener legibilidad
      const tituloSvg = `
        <svg width="${titleBoxWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
          <style>
            .title { font-family: 'Georgia', 'Times New Roman', serif; font-weight:700; font-size: ${titleFontSize}px; fill:#ffffff; stroke:#000000; stroke-opacity:0.6; stroke-width:6; paint-order:stroke; stroke-linejoin:round; }
            tspan { display:block; }
          </style>
          <text class="title" x="${padding}" y="${padding + 24 + titleOffsetY}">
            ${textElements}
          </text>
        </svg>
      `.trim()

      const tituloBuffer = Buffer.from(tituloSvg)
      // Control vertical del marco (px desde el tope). Ajusta `titleFrameTop` para mover el marco arriba/abajo.
      const titleFrameTop = Math.max(0, Math.round(fmt.height * 0.70))
      overlays.push({
        input: await sharp(tituloBuffer)
          .resize(titleBoxWidth, svgHeight, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer(),
        top: titleFrameTop,
        left: Math.round(fmt.width * 0.03)
      })
    }

    // Agregar sello
    overlays.push({
      input: selloResized,
      gravity: 'southwest'
    })

    // Aplicar todos los composites
    const result = await imageProcessing
      .composite(overlays)
      .toFormat('jpeg', { quality: 85, mozjpeg: true })
      .toBuffer()

    // Validar que la imagen tenga las dimensiones correctas
    const resultMeta = await sharp(result).metadata()
    console.log(`[generate-social-image] Imagen final: ${resultMeta.width}x${resultMeta.height}`)
    
    if (resultMeta.width !== fmt.width || resultMeta.height !== fmt.height) {
      throw new Error(`Tamaño final incorrecto: ${resultMeta.width}x${resultMeta.height}, esperado ${fmt.width}x${fmt.height}`)
    }

    return new NextResponse(new Uint8Array(result), {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (err) {
    console.error('[generate-social-image] error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
