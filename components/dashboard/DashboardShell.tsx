'use client'

import { SidebarProvider } from '@/components/ui/sidebar'
import DashboardSidebar from './DashboardSidebar'
import DashboardHeader from './DashboardHeader'

interface DashboardShellProps {
  children: React.ReactNode
  username: string
}

export default function DashboardShell({ children, username }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <div className="absolute inset-0 z-20 flex w-full">
        <DashboardSidebar username={username} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
