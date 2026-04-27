'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Newspaper, CheckSquare } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { LogoutButton } from './LogoutButton'
import Image from 'next/image'

interface DashboardSidebarProps {
  username: string
}

const navItems = [
  { href: '/dashboard/noticias', icon: Newspaper, label: 'Noticias' },
  { href: '/dashboard/publicaciones', icon: CheckSquare, label: 'Publicadas' },
]

export default function DashboardSidebar({ username }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="gap-4">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 flex-shrink-0">
            <Image
              src="/powerade.png"
              alt="Powerade"
              fill
              className="object-contain"
            />
          </div>
          <span className="hidden group-data-[collapsible=icon]:hidden font-bold text-sm truncate">
            Dashboard
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Contenido</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border pt-4">
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate hidden group-data-[collapsible=icon]:hidden">
              {username}
            </p>
            <p className="text-xs text-muted-foreground hidden group-data-[collapsible=icon]:hidden">
              Panel de control
            </p>
          </div>
          <LogoutButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
