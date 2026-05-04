import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'

const AUTH_COOKIE_NAME = 'auth_token'

export const metadata = {
  title: 'Dashboard — Powerade',
  description: 'Panel de control para gestión de publicaciones',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verify authentication token exists
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    redirect('/login')
  }

  return <DashboardShell>{children}</DashboardShell>
}
