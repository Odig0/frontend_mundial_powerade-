'use client'

import Link from 'next/link'

const sections = [
  { name: 'Últimas', slug: 'futbol' },
  { name: 'Partidos', slug: 'basketball' },
  { name: 'Selecciones', slug: 'tennis' },
  { name: 'videos', slug: 'sports' },
  { name: 'seguir el mundial', slug: 'news' },
]

export default function Navbar() {
  return (
    <nav className="border-b border-border bg-secondary sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-8 overflow-x-auto">
          {sections.map((section) => (
            <Link
              key={section.slug}
              href={`/${section.slug}`}
              className="py-3 px-1 text-sm font-semibold text-foreground hover:text-accent transition-colors whitespace-nowrap"
            >
              {section.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
