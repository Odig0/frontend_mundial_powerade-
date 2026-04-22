import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Powerade',
  description: 'partidos',
  generator: 'v0.app',
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
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
