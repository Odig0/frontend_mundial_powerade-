import Link from 'next/link'

const links = [
  { label: 'Últimas', href: '/' },
  { label: 'Partidos', href: '/partidos' },
  { label: 'Selecciones', href: '/selecciones' },
  { label: 'Opinión', href: '/opinion' },
  { label: 'Videos', href: '/videos' },
]

export default function Navbar() {
  return (
    <nav className="bg-[#0a1525] border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center overflow-x-auto">
          {links.map((link, i) => (
            <div key={link.href} className="flex items-center">
              {i > 0 && <span className="text-white/30 text-sm select-none px-1">|</span>}
              <Link
                href={link.href}
                className="py-3 px-3 text-sm font-semibold text-white hover:text-accent transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            </div>
          ))}
          <span className="text-white/30 text-sm select-none px-1">|</span>
          <Link
            href="/mundial"
            className="my-2 ml-2 px-4 py-1.5 bg-accent text-accent-foreground text-sm font-bold rounded whitespace-nowrap hover:opacity-90 transition-opacity"
          >
            Seguí el mundial
          </Link>
        </div>
      </div>
    </nav>
  )
}
