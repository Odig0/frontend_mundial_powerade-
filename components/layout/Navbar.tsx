import Link from 'next/link'
import { getAvailableSections } from '@/lib/api'

export default async function Navbar() {
  const availableSections = await getAvailableSections()

  return (
    <nav className="border-b border-border bg-secondary sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-8 overflow-x-auto">
          <Link
            href="/"
            className="py-3 px-1 text-sm font-semibold text-foreground hover:text-accent transition-colors whitespace-nowrap"
          >
            Portada
          </Link>
          {availableSections.map((section) => (
            <Link
              key={section}
              href={`/${section}`}
              className="py-3 px-1 text-sm font-semibold text-foreground hover:text-accent transition-colors whitespace-nowrap capitalize"
            >
              {section}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
