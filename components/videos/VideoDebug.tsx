'use client'

import type { VideoItem } from '@/services/dailymotionService'

interface VideoDebugProps {
  videos: VideoItem[]
}

export default function VideoDebug({ videos }: VideoDebugProps) {
  const playlistId = process.env.NEXT_PUBLIC_DAILYMOTION_PLAYLIST
  const isProduction = process.env.NODE_ENV === 'production'

  // Solo mostrar en desarrollo
  if (isProduction) return null

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-slate-900 border border-amber-500 rounded-lg p-3 text-xs text-white font-mono z-50 max-h-[200px] overflow-y-auto">
      <div className="font-bold text-amber-400 mb-2">🔍 VIDEO DEBUG</div>
      
      <div className="space-y-1 text-slate-300">
        <div>
          <span className="text-amber-300">PLAYLIST_ID:</span>
          <span className={playlistId ? ' text-green-400' : ' text-red-400'}>
            {playlistId ? `✓ ${playlistId}` : '✗ NOT SET'}
          </span>
        </div>
        
        <div>
          <span className="text-amber-300">VIDEOS LOADED:</span>
          <span className={videos.length > 0 ? ' text-green-400' : ' text-red-400'}>
            {videos.length > 0 ? `✓ ${videos.length}` : '✗ 0'}
          </span>
        </div>

        <div>
          <span className="text-amber-300">API URL:</span>
          <span className="text-slate-400">
            https://api.dailymotion.com/playlist/{playlistId}/videos
          </span>
        </div>

        {videos.length > 0 && (
          <div>
            <span className="text-amber-300">FIRST VIDEO:</span>
            <div className="text-slate-400 ml-2">{videos[0]?.titulo || 'N/A'}</div>
          </div>
        )}
      </div>
    </div>
  )
}
