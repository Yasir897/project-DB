import { requireAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardStatus } from "@/components/dashboard-status"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TestTube, Users, Car, ShoppingCart, Headphones } from "lucide-react"

export default async function TestDashboard() {
  const user = await requireAuth()

  const dashboardLinks = [
    {
      role: "admin",
      href: "/dashboard/admin",
      icon: Users,
      color: "bg-purple-500",
      description: "User management and system overview",
    },
    {
      role: "buyer",
      href: "/dashboard/buyer",
      icon: ShoppingCart,
      color: "bg-blue-500",
      description: "Browse cars and manage offers",
    },
    {
      role: "seller",
      href: "/dashboard/seller",
      icon: Car,
      color: "bg-green-500",
      description: "List cars and track sales",
    },
    {
      role: "support",
      href: "/dashboard/support",
      icon: Headphones,
      color: "bg-orange-500",
      description: "Customer support and tickets",
    },
  ]

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Dashboard Testing Center
          </h1>
          <p className="text-gray-600">Test all dashboard functionalities and verify system health</p>
        </div>

        <DashboardStatus userRole={user.role} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Quick Dashboard Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {dashboardLinks.map((dashboard) => {
                const IconComponent = dashboard.icon
                const isCurrentRole = dashboard.role === user.role

                return (
                  <Card
                    key={dashboard.role}
                    className={`hover:shadow-lg transition-shadow ${isCurrentRole ? "ring-2 ring-blue-500" : ""}`}
                  >
                    <CardContent className="p-4 text-center">
                      <div
                        className={`w-12 h-12 ${dashboard.color} rounded-full flex items-center justify-center mx-auto mb-3`}
                      >
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold capitalize mb-2">{dashboard.role}</h3>
                      <p className="text-xs text-gray-600 mb-3">{dashboard.description}</p>
                      <Button asChild size="sm" variant={isCurrentRole ? "default" : "outline"} className="w-full">
                        <Link href={dashboard.href}>
                          {isCurrentRole ? "Current Dashboard" : `View ${dashboard.role}`}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Testing Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>1. Test Login:</strong> Use{" "}
                <Link href="/test-login" className="text-blue-600 hover:underline">
                  /test-login
                </Link>{" "}
                to quickly switch between roles
              </div>
              <div>
                <strong>2. Check Dashboards:</strong> Verify each dashboard loads without errors
              </div>
              <div>
                <strong>3. Test Features:</strong> Try creating offers, listing cars, managing users
              </div>
              <div>
                <strong>4. Check Images:</strong> Ensure car images load with proper fallbacks
              </div>
              <div>
                <strong>5. Verify Data:</strong> Check that stats and tables display correctly
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Session Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <strong>User:</strong> {user.username}
              </div>
              <div>
                <strong>Email:</strong> {user.email}
              </div>
              <div>
                <strong>Role:</strong> <span className="capitalize">{user.role}</span>
              </div>
              <div>
                <strong>ID:</strong> {user.id}
              </div>
              <div className="pt-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/test-login">Switch User</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
