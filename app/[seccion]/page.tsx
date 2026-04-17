import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SectionGrid from '@/components/section/SectionGrid'
import { getNewsBySection } from '@/lib/api'

const validSections = ['futbol', 'basketball', 'tennis', 'sports', 'news']

interface Params {
  seccion: string
}

export async function generateStaticParams(): Promise<Params[]> {
  return validSections.map((seccion) => ({ seccion }))
}

export async function generateMetadata({ params }: { params: Promise<Params> | Params }) {
  const resolvedParams = await params
  const { seccion } = resolvedParams
  const formattedSection = seccion.charAt(0).toUpperCase() + seccion.slice(1)
  return {
    title: `${formattedSection} News - Sports News Daily`,
    description: `Latest ${formattedSection.toLowerCase()} news and updates`,
  }
}

export default async function SectionPage({ params }: { params: Promise<Params> | Params }) {
  const { seccion } = await params

  if (!validSections.includes(seccion)) {
    notFound()
  }

  const news = await getNewsBySection(seccion)

  if (news.length === 0) {
    notFound()
  }

  const formattedSection = seccion.charAt(0).toUpperCase() + seccion.slice(1)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">{formattedSection}</h1>
          <p className="text-muted-foreground">Latest updates and breaking news</p>
        </div>

        <SectionGrid news={news} itemsPerPage={12} />
      </main>

      <Footer />
    </div>
  )
}
