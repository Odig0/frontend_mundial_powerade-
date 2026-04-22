import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const FORMATS = {
  horizontal: { width: 1200, height: 628, sello: 'EDSPORTS.png' },
  vertical: { width: 1080, height: 1350, sello: '2EDSPORTS.png' },
}

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, formato = 'horizontal' } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: 'Missing imageUrl' }, { status: 400 })
    }

    const fmt = FORMATS[formato as keyof typeof FORMATS] ?? FORMATS.horizontal

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

    // Procesar imagen principal + composite del sello en esquina inferior izquierda
    const result = await sharp(imgBuffer)
      .resize(fmt.width, fmt.height, { fit: 'cover', position: 'centre' })
      .composite([
        {
          input: selloResized,
          gravity: 'southwest',
          blend: 'over',
        },
      ])
      .jpeg({ quality: 85 })
      .toBuffer()

    return new NextResponse(result, {
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
