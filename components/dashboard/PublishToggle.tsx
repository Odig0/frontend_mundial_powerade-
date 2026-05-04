'use client'

import { CheckCircle2, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PublishToggleProps {
  isPublished: boolean
  onToggle: () => void
  className?: string
}

export default function PublishToggle({ isPublished, onToggle, className }: PublishToggleProps) {
  return (
    <Button
      variant={isPublished ? 'default' : 'outline'}
      size="sm"
      className={className}
      onClick={onToggle}
    >
      {isPublished ? (
        <>
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Publicada
        </>
      ) : (
        <>
          <Circle className="h-4 w-4 mr-2" />
          Marcar como publicada
        </>
      )}
    </Button>
  )
}
