// Metricool API integration for publishing social media content
// Documentation: https://help.metricool.com/en/article/basic-guide-for-api-integration-abukgf/

const METRICOOL_API_KEY = process.env.NEXT_PUBLIC_METRICOOL
const METRICOOL_API_BASE = 'https://app.metricool.com/api'

interface PublishPostPayload {
  text: string
  image?: string
  link?: string
  scheduleDate?: string // ISO 8601 format for scheduling
  networks: ('facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok')[]
}

interface MetricoolPublishResponse {
  success: boolean
  postId?: string
  message?: string
  error?: string
}

export async function publishToMetricool(
  userId: string,
  blogId: string,
  payload: PublishPostPayload
): Promise<MetricoolPublishResponse> {
  if (!METRICOOL_API_KEY) {
    return {
      success: false,
      error: 'Metricool API key not configured',
    }
  }

  try {
    // Prepare payload for Metricool
    const metricoolPayload = {
      text: payload.text,
      image: payload.image,
      link: payload.link,
      scheduleDate: payload.scheduleDate || new Date().toISOString(),
      networks: payload.networks,
    }

    const response = await fetch(`${METRICOOL_API_BASE}/posts/create`, {
      method: 'POST',
      headers: {
        'X-Mc-Auth': METRICOOL_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        blogId,
        ...metricoolPayload,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: `HTTP ${response.status}`,
      }))
      return {
        success: false,
        error: error.error || 'Failed to publish to Metricool',
      }
    }

    const data = await response.json()
    return {
      success: true,
      postId: data.id,
      message: 'Post published successfully',
    }
  } catch (error) {
    console.error('Metricool publish error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Get user's Metricool configuration
export async function getMetricoolConfig(userId: string) {
  if (!METRICOOL_API_KEY) {
    return null
  }

  try {
    const response = await fetch(`${METRICOOL_API_BASE}/user/${userId}`, {
      headers: {
        'X-Mc-Auth': METRICOOL_API_KEY,
      },
    })

    if (!response.ok) return null
    return response.json()
  } catch (error) {
    console.error('Error fetching Metricool config:', error)
    return null
  }
}
