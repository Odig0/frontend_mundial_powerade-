'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  radius: number
  opacity: number
  twinkleSpeed: number
  twinkleOffset: number
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let stars: Star[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars()
    }

    const initStars = () => {
      // Más estrellas en general (divisor más bajo = más densidad)
      const count = Math.floor((canvas.width * canvas.height) / 2200)

      const makestar = (forceSide = false): Star => {
        let x: number
        const sideWidth = canvas.width * 0.16 // 16% a cada lado

        if (forceSide) {
          // Coloca la estrella exclusivamente en franja izquierda o derecha
          x = Math.random() < 0.5
            ? Math.random() * sideWidth                            // franja izquierda
            : canvas.width - Math.random() * sideWidth            // franja derecha
        } else {
          x = Math.random() * canvas.width
        }

        return {
          x,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.3 + 0.2,
          opacity: forceSide
            ? Math.random() * 0.4 + 0.45   // estrellas laterales un poco más brillantes
            : Math.random() * 0.5 + 0.25,
          twinkleSpeed: Math.random() * 0.008 + 0.002,
          twinkleOffset: Math.random() * Math.PI * 2,
        }
      }

      // Estrellas globales + refuerzo lateral (30% extra solo en los lados)
      const sideExtra = Math.floor(count * 0.35)
      stars = [
        ...Array.from({ length: count }, () => makestar(false)),
        ...Array.from({ length: sideExtra }, () => makestar(true)),
      ]
    }


    let frame = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      for (const star of stars) {
        // Gentle twinkle: oscillate opacity
        const twinkle =
          star.opacity +
          Math.sin(frame * star.twinkleSpeed + star.twinkleOffset) * 0.2

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, twinkle))})`
        ctx.fill()
      }

      animationId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        backgroundColor: '#08111f',
      }}
    />
  )
}
