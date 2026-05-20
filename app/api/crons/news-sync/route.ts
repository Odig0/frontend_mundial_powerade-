/**
 * API Route for Vercel Crons
 * Endpoint: /api/crons/news-sync
 * 
 * Setup:
 * 1. Copy vercel.example.json to vercel.json
 * 2. Add CRON_SECRET to your Vercel environment variables
 * 3. The route will be called automatically every day at 1 AM UTC
 */

import { syncNewsToCache } from '@/lib/news-service'

export const maxDuration = 60 // 60 seconds timeout

export async function GET(req: Request) {
  try {
    // Verify the cron secret for security
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      console.error('[Cron] CRON_SECRET environment variable not set')
      return Response.json(
        { error: 'Server not configured' },
        { status: 500 }
      )
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.warn('[Cron] Unauthorized cron request')
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Execute the sync
    console.log('[Cron] Starting automatic news sync...')
    const result = await syncNewsToCache()

    const status = result.success ? 200 : 500
    console.log(`[Cron] Sync complete:`, result)

    return Response.json(result, { status })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[Cron] Unexpected error:', message)

    return Response.json(
      {
        success: false,
        count: 0,
        error: message,
      },
      { status: 500 }
    )
  }
}
