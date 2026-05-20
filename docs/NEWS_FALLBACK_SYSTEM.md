# Sistema de Fallback de Noticias

## Descripción General

Sistema robusto de fallback para noticias en Next.js que mantiene una copia local (`/data/news-cache.json`) del backend y la usa automáticamente si el servidor principal no responde.

## Arquitectura

```
┌─────────────────────────────────────────────┐
│         App (Server Component)              │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │  getNewsWithFallback()       │
    │  (news-service.ts)           │
    └──┬─────────────────────────┬─┘
       │                         │
       ▼                         ▼
    Try Backend             If Backend Fails
    (10s timeout)           Use Local Cache
       │                    (news-cache.json)
       ▼                         │
    Success ──→ Update Cache     ▼
       │                     Return Data
       ▼
    Return Data
```

## Archivos Creados

### 1. **lib/cache.ts** - Utilidades de Cache
Maneja lectura/escritura del archivo JSON local:
- `readNewsCache()` - Lee el cache desde disco
- `writeNewsCache()` - Escribe noticias al cache
- `isCacheFresh()` - Verifica si el cache sigue siendo válido
- `getCacheAge()` - Obtiene la edad del cache

### 2. **lib/news-service.ts** - Servicio Principal
Implementa la lógica de fallback:
- `getNewsWithFallback()` - Función principal (backend → cache)
- `syncNewsToCache()` - Sincronización manual desde backend
- `getCacheStatus()` - Estado actual del cache

### 3. **lib/scheduler.ts** - Sincronización Automática
Estructura preparada para cron diario (aún no implementado):
- `initializeScheduledJobs()` - Inicializa trabajos programados
- Instrucciones para setup con `node-cron`

### 4. **lib/example-usage.tsx** - Ejemplos de Uso
Componentes de ejemplo para server y client:
- `NewsListWithFallback` - Server component
- `CacheStatusBadge` - Muestra estado del cache

### 5. **data/news-cache.json** - Cache Local
Archivo inicial vacío que se completa automáticamente:
```json
{
  "metadata": {
    "version": "1",
    "timestamp": 1234567890,
    "count": 42
  },
  "news": [...]
}
```

## Uso Básico

### En un Server Component

```typescript
import { getNewsWithFallback } from '@/lib/news-service'

export async function HomePage() {
  const news = await getNewsWithFallback()
  
  return (
    <div>
      {news.map(item => (
        <NewsCard key={item._id} news={item} />
      ))}
    </div>
  )
}
```

### En un Client Component (via Server Action)

```typescript
// lib/actions.ts
'use server'
import { getNewsWithFallback } from '@/lib/news-service'

export async function loadNews() {
  return await getNewsWithFallback()
}

// Componente
'use client'
import { loadNews } from '@/lib/actions'

export function NewsWidget() {
  const [news, setNews] = useState([])
  
  useEffect(() => {
    loadNews().then(setNews)
  }, [])
  
  return <div>{news.map(...)}</div>
}
```

### En una API Route

```typescript
// app/api/news/latest-fallback/route.ts
import { getNewsWithFallback } from '@/lib/news-service'

export async function GET() {
  const news = await getNewsWithFallback()
  return Response.json(news)
}
```

## Monitoreo

### Ver estado del cache

```typescript
import { getCacheStatus } from '@/lib/news-service'

const status = await getCacheStatus()
console.log(status)
// {
//   exists: true,
//   itemCount: 42,
//   ageHours: 2.5,
//   ageFormatted: "2h ago",
//   isFresh: true
// }
```

### Sincronización manual (endpoint)

```typescript
// app/api/news/sync-manual/route.ts
import { syncNewsToCache } from '@/lib/news-service'

export async function POST() {
  const result = await syncNewsToCache()
  return Response.json(result)
}

// Uso: POST /api/news/sync-manual
// Respuesta: { success: true, count: 42 }
```

## Sincronización Automática Diaria (Setup)

### Opción 1: Node-Cron (Local)

```bash
npm install node-cron
npm install -D @types/node-cron
```

En `lib/scheduler.ts`, descomenta el código:

```typescript
import cron from 'node-cron'

cron.schedule('0 1 * * *', async () => {
  const result = await syncNewsToCache()
  console.log('Daily sync:', result)
})
```

En `app/layout.tsx`:

```typescript
import { initializeScheduledJobs } from '@/lib/scheduler'

// En el root layout
if (process.env.NODE_ENV === 'production') {
  initializeScheduledJobs().catch(console.error)
}
```

### Opción 2: Vercel Crons (Recomendado para Vercel)

En `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/crons/news-sync",
      "schedule": "0 1 * * *"
    }
  ]
}
```

En `app/api/crons/news-sync/route.ts`:

```typescript
import { syncNewsToCache } from '@/lib/news-service'

export async function GET(req: Request) {
  // Verificar auth token si es necesario
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const result = await syncNewsToCache()
  return Response.json(result)
}

export const maxDuration = 300 // 5 minutos máximo
```

### Opción 3: Servicio Externo (EasyCron, GitHub Actions)

1. Crear endpoint POST: `/api/news/sync-manual`
2. Configurar en servicio externo para llamar cada día a 1 AM
3. (Opcional) Agregar validación con token secreto

## Logging y Debugging

El sistema registra toda la actividad:

```
[Cache] Successfully cached 42 news items 2024-05-20T13:00:00.000Z
[News Service] Fetching from backend...
[News Service] Backend fetch successful, cache updated
[News Service] Using cached news (42 items, age: 2.5h)
[Cache] Failed to write cache: EACCES permission denied
```

## Manejo de Errores

### Escenarios

1. **Backend ✓ + Cache ✓**: Usa backend, actualiza cache
2. **Backend ✗ + Cache ✓**: Usa cache (con warning)
3. **Backend ✗ + Cache ✗**: Retorna array vacío (error)

### Reintentos

Si el backend falla pero hay cache, el sistema:
- Retorna los datos del cache inmediatamente
- No reintenta el backend (evita demora)
- Registra el error para debugging

## Tipado TypeScript

Todos los tipos están bien definidos:

```typescript
// Tipo de noticia (del backend)
NewsItem {
  _id: string
  titulo: string
  introHTML: string
  textoHTML: string
  imagen_home: string
  imagen_interior: string
  fecha_a: number
  fecha_c: number
  opinologo: Opinologo
  secciones: string[]
  link: string
  prevId: string
}

// Tipo del cache en disco
NewsCache {
  metadata: {
    version: '1'
    timestamp: number
    count: number
  }
  news: NewsItem[]
}
```

## Performance

- **Timeout backend**: 10 segundos (configurable)
- **Cache local**: < 1ms (lectura de archivo)
- **Max age**: 24 horas (por defecto)

## Próximos Pasos

1. ✅ Estructura base implementada
2. ⏳ Activar sincronización automática (elegir opción)
3. ⏳ Agregar métricas/monitoring
4. ⏳ Dashboard de estado del cache

## Troubleshooting

### Cache no se actualiza
- Verificar permisos de `/data/`
- Revisar logs: `[Cache] Failed to write...`

### Backend siempre falla
- Verificar `NEXT_PUBLIC_API_URL`
- Comprobar timeout de red (10s)
- Ver logs: `[News Service] Backend fetch failed...`

### Versión antigua del cache
- Manual sync: `POST /api/news/sync-manual`
- Verificar que cron está corriendo

## API Reference

### getNewsWithFallback()
```typescript
async function getNewsWithFallback(): Promise<NewsItem[]>
```

Retorna noticias del backend o cache. Nunca falla (retorna `[]` si todo falla).

### syncNewsToCache()
```typescript
async function syncNewsToCache(): Promise<{
  success: boolean
  count: number
  error?: string
}>
```

Sincroniza forzadamente desde backend. Útil para manual refresh.

### getCacheStatus()
```typescript
async function getCacheStatus(): Promise<{
  exists: boolean
  itemCount: number
  ageHours: number
  ageFormatted: string
  isFresh: boolean
}>
```

Retorna estado actual del cache para monitoreo.

### readNewsCache()
```typescript
async function readNewsCache(): Promise<NewsCache | null>
```

Lee el cache desde disco. Retorna `null` si no existe o está corrupto.

### writeNewsCache()
```typescript
async function writeNewsCache(news: NewsItem[]): Promise<void>
```

Escribe noticias al cache en disco.
