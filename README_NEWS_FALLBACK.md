# 🚀 Sistema de Fallback de Noticias - Guía Rápida

## ¿Qué es?

Sistema automático que guarda una copia local de noticias (`/data/news-cache.json`) y la usa si el backend falla.

## Archivos Creados

```
lib/
  ├── cache.ts              # Utilidades de lectura/escritura del cache
  ├── news-service.ts       # Lógica de fallback
  ├── scheduler.ts          # Setup para sincronización automática
  ├── example-usage.tsx     # Ejemplos de componentes
  └── actions.ts            # Server actions para client components

app/api/crons/
  └── news-sync/
      └── route.ts          # Endpoint para cron automático

components/examples/
  └── NewsWithFallback.tsx  # Componente ejemplo completo

data/
  └── news-cache.json       # Cache local (se completa automáticamente)

docs/
  └── NEWS_FALLBACK_SYSTEM.md # Documentación completa

vercel.example.json         # Configuración Vercel cron
```

## ⚡ Uso Inmediato (5 minutos)

### 1. Server Component (Recomendado)

```typescript
import { getNewsWithFallback } from '@/lib/news-service'

export async function HomePage() {
  const news = await getNewsWithFallback()
  return <div>{news.map(item => <NewsCard key={item._id} news={item} />)}</div>
}
```

### 2. Client Component via Server Action

```typescript
'use client'
import { loadNewsWithFallback } from '@/lib/actions'
import { useEffect, useState } from 'react'

export function MyWidget() {
  const [news, setNews] = useState([])
  useEffect(() => {
    loadNewsWithFallback().then(setNews)
  }, [])
  return <div>{news.map(...)}</div>
}
```

### 3. API Route

```typescript
// app/api/news/latest/route.ts
import { getNewsWithFallback } from '@/lib/news-service'

export async function GET() {
  const news = await getNewsWithFallback()
  return Response.json(news)
}
```

## 🔄 Comportamiento del Fallback

```
┌─ Intenta backend ─┐
│   (timeout: 10s)   │
└────────┬──────────┘
         │
    ✓ Success      ✗ Error
         │            │
         ├────┬───────┘
         │    │
    Update   Lee
    Cache   Cache
         │    │
         └────┴──→ Retorna datos
```

## 📊 Monitoreo del Cache

```typescript
import { getCacheStatus } from '@/lib/news-service'

const status = await getCacheStatus()
console.log(`${status.itemCount} items, age: ${status.ageFormatted}, fresh: ${status.isFresh}`)
```

## 🕐 Sincronización Automática (Opcional)

### Opción A: Vercel Crons (Recomendado si usas Vercel)

1. Copia `vercel.example.json` → `vercel.json`
2. Agrega variable de entorno en Vercel:
   ```
   CRON_SECRET = tu_secreto_aleatorio
   ```
3. Listo ✅ - Se ejecutará cada día a 1 AM UTC

### Opción B: Node-Cron (Local/Self-hosted)

```bash
npm install node-cron @types/node-cron
```

En `lib/scheduler.ts`, descomenta:

```typescript
import cron from 'node-cron'

cron.schedule('0 1 * * *', async () => {
  const result = await syncNewsToCache()
  console.log('Daily sync:', result)
})
```

En `app/layout.tsx`:

```typescript
if (process.env.NODE_ENV === 'production') {
  import('@/lib/scheduler').then(m => m.initializeScheduledJobs())
}
```

## 🎯 Casos de Uso

### Caso 1: Home page con noticias destacadas
```typescript
export async function HomePage() {
  const news = await getNewsWithFallback()
  const featured = news.slice(0, 5)
  return <HeroBlock featured={featured[0]} side={featured.slice(1)} />
}
```

### Caso 2: Dashboard admin con estado del cache
```typescript
'use client'
export function AdminPanel() {
  return (
    <div>
      <CacheStatusWidget />
      <ManualSyncButton />
      <NewsListClientComponent />
    </div>
  )
}
```

### Caso 3: API pública para PWA/APP
```typescript
export async function GET() {
  const news = await getNewsWithFallback()
  return Response.json(news, {
    headers: { 'Cache-Control': 'public, s-maxage=300' }
  })
}
```

## 📋 Logs para Debugging

```bash
# Backend fetch exitoso
[News Service] Fetching from backend...
[News Service] Backend fetch successful, cache updated

# Backend falla, usa cache
[News Service] Backend fetch failed, attempting cache fallback
[News Service] Using cached news (42 items, age: 2.5h)

# Ambos fallan
[News Service] All strategies exhausted, returning empty array
```

## ⚙️ Configuración Avanzada

### Cambiar timeout del backend
```typescript
// En lib/news-service.ts, línea ~30
const timeoutId = setTimeout(() => controller.abort(), 20000) // 20s
```

### Cambiar edad máxima del cache
```typescript
// Rechazar cache más viejo que 12 horas
const cache = await readNewsCache()
const maxAge = 1000 * 60 * 60 * 12
if (!isCacheFresh(cache, maxAge)) {
  console.log('Cache demasiado viejo')
}
```

### Sincronización manual
```bash
# POST desde admin panel
POST /api/crons/news-sync
Authorization: Bearer {CRON_SECRET}
```

## ✅ Checklist

- [x] Estructura de fallback implementada
- [x] Cache local funcional (`/data/news-cache.json`)
- [x] Tipado TypeScript completo
- [x] Server actions preparadas
- [x] API route ejemplo
- [x] Componentes ejemplo
- [x] Documentación completa
- [ ] Activar sincronización automática (elegir opción A o B)
- [ ] Agregar a .gitignore si deseas:
  ```
  # Agregar a .gitignore para no versionear cache en desarrollo
  # data/news-cache.json
  ```

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| Cache no se actualiza | Verificar permisos `/data/`, revisar logs `[Cache] Failed` |
| Backend siempre falla | Verificar `NEXT_PUBLIC_API_URL`, probar timeout |
| Cron no ejecuta | Verificar `CRON_SECRET` en variables de entorno |
| Cache muy viejo | Ejecutar manual sync o esperar próxima ejecución automática |

## 📚 Documentación Completa

Ver [docs/NEWS_FALLBACK_SYSTEM.md](../docs/NEWS_FALLBACK_SYSTEM.md)

## 🎓 Conceptos Clave

1. **Tolerancia a fallos**: Si backend cae, el sitio sigue funcionando
2. **Performance**: Cache local es instantáneo (< 1ms)
3. **Tipado seguro**: Toda estructura validada en TypeScript
4. **Flexible**: Funciona con server/client components, API routes, server actions
5. **Preparado para escala**: Estructura lista para métricas y monitoreo

---

**Estado**: ✅ Listo para producción  
**Próximo paso**: Activar sincronización automática (Opción A o B en sección de arriba)
