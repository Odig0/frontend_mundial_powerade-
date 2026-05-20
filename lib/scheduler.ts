import { syncNewsToCache } from './news-service'

type NewsSchedulerState = {
  initialized: boolean
  timer: ReturnType<typeof setTimeout> | null
}

const schedulerState = globalThis as typeof globalThis & {
  __newsSchedulerState?: NewsSchedulerState
}

const state: NewsSchedulerState = schedulerState.__newsSchedulerState ?? {
  initialized: false,
  timer: null,
}

schedulerState.__newsSchedulerState = state

function getDelayUntilNextRun(targetHour = 1, targetMinute = 0): number {
  const now = new Date()
  const nextRun = new Date(now)

  nextRun.setHours(targetHour, targetMinute, 0, 0)

  if (nextRun.getTime() <= now.getTime()) {
    nextRun.setDate(nextRun.getDate() + 1)
  }

  return nextRun.getTime() - now.getTime()
}

function scheduleNextRun(): void {
  if (state.timer) {
    clearTimeout(state.timer)
  }

  const delay = getDelayUntilNextRun(1, 0)
  state.timer = setTimeout(async () => {
    try {
      console.log('[Scheduler] Running daily news sync at 1:00 AM')
      const result = await syncNewsToCache()
      if (result.success) {
        console.log(`[Scheduler] Synced ${result.count} news items`)
      } else {
        console.error('[Scheduler] News sync failed:', result.error)
      }
    } catch (error) {
      console.error('[Scheduler] Unexpected sync error:', error)
    } finally {
      scheduleNextRun()
    }
  }, delay)

  console.log(`[Scheduler] Next news sync scheduled in ${Math.round(delay / 1000)} seconds`)
}

/**
 * Initialize scheduled jobs for news synchronization
 * This should be called once at server startup
 */
export function initializeScheduledJobs(): void {
  if (state.initialized) {
    console.log('[Scheduler] Jobs already initialized')
    return
  }

  state.initialized = true
  console.log('[Scheduler] Initializing daily news sync scheduler...')
  scheduleNextRun()
}

/**
 * Stop the in-process scheduler.
 */
export function stopScheduledJobs(): void {
  if (state.timer) {
    clearTimeout(state.timer)
    state.timer = null
  }

  state.initialized = false
}

/**
 * Run the sync immediately. Useful for manual triggers and health checks.
 */
export async function runNewsSyncNow() {
  return syncNewsToCache()
}
