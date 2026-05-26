'use client'

import '@/styles/dashboard.css'
import { SidebarProvider } from '@/components/ui/sidebar'
import DashboardSidebar from './DashboardSidebar'
import DashboardHeader from './DashboardHeader'

interface DashboardShellProps {
  children: React.ReactNode
  username?: string
}

export default function DashboardShell({ children, username = 'Usuario' }: DashboardShellProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="db-shell">
        <DashboardSidebar username={username} />
        <div className="db-content-area">
          <DashboardHeader />
          <main className="db-main">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
