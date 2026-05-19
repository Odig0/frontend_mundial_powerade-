import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import StarField from '@/components/layout/StarField'
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
        url: '/logo_powerade.jpg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logo_powerade.jpg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/logo_powerade.jpg',
        type: 'image/jpeg',
      },
    ],
    apple: '/logo_powerade.jpg',
  },
  openGraph: {
    title: 'Powerade - El Deber Deportes',
    description: 'Cobertura completa del Mundial 2026: partidos, selecciones, noticias, videos y análisis deportivos.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'El Deber Deportes',
    images: [
      {
        url: '/logo_powerade.jpg',
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
    images: ['/logo_powerade.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>

      
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="beforeInteractive">
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),
                  dl=l!='dataLayer' ? '&l='+l : '';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id=' + i + dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-THW4SR2G');
          `}
        </Script>
        {/* End Google Tag Manager */}

        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-G65015HTHP"
          strategy="afterInteractive"
        />
        <Script id="gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-G65015HTHP');
          `}
        </Script>
        {/* End Google Analytics */}

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
        {/* Starfield background — fixed canvas, z-index:0, pointer-events:none */}
        <StarField />

        {/* Page content — z-index:1 so it renders above the starfield canvas */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>

        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-THW4SR2G"
            height="0" 
            width="0" 
            style={{display:'none',visibility:'hidden'}}
          >
          </iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {/* Analytics final */}
        <Analytics />
      </body>
    </html>
  )
}