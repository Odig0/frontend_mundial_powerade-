const videos = [
  {
    id: '1',
    titulo: 'Copa Mundial FIFA 2026 - Promo oficial',
    thumb: 'https://img.youtube.com/vi/4DL6TDlmojM/hqdefault.jpg',
    href: 'https://www.youtube.com/watch?v=4DL6TDlmojM',
  },
  {
    id: '2',
    titulo: 'Bolivia al Mundial 2026 - Camino histórico',
    thumb: 'https://img.youtube.com/vi/vABqxQWFYKU/hqdefault.jpg',
    href: 'https://www.youtube.com/watch?v=vABqxQWFYKU',
  },
  {
    id: '3',
    titulo: 'Goles y resumen - Eliminatorias CONMEBOL',
    thumb: 'https://img.youtube.com/vi/ZqYFRHbNMzc/hqdefault.jpg',
    href: 'https://www.youtube.com/watch?v=ZqYFRHbNMzc',
  },
  {
    id: '4',
    titulo: 'Los mejores momentos del Mundial anterior',
    thumb: 'https://img.youtube.com/vi/0gDzLMb8L0E/hqdefault.jpg',
    href: 'https://www.youtube.com/watch?v=0gDzLMb8L0E',
  },
]

export default function VideoBlock() {
  return (
    <section className="bg-background py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-black text-white mb-4">Videos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {videos.map((video) => (
            <a
              key={video.id}
              href={video.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="relative aspect-video overflow-hidden bg-muted mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumb}
                  alt={video.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-accent/90 flex items-center justify-center">
                    <svg className="w-4 h-4 text-accent-foreground ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-xs text-white font-semibold line-clamp-2 group-hover:text-accent transition-colors">
                {video.titulo}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
