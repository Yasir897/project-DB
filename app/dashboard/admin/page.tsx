import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { requireAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Car, DollarSign, ShoppingCart, Users, Activity, AlertTriangle, CheckCircle, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function AdminDashboard() {
  const user = await requireAuth("admin")

  // Fetch dashboard stats
  const [
    userCountResult,
    carCountResult,
    offerCountResult,
    purchaseCountResult,
    pendingOffersResult,
    recentActivityResult,
  ] = await Promise.all([
    executeQuery<any[]>("SELECT COUNT(*) as count FROM users"),
    executeQuery<any[]>("SELECT COUNT(*) as count FROM cars"),
    executeQuery<any[]>("SELECT COUNT(*) as count FROM offers"),
    executeQuery<any[]>("SELECT SUM(amount) as total FROM purchases"),
    executeQuery<any[]>("SELECT COUNT(*) as count FROM offers WHERE status = 'pending'"),
    executeQuery<any[]>(`
      SELECT 'new_user' as type, u.username as name, u.created_at as date, u.role as details
      FROM users u
      ORDER BY u.created_at DESC
      LIMIT 5
      UNION ALL
      SELECT 'new_car' as type, CONCAT(c.make, ' ', c.model) as name, c.created_at as date, u.username as details
      FROM cars c
      JOIN users u ON c.seller_id = u.id
      ORDER BY c.created_at DESC
      LIMIT 5
      UNION ALL
      SELECT 'new_offer' as type, CONCAT(c.make, ' ', c.model) as name, o.created_at as date, CONCAT('$', o.amount) as details
      FROM offers o
      JOIN cars c ON o.car_id = c.id
      ORDER BY o.created_at DESC
      LIMIT 5
      ORDER BY date DESC
      LIMIT 10
    `),
  ])

  const userCount = userCountResult[0]?.count || 0
  const carCount = carCountResult[0]?.count || 0
  const offerCount = offerCountResult[0]?.count || 0
  const totalSales = purchaseCountResult[0]?.total || 0
  const pendingOffers = pendingOffersResult[0]?.count || 0

  // Fetch recent users
  const recentUsers = await executeQuery<any[]>(
    "SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5",
  )

  // Fetch recent car listings
  const recentCars = await executeQuery<any[]>(
    `SELECT c.id, c.make, c.model, c.price, c.status, u.username as seller 
     FROM cars c 
     JOIN users u ON c.seller_id = u.id 
     ORDER BY c.created_at DESC LIMIT 5`,
  )

  return (
    <DashboardLayout user={user}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.username}! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard/admin/users">Manage Users</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/admin/cars">Manage Cars</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{userCount}</div>
            <p className="text-xs text-blue-700 mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Car Listings</CardTitle>
            <Car className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{carCount}</div>
            <p className="text-xs text-green-700 mt-1">+5% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Pending Offers</CardTitle>
            <ShoppingCart className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{pendingOffers}</div>
            <p className="text-xs text-amber-700 mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">${totalSales.toLocaleString()}</div>
            <p className="text-xs text-purple-700 mt-1">+18% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="activity">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="users">Recent Users</TabsTrigger>
            <TabsTrigger value="cars">Recent Cars</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">System Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivityResult.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100">
                      <div
                        className={`p-2 rounded-full ${
                          activity.type === "new_user"
                            ? "bg-blue-100 text-blue-600"
                            : activity.type === "new_car"
                              ? "bg-green-100 text-green-600"
                              : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {activity.type === "new_user" ? (
                          <Users className="h-5 w-5" />
                        ) : activity.type === "new_car" ? (
                          <Car className="h-5 w-5" />
                        ) : (
                          <ShoppingCart className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {activity.type === "new_user"
                            ? "New user registered"
                            : activity.type === "new_car"
                              ? "New car listed"
                              : "New offer submitted"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activity.type === "new_user"
                            ? `${activity.name} joined as ${activity.details}`
                            : activity.type === "new_car"
                              ? `${activity.name} listed by ${activity.details}`
                              : `Offer for ${activity.name}: ${activity.details}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(activity.date).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 bg-gray-50 p-3 text-sm font-medium text-gray-600">
                    <div>Username</div>
                    <div>Email</div>
                    <div>Role</div>
                    <div>Joined</div>
                    <div>Actions</div>
                  </div>
                  {recentUsers.map((user) => (
                    <div key={user.id} className="grid grid-cols-5 p-3 text-sm border-t">
                      <div className="font-medium">{user.username}</div>
                      <div className="text-gray-600">{user.email}</div>
                      <div>
                        <Badge
                          className={
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                              : user.role === "seller"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : user.role === "buyer"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {user.role}
                        </Badge>
                      </div>
                      <div className="text-gray-600">{new Date(user.created_at).toLocaleDateString()}</div>
                      <div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/admin/users/${user.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <Button asChild variant="outline">
                    <Link href="/dashboard/admin/users">View All Users</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cars" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Recent Car Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 bg-gray-50 p-3 text-sm font-medium text-gray-600">
                    <div>Car</div>
                    <div>Price</div>
                    <div>Status</div>
                    <div>Seller</div>
                    <div>Actions</div>
                  </div>
                  {recentCars.map((car) => (
                    <div key={car.id} className="grid grid-cols-5 p-3 text-sm border-t">
                      <div className="font-medium">
                        {car.make} {car.model}
                      </div>
                      <div>${car.price.toLocaleString()}</div>
                      <div>
                        <Badge
                          className={
                            car.status === "available"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : car.status === "sold"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          }
                        >
                          {car.status}
                        </Badge>
                      </div>
                      <div>{car.seller}</div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/cars/${car.id}`}>View</Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/admin/cars/${car.id}/edit`}>Edit</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <Button asChild variant="outline">
                    <Link href="/dashboard/admin/cars">View All Cars</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Database Connection</span>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Authentication Service</span>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Payment Processing</span>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <span>Image Storage</span>
                </div>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Degraded</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button asChild className="h-auto py-4 flex flex-col items-center justify-center">
                <Link href="/dashboard/admin/cars/new">
                  <Car className="h-5 w-5 mb-1" />
                  <span>Add New Car</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                <Link href="/dashboard/admin/users/new">
                  <Users className="h-5 w-5 mb-1" />
                  <span>Add New User</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                <Link href="/dashboard/admin/reports">
                  <Activity className="h-5 w-5 mb-1" />
                  <span>View Reports</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                <Link href="/dashboard/admin/settings">
                  <Settings className="h-5 w-5 mb-1" />
                  <span>Settings</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
