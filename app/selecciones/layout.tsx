import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Selecciones ',
  description: 'Las 48 selecciones participantes. Haz clic para ver los jugadores.',
  openGraph: {
    title: 'Selecciones',
    description: 'Las 48 selecciones participantes. Haz clic para ver los jugadores.',
    type: 'website',
    locale: 'es_ES',
    siteName: '',
    images: [
      {
        url: '/selecciones_banderas.png',
        width: 1200,
        height: 630,
        alt: 'Selecciones ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Selecciones',
    description: 'Las 48 selecciones participantes. Haz clic para ver los jugadores.',
    images: ['/selecciones_banderas.png'],
  },
}

export default function SeleccionesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}