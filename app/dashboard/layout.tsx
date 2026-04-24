import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE_NAME, verifySession } from '@/lib/auth'
import DashboardShell from '@/components/dashboard/DashboardShell'

export const metadata = {
  title: 'Dashboard — Powerade',
  description: 'Panel de control para gestión de publicaciones',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Double protection: verify session
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!session) {
    redirect('/login')
  }

  const verified = verifySession(session)
  if (!verified) {
    redirect('/login')
  }

  return <DashboardShell username={verified.username}>{children}</DashboardShell>
}
