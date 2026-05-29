import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Selecciones ',
  description: 'Todas las selecciones participantes en el Mundial 2026.',
  openGraph: {
    title: 'Selecciones',
    description: 'Todas las selecciones participantes en el Mundial 2026.',
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
    description: 'Todas las selecciones participantes en el Mundial 2026.',
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