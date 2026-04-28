import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const FORMATS = {
  horizontal: { width: 1200, height: 628, sello: 'Tribuna-Powerade.png' },
  vertical: { width: 1080, height: 1350, sello: 'Tribuna-Powerade.png' },
  instagram: { width: 1080, height: 1350, sello: 'Tribuna-Powerade.png' },
}

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, formato = 'instagram' } = await request.json()

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
    // Primero redimensionar, luego aplicar sello
    let imageProcessing = sharp(imgBuffer)
      .resize(fmt.width, fmt.height, { 
        fit: 'cover', 
        position: 'center',
        withoutEnlargement: false 
      })

    // Aplicar composite con sello
    const result = await imageProcessing
      .composite([
        {
          input: selloResized,
          gravity: 'southwest',
          blend: 'over',
        },
      ])
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
