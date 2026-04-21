'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { RefreshCw } from 'lucide-react'

interface NewsActionsProps {
  primaryHref: string
  primaryLabel: string
}

export default function NewsActions({ primaryHref, primaryLabel }: NewsActionsProps) {
  const router = useRouter()
  const [isSyncing, setIsSyncing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSync = async () => {
    setIsSyncing(true)
    setErrorMessage(null)

    try {
      const response = await fetch('/api/news/sync', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('No se pudo sincronizar el feed')
      }

      router.refresh()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo sincronizar el feed')
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href={primaryHref}
        className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        {primaryLabel}
      </Link>

      <button
        type="button"
        onClick={handleSync}
        disabled={isSyncing}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <RefreshCw className={isSyncing ? 'size-4 animate-spin' : 'size-4'} />
        {isSyncing ? 'Sincronizando' : 'Sincronizar'}
      </button>

      {errorMessage ? (
        <p className="w-full text-sm text-destructive">{errorMessage}</p>
      ) : null}
    </div>
  )
}