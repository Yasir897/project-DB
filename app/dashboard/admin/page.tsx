import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { requireAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getRecentActivities, getTopSellers, getPopularCars } from "@/lib/db-queries"
import { Car, DollarSign, ShoppingCart, Users, Activity, TrendingUp } from "lucide-react"
import ClientImage from "@/components/ClientImage"

export default async function AdminDashboard() {
  const user = await requireAuth("admin")

  // Fetch dashboard stats
  const [userCountResult, carCountResult, offerCountResult, revenueResult] = await Promise.all([
    executeQuery<any[]>("SELECT COUNT(*) as count FROM users"),
    executeQuery<any[]>("SELECT COUNT(*) as count FROM cars"),
    executeQuery<any[]>("SELECT COUNT(*) as count FROM offers"),
    executeQuery<any[]>("SELECT COALESCE(SUM(amount), 0) as total FROM purchases"),
  ])

  const userCount = userCountResult[0]?.count || 0
  const carCount = carCountResult[0]?.count || 0
  const offerCount = offerCountResult[0]?.count || 0
  const totalRevenue = revenueResult[0]?.total || 0

  // Fetch recent activities using fixed query
  const recentActivities = await executeQuery<any[]>(getRecentActivities)

  // Fetch top sellers using fixed query
  const topSellers = await executeQuery<any[]>(getTopSellers)

  // Fetch popular cars using fixed query
  const popularCars = await executeQuery<any[]>(getPopularCars)

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h2>
          <div className="flex gap-2">
            <Button variant="outline">Export Data</Button>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
              System Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{userCount}</div>
              <p className="text-xs text-blue-600 mt-1">Registered users</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Total Cars</CardTitle>
              <Car className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">{carCount}</div>
              <p className="text-xs text-green-600 mt-1">Listed vehicles</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">Total Offers</CardTitle>
              <ShoppingCart className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-800">{offerCount}</div>
              <p className="text-xs text-yellow-600 mt-1">Active offers</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-purple-600 mt-1">Platform earnings</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Activities */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "new_user"
                          ? "bg-blue-500"
                          : activity.type === "new_car"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{activity.name}</div>
                      <div className="text-xs text-gray-500">{activity.details}</div>
                    </div>
                    <div className="text-xs text-gray-400">{new Date(activity.date).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Sellers */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Top Sellers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topSellers.map((seller, index) => (
                  <div key={seller.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{seller.username}</div>
                      <div className="text-xs text-gray-500">
                        {seller.total_cars} cars • {seller.cars_sold} sold
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-green-600">${seller.total_revenue.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Cars */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-purple-600" />
                Popular Cars
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularCars.map((car) => (
                  <div key={car.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <div className="relative w-12 h-8 rounded overflow-hidden">
                      <ClientImage
                        src={car.image_url || "/images/car1.png"}
                        alt={`${car.make} ${car.model}`}
                        fill
                        className="object-cover"
                        fallbackSrc="/placeholder.svg?height=32&width=48"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {car.make} {car.model}
                      </div>
                      <div className="text-xs text-gray-500">{car.offer_count} offers</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">${car.price.toLocaleString()}</div>
                      {car.highest_offer && (
                        <div className="text-xs text-green-600">High: ${car.highest_offer.toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
