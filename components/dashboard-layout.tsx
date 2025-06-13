"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { User } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Car, Home, MessageSquare, Settings, ShoppingCart, Users, Menu } from "lucide-react"

interface DashboardLayoutProps {
  children: ReactNode
  user: User
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const pathname = usePathname()

  const menuItems = {
    admin: [
      { icon: Home, label: "Dashboard", href: "/dashboard/admin" },
      { icon: Users, label: "Users", href: "/dashboard/admin/users" },
      { icon: Car, label: "Car Listings", href: "/dashboard/admin/cars" },
      { icon: MessageSquare, label: "Support", href: "/dashboard/admin/support" },
      { icon: Settings, label: "Settings", href: "/dashboard/admin/settings" },
    ],
    seller: [
      { icon: Home, label: "Dashboard", href: "/dashboard/seller" },
      { icon: Car, label: "My Listings", href: "/dashboard/seller/cars" },
      { icon: ShoppingCart, label: "Offers", href: "/dashboard/seller/offers" },
      { icon: Settings, label: "Settings", href: "/dashboard/seller/settings" },
    ],
    buyer: [
      { icon: Home, label: "Dashboard", href: "/dashboard/buyer" },
      { icon: Car, label: "Browse Cars", href: "/cars" },
      { icon: ShoppingCart, label: "My Offers", href: "/dashboard/buyer/offers" },
      { icon: Settings, label: "Settings", href: "/dashboard/buyer/settings" },
    ],
    support: [
      { icon: Home, label: "Dashboard", href: "/dashboard/support" },
      { icon: MessageSquare, label: "Complaints", href: "/dashboard/support/complaints" },
      { icon: Users, label: "Users", href: "/dashboard/support/users" },
      { icon: Settings, label: "Settings", href: "/dashboard/support/settings" },
    ],
  }

  const items = menuItems[user.role as keyof typeof menuItems] || []

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar className="border-r bg-white">
          <SidebarHeader className="p-4 border-b">
            <Link href="/" className="flex items-center gap-2">
              <Car className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-lg text-gray-900">CSBS</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="w-full justify-start gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-gray-900">
                <Link href="/logout">Logout</Link>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-white flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <h1 className="text-xl font-semibold text-gray-900">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Welcome, {user.username}</span>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

// Default export for easier importing
export default DashboardLayout
