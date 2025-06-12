import type { ReactNode } from "react"
import Link from "next/link"
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
} from "@/components/ui/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Car, Home, MessageSquare, Settings, ShoppingCart, Users } from "lucide-react"

interface DashboardLayoutProps {
  children: ReactNode
  user: User
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
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
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="p-4 border-b">
            <Link href="/" className="flex items-center gap-2">
              <Car className="h-6 w-6" />
              <span className="font-bold text-lg">CSBS</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/logout">Logout</Link>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <header className="h-16 border-b flex items-center px-6">
            <h1 className="text-xl font-bold">{user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard</h1>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
