import { NextResponse } from 'next/server'
import { fetchFixture } from '@/services/fixtureService'

export const revalidate = 20 // ISR: revalidate every 20 seconds

export async function GET() {
  try {
    const matches = await fetchFixture()
    return NextResponse.json(matches, {
      headers: {
        'Cache-Control': 'public, s-maxage=20, stale-while-revalidate=40',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching fixture', error: String(error) },
      { status: 502 }
    )
  }
}
