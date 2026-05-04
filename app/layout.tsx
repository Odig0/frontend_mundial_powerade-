import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Powerade - El Deber Deportes',
  description: 'Cobertura completa del Mundial 2026: partidos, selecciones, noticias, videos y análisis deportivos.',
  generator: 'v0.app',
  keywords: ['mundial 2026', 'fútbol', 'deportes', 'noticias', 'videos'],
  icons: {
    icon: [
      {
        url: 'https://mediakit.eldeber.com.bo/images/eldeber_logo_white.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Powerade - El Deber Deportes',
    description: 'Cobertura completa del Mundial 2026: partidos, selecciones, noticias, videos y análisis deportivos.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'El Deber Deportes',
    images: [
      {
        url: 'https://mediakit.eldeber.com.bo/images/eldeber_logo_white.png',
        width: 1200,
        height: 630,
        alt: 'El Deber Deportes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Powerade - El Deber Deportes',
    description: 'Cobertura completa del Mundial 2026: partidos, selecciones, noticias, videos y análisis deportivos.',
    images: ['https://mediakit.eldeber.com.bo/images/eldeber_logo_white.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <div className="flex min-h-screen">

          {/* Skyscraper izquierdo */}
          <aside className="hidden 2xl:block w-[190px] flex-shrink-0 bg-background" />

          {/* Contenido principal */}
          <div className="flex-1 min-w-0">
            {children}
          </div>

          {/* Skyscraper derecho */}
          <aside className="hidden 2xl:block w-[140px] flex-shrink-0 bg-background" />

        </div>

      </body>
    </html>
  )
}
