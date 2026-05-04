import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Powerade - El Deber Deportes',
  description: 'Cobertura completa del Mundial 2026: partidos, selecciones, noticias, videos y análisis deportivos.',
  keywords: ['mundial 2026', 'fútbol', 'deportes', 'noticias', 'videos'],
  metadataBase: new URL('https://dev.eldeber.bo'),
  icons: {
    icon: [
      {
        url: '/logo_deber.jpg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logo_deber.jpg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/logo_deber.jpg',
        type: 'image/jpeg',
      },
    ],
    apple: '/logo_deber.jpg',
  },
  openGraph: {
    title: 'Powerade - El Deber Deportes',
    description: 'Cobertura completa del Mundial 2026: partidos, selecciones, noticias, videos y análisis deportivos.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'El Deber Deportes',
    images: [
      {
        url: '/tribuna_powerade.png',
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
    images: ['/tribuna_powerade.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background" suppressHydrationWarning>
      <head>
        {/* Google Publisher Tag (GPT) */}
        <Script
          src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
          strategy="beforeInteractive"
        />
        <Script id="gpt-init" strategy="beforeInteractive">
          {`
            window.googletag = window.googletag || { cmd: [] };
            window.googletag.cmd.push(function() {
              window.googletag.setConfig({ singleRequest: true });
              window.googletag.enableServices();
            });
          `}
        </Script>
      </head>

      <body className="font-sans antialiased">
        <div className="min-h-screen">
          {children}
        </div>

        {/* Analytics */}
        <Analytics />
      </body>
    </html>
  )
}