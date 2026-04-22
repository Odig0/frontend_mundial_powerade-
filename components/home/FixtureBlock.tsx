import { partidos } from '@/data/fixtures'

export default function FixtureBlock() {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-accent text-accent-foreground px-4 py-2 text-center font-bold text-sm uppercase tracking-wider">
        Partidos del día
      </div>
      <div className="flex flex-col divide-y divide-border flex-1 bg-card">
        {partidos.slice(0, 5).map((partido) => (
          <div key={partido.id} className="px-3 py-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-muted-foreground font-medium">
                {partido.fecha} | {partido.hora}
              </span>
              <span className="text-[10px] text-accent font-bold uppercase">
                {partido.canal}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-1">
                <span className="text-lg leading-none">{partido.local.bandera}</span>
                <span className="text-xs font-bold text-foreground uppercase truncate">{partido.local.nombre}</span>
              </div>
              <div className="px-2 py-0.5 bg-background border border-border rounded text-xs font-black text-foreground">
                VS
              </div>
              <div className="flex items-center gap-1.5 flex-1 justify-end">
                <span className="text-xs font-bold text-foreground uppercase truncate">{partido.visitante.nombre}</span>
                <span className="text-lg leading-none">{partido.visitante.bandera}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
