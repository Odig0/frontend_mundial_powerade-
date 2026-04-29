import { getDailymotionVideos } from '@/services/dailymotionService'

export async function GET() {
  try {
    const videos = await getDailymotionVideos()
    return Response.json({ videos }, { status: 200 })
  } catch (error) {
    console.error('[API/videos] Error:', error)
    return Response.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}
