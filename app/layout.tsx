import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import PageTransition from '@/components/layout/PageTransition'
import { initializeScheduledJobs } from '@/lib/scheduler'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Powerade',
  description: 'Cobertura completa del Mundial 2026: partidos, selecciones, noticias, videos y análisis deportivos.',
  keywords: ['mundial 2026', 'fútbol', 'deportes', 'noticias', 'videos'],
  metadataBase: new URL('https://tribuna.diez.bo'),
  icons: {
    icon: [
      {
        url: '/gfi.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/powerade_black.jpg',
      },
      {
        url: '/powerade_black.jpg',
        type: 'image/jpeg',
      },
    ],
    apple: '/logo_powerade.png',
  },
  openGraph: {
    title: 'Powerade',
    description: 'Cobertura completa del Mundial 2026: partidos, selecciones, noticias, videos y análisis deportivos.',
    type: 'website',
    locale: 'es_ES',
    siteName: '',
    images: [
      {
        url: '/logo_powerade.png',
        width: 1200,
        height: 630,
        alt: '',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Powerade',
    description: 'Cobertura completa del Mundial 2026: partidos, selecciones, noticias, videos y análisis deportivos.',
    images: ['/logo_powerade.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build') {
    initializeScheduledJobs()
  }

  return (
    <html lang="es" suppressHydrationWarning style={{ overflowX: 'hidden' }}>

      
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

      <body className="font-sans antialiased overflow-x-hidden" style={{ overflowX: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '100vw', overflow: 'hidden' }}>
          <PageTransition>
            {children}
          </PageTransition>
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