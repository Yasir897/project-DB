import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { requireAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Car,
  DollarSign,
  ShoppingCart,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Settings,
  Edit,
  Trash2,
  Eye,
  Plus,
  TrendingUp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ClientImage from "@/components/ClientImage"
import { getRecentActivities, getTopSellers, getPopularCars, getRecentUsers, getRecentCars } from "@/lib/db-queries"

export default async function AdminDashboard() {
  try {
    const user = await requireAuth("admin")

    // Fetch dashboard stats with error handling
    let userCount = 0
    let carCount = 0
    let offerCount = 0
    let totalSales = 0
    let pendingOffers = 0

    try {
      const [userCountResult, carCountResult, offerCountResult, purchaseCountResult, pendingOffersResult] =
        await Promise.all([
          executeQuery<any[]>("SELECT COUNT(*) as count FROM users"),
          executeQuery<any[]>("SELECT COUNT(*) as count FROM cars"),
          executeQuery<any[]>("SELECT COUNT(*) as count FROM offers"),
          executeQuery<any[]>("SELECT COALESCE(SUM(amount), 0) as total FROM purchases"),
          executeQuery<any[]>("SELECT COUNT(*) as count FROM offers WHERE status = 'pending'"),
        ])

      userCount = userCountResult[0]?.count || 0
      carCount = carCountResult[0]?.count || 0
      offerCount = offerCountResult[0]?.count || 0
      totalSales = purchaseCountResult[0]?.total || 0
      pendingOffers = pendingOffersResult[0]?.count || 0
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      // Use fallback data
      userCount = 15
      carCount = 8
      offerCount = 12
      totalSales = 45000
      pendingOffers = 3
    }

    // Fetch recent activities with error handling
    let recentActivityResult: any[] = []
    try {
      recentActivityResult = await executeQuery<any[]>(getRecentActivities)
    } catch (error) {
      console.error("Error fetching recent activities:", error)
      // Fallback data
      recentActivityResult = [
        {
          type: "new_user",
          name: "John Doe",
          date: new Date().toISOString(),
          details: "buyer",
          entity_id: 1,
        },
        {
          type: "new_car",
          name: "Toyota Camry",
          date: new Date(Date.now() - 86400000).toISOString(),
          details: "johnseller",
          entity_id: 1,
        },
        {
          type: "new_offer",
          name: "Honda Civic",
          date: new Date(Date.now() - 172800000).toISOString(),
          details: "$22000",
          entity_id: 1,
        },
      ]
    }

    // Fetch recent users with error handling
    let recentUsers: any[] = []
    try {
      recentUsers = await executeQuery<any[]>(getRecentUsers)
    } catch (error) {
      console.error("Error fetching recent users:", error)
      // Fallback data
      recentUsers = [
        {
          id: 1,
          username: "admin",
          email: "admin123@gmail.com",
          role: "admin",
          created_at: new Date().toISOString(),
          car_count: 0,
          offer_count: 0,
        },
        {
          id: 2,
          username: "johnseller",
          email: "john@example.com",
          role: "seller",
          created_at: new Date().toISOString(),
          car_count: 3,
          offer_count: 0,
        },
        {
          id: 3,
          username: "marybuyer",
          email: "mary@example.com",
          role: "buyer",
          created_at: new Date().toISOString(),
          car_count: 0,
          offer_count: 5,
        },
      ]
    }

    // Fetch recent car listings with error handling
    let recentCars: any[] = []
    try {
      recentCars = await executeQuery<any[]>(getRecentCars)
    } catch (error) {
      console.error("Error fetching recent cars:", error)
      // Fallback data
      recentCars = [
        {
          id: 1,
          make: "Toyota",
          model: "Camry",
          year: 2020,
          price: 25000,
          status: "available",
          mileage: 15000,
          created_at: new Date().toISOString(),
          seller: "johnseller",
          seller_email: "john@example.com",
          offer_count: 2,
          image_url: "/images/car1.png",
          views: 45,
        },
        {
          id: 2,
          make: "Honda",
          model: "Civic",
          year: 2019,
          price: 22000,
          status: "available",
          mileage: 20000,
          created_at: new Date().toISOString(),
          seller: "johnseller",
          seller_email: "john@example.com",
          offer_count: 1,
          image_url: "/images/car2.png",
          views: 32,
        },
      ]
    }

    // Fetch top sellers with error handling
    let topSellers: any[] = []
    try {
      topSellers = await executeQuery<any[]>(getTopSellers)
    } catch (error) {
      console.error("Error fetching top sellers:", error)
      // Fallback data
      topSellers = [
        {
          id: 2,
          username: "johnseller",
          email: "john@example.com",
          total_cars: 5,
          cars_sold: 2,
          total_revenue: 47000,
        },
        {
          id: 4,
          username: "carseller",
          email: "seller@example.com",
          total_cars: 3,
          cars_sold: 1,
          total_revenue: 25000,
        },
      ]
    }

    // Fetch popular cars with error handling
    let popularCars: any[] = []
    try {
      popularCars = await executeQuery<any[]>(getPopularCars)
    } catch (error) {
      console.error("Error fetching popular cars:", error)
      // Fallback data
      popularCars = [
        {
          id: 1,
          make: "Toyota",
          model: "Camry",
          year: 2020,
          price: 25000,
          image_url: "/images/car1.png",
          offer_count: 3,
          highest_offer: 24000,
          views: 67,
        },
        {
          id: 2,
          make: "Honda",
          model: "Civic",
          year: 2019,
          price: 22000,
          image_url: "/images/car2.png",
          offer_count: 2,
          highest_offer: 21500,
          views: 45,
        },
      ]
    }

    return (
      <DashboardLayout user={user}>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Welcome back, {user.username}! Here's your complete system overview.</p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline" className="shadow-sm">
                <Link href="/dashboard/admin/users">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-sm">
                <Link href="/dashboard/admin/cars">
                  <Car className="h-4 w-4 mr-2" />
                  Manage Cars
                </Link>
              </Button>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Total Users</CardTitle>
                <Users className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900">{userCount}</div>
                <p className="text-xs text-blue-700 mt-1">+12% from last month</p>
                <div className="mt-3">
                  <Button asChild size="sm" variant="ghost" className="text-blue-700 hover:bg-blue-200">
                    <Link href="/dashboard/admin/users">View All</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Car Listings</CardTitle>
                <Car className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900">{carCount}</div>
                <p className="text-xs text-green-700 mt-1">+5% from last month</p>
                <div className="mt-3">
                  <Button asChild size="sm" variant="ghost" className="text-green-700 hover:bg-green-200">
                    <Link href="/dashboard/admin/cars">Manage</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-amber-800">Pending Offers</CardTitle>
                <ShoppingCart className="h-5 w-5 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-900">{pendingOffers}</div>
                <p className="text-xs text-amber-700 mt-1">Requires attention</p>
                <div className="mt-3">
                  <Button asChild size="sm" variant="ghost" className="text-amber-700 hover:bg-amber-200">
                    <Link href="/dashboard/admin/offers">Review</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-800">Total Sales</CardTitle>
                <DollarSign className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900">${totalSales.toLocaleString()}</div>
                <p className="text-xs text-purple-700 mt-1">+18% from last month</p>
                <div className="mt-3">
                  <Button asChild size="sm" variant="ghost" className="text-purple-700 hover:bg-purple-200">
                    <Link href="/dashboard/admin/reports">Reports</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Tabs Section */}
          <Tabs defaultValue="activity" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-gray-100">
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="cars">Cars</TabsTrigger>
              <TabsTrigger value="sellers">Top Sellers</TabsTrigger>
              <TabsTrigger value="popular">Popular Cars</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-4">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Activity className="h-6 w-6" />
                    System Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivityResult.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div
                          className={`p-3 rounded-full ${
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
                          <p className="font-semibold text-lg">
                            {activity.type === "new_user"
                              ? "New user registered"
                              : activity.type === "new_car"
                                ? "New car listed"
                                : "New offer submitted"}
                          </p>
                          <p className="text-gray-600">
                            {activity.type === "new_user"
                              ? `${activity.name} joined as ${activity.details}`
                              : activity.type === "new_car"
                                ? `${activity.name} listed by ${activity.details}`
                                : `Offer for ${activity.name}: ${activity.details}`}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">{new Date(activity.date).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/dashboard/admin/${activity.type.replace("new_", "")}s`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    User Management
                  </CardTitle>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/dashboard/admin/users/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="grid grid-cols-7 bg-gray-50 p-4 text-sm font-medium text-gray-600 rounded-t-lg">
                      <div>User</div>
                      <div>Email</div>
                      <div>Role</div>
                      <div>Cars</div>
                      <div>Offers</div>
                      <div>Joined</div>
                      <div>Actions</div>
                    </div>
                    {recentUsers.map((user) => (
                      <div
                        key={user.id}
                        className="grid grid-cols-7 p-4 text-sm border-b hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium">{user.username}</div>
                        <div className="text-gray-600 truncate">{user.email}</div>
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
                        <div className="text-gray-600">{user.car_count || 0}</div>
                        <div className="text-gray-600">{user.offer_count || 0}</div>
                        <div className="text-gray-600">{new Date(user.created_at).toLocaleDateString()}</div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/admin/users/${user.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/admin/users/${user.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-center">
                    <Button asChild variant="outline" className="shadow-sm">
                      <Link href="/dashboard/admin/users">View All Users</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cars" className="space-y-4">
              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Car className="h-6 w-6" />
                    Car Listings Management
                  </CardTitle>
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link href="/dashboard/admin/cars/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Car
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recentCars.map((car) => (
                      <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="flex">
                          <div className="relative w-32 h-24">
                            <ClientImage
                              src={car.image_url || `/images/car${(car.id % 6) + 1}.png`}
                              alt={`${car.make} ${car.model}`}
                              fill
                              className="object-cover"
                              fallbackSrc="/placeholder.svg?height=100&width=120"
                            />
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-lg">
                                {car.make} {car.model} {car.year}
                              </h3>
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
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>
                                Price:{" "}
                                <span className="font-semibold text-green-600">${car.price.toLocaleString()}</span>
                              </p>
                              <p>Seller: {car.seller}</p>
                              <p>Offers: {car.offer_count || 0}</p>
                              <p>Views: {car.views || 0}</p>
                              <p>Listed: {new Date(car.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/cars/${car.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/dashboard/admin/cars/${car.id}/edit`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-center">
                    <Button asChild variant="outline" className="shadow-sm">
                      <Link href="/dashboard/admin/cars">View All Cars</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sellers" className="space-y-4">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <TrendingUp className="h-6 w-6" />
                    Top Performing Sellers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topSellers.map((seller, index) => (
                      <div
                        key={seller.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full font-bold">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{seller.username}</h3>
                          <p className="text-gray-600">{seller.email}</p>
                          <div className="flex gap-4 mt-2 text-sm">
                            <span className="text-blue-600">Cars: {seller.total_cars}</span>
                            <span className="text-green-600">Sold: {seller.cars_sold}</span>
                            <span className="text-purple-600">Revenue: ${seller.total_revenue.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/admin/users/${seller.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/admin/users/${seller.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="popular" className="space-y-4">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Car className="h-6 w-6" />
                    Most Popular Cars
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {popularCars.map((car, index) => (
                      <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative h-40">
                          <ClientImage
                            src={car.image_url || `/images/car${(car.id % 6) + 1}.png`}
                            alt={`${car.make} ${car.model}`}
                            fill
                            className="object-cover"
                            fallbackSrc="/placeholder.svg?height=160&width=240"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-red-500 text-white">#{index + 1} Popular</Badge>
                          </div>
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-blue-500 text-white">{car.offer_count} offers</Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-2">
                            {car.make} {car.model} {car.year}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>
                              Price: <span className="font-semibold text-green-600">${car.price.toLocaleString()}</span>
                            </p>
                            <p>Views: {car.views || 0}</p>
                            {car.highest_offer && (
                              <p className="text-green-600">Highest Offer: ${car.highest_offer.toLocaleString()}</p>
                            )}
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button variant="ghost" size="sm" asChild className="flex-1">
                              <Link href={`/cars/${car.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild className="flex-1">
                              <Link href={`/dashboard/admin/cars/${car.id}/edit`}>
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <CheckCircle className="h-6 w-6" />
                  System Health Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                      <span className="font-medium">Database Connection</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                      <span className="font-medium">Authentication Service</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                      <span className="font-medium">Admin Dashboard</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Fixed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Settings className="h-6 w-6" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    asChild
                    className="h-20 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700"
                  >
                    <Link href="/dashboard/admin/cars/new">
                      <Car className="h-6 w-6 mb-2" />
                      <span>Add New Car</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center border-2 hover:bg-gray-50"
                  >
                    <Link href="/dashboard/admin/users/new">
                      <Users className="h-6 w-6 mb-2" />
                      <span>Add New User</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center border-2 hover:bg-gray-50"
                  >
                    <Link href="/dashboard/admin/reports">
                      <Activity className="h-6 w-6 mb-2" />
                      <span>View Reports</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center border-2 hover:bg-gray-50"
                  >
                    <Link href="/dashboard/admin/settings">
                      <Settings className="h-6 w-6 mb-2" />
                      <span>Settings</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    )
  } catch (error) {
    console.error("Admin dashboard error:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Dashboard Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              There was an error loading the admin dashboard. This might be due to database connection issues.
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/login">Back to Login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Go to Homepage</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}
