import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requireAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Car, DollarSign, ShoppingCart, Users } from "lucide-react"

export default async function AdminDashboard() {
  const user = await requireAuth("admin")

  // Fetch dashboard stats
  const [userCountResult, carCountResult, offerCountResult, purchaseCountResult] = await Promise.all([
    executeQuery<any[]>("SELECT COUNT(*) as count FROM users"),
    executeQuery<any[]>("SELECT COUNT(*) as count FROM cars"),
    executeQuery<any[]>("SELECT COUNT(*) as count FROM offers"),
    executeQuery<any[]>("SELECT SUM(amount) as total FROM purchases"),
  ])

  const userCount = userCountResult[0]?.count || 0
  const carCount = carCountResult[0]?.count || 0
  const offerCount = offerCountResult[0]?.count || 0
  const totalSales = purchaseCountResult[0]?.total || 0

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Car Listings</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{carCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offerCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground">
                <div>Username</div>
                <div>Role</div>
                <div>Joined</div>
              </div>
              {recentUsers.map((user) => (
                <div key={user.id} className="grid grid-cols-3 text-sm">
                  <div className="font-medium">{user.username}</div>
                  <div className="capitalize">{user.role}</div>
                  <div>{new Date(user.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Car Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-4 text-sm font-medium text-muted-foreground">
                <div>Car</div>
                <div>Price</div>
                <div>Status</div>
                <div>Seller</div>
              </div>
              {recentCars.map((car) => (
                <div key={car.id} className="grid grid-cols-4 text-sm">
                  <div className="font-medium">
                    {car.make} {car.model}
                  </div>
                  <div>${car.price.toLocaleString()}</div>
                  <div className="capitalize">{car.status}</div>
                  <div>{car.seller}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
