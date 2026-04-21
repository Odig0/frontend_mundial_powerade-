import { NextResponse } from 'next/server'
import { syncNews } from '@/lib/api'

export async function POST() {
  try {
    const result = await syncNews()
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to sync news'
    return NextResponse.json({ message }, { status: 500 })
  }
}