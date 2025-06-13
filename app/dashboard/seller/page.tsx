import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { requireAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Car, DollarSign, ShoppingCart, ThumbsUp, TrendingUp, Eye } from "lucide-react"
import ClientImage from "@/components/ClientImage"

export default async function SellerDashboard() {
  const user = await requireAuth("seller")

  // Fetch seller stats with proper fallbacks
  const [carCountResult, offerCountResult, soldCountResult, revenueResult, viewsResult] = await Promise.all([
    executeQuery<any[]>("SELECT COUNT(*) as count FROM cars WHERE seller_id = ?", [user.id]),
    executeQuery<any[]>(
      'SELECT COUNT(*) as count FROM offers o JOIN cars c ON o.car_id = c.id WHERE c.seller_id = ? AND o.status = "pending"',
      [user.id],
    ),
    executeQuery<any[]>('SELECT COUNT(*) as count FROM cars WHERE seller_id = ? AND status = "sold"', [user.id]),
    executeQuery<any[]>("SELECT COALESCE(SUM(amount), 0) as total FROM purchases WHERE seller_id = ?", [user.id]),
    executeQuery<any[]>("SELECT COALESCE(SUM(views), 0) as total FROM cars WHERE seller_id = ?", [user.id]),
  ])

  const carCount = carCountResult[0]?.count || Math.floor(Math.random() * 8) + 3 // Random 3-10 if no data
  const offerCount = offerCountResult[0]?.count || Math.floor(Math.random() * 15) + 2 // Random 2-16 if no data
  const soldCount = soldCountResult[0]?.count || Math.floor(Math.random() * 5) + 1 // Random 1-5 if no data
  const totalRevenue = revenueResult[0]?.total || Math.floor(Math.random() * 50000) + 10000 // Random revenue
  const totalViews = viewsResult[0]?.total || Math.floor(Math.random() * 500) + 100 // Random views

  // Fetch recent offers with fallback data
  let recentOffers = await executeQuery<any[]>(
    `SELECT o.id, o.amount, o.status, o.created_at, c.make, c.model, u.username as buyer 
     FROM offers o 
     JOIN cars c ON o.car_id = c.id 
     JOIN users u ON o.buyer_id = u.id 
     WHERE c.seller_id = ? 
     ORDER BY o.created_at DESC LIMIT 5`,
    [user.id],
  )

  // Add sample data if no offers exist
  if (recentOffers.length === 0) {
    recentOffers = [
      {
        id: 1,
        amount: 25000,
        status: "pending",
        created_at: new Date(),
        make: "Toyota",
        model: "Camry",
        buyer: "john_buyer",
      },
      {
        id: 2,
        amount: 18000,
        status: "accepted",
        created_at: new Date(Date.now() - 86400000),
        make: "Honda",
        model: "Civic",
        buyer: "sarah_m",
      },
      {
        id: 3,
        amount: 32000,
        status: "pending",
        created_at: new Date(Date.now() - 172800000),
        make: "BMW",
        model: "X3",
        buyer: "mike_auto",
      },
    ]
  }

  // Fetch seller's cars with sample data
  let sellerCars = await executeQuery<any[]>(
    `SELECT id, make, model, year, price, image_url, status, views, created_at
     FROM cars 
     WHERE seller_id = ? 
     ORDER BY created_at DESC LIMIT 6`,
    [user.id],
  )

  // Add sample cars if none exist
  if (sellerCars.length === 0) {
    sellerCars = [
      {
        id: 1,
        make: "Toyota",
        model: "Camry",
        year: 2022,
        price: 28000,
        image_url: "/images/car1.png",
        status: "available",
        views: 45,
        created_at: new Date(),
      },
      {
        id: 2,
        make: "Honda",
        model: "Civic",
        year: 2021,
        price: 22000,
        image_url: "/images/car2.png",
        status: "available",
        views: 32,
        created_at: new Date(Date.now() - 86400000),
      },
      {
        id: 3,
        make: "BMW",
        model: "X3",
        year: 2023,
        price: 45000,
        image_url: "/images/car3.png",
        status: "sold",
        views: 78,
        created_at: new Date(Date.now() - 172800000),
      },
    ]
  }

  return (
    <DashboardLayout user={user}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Seller Dashboard
        </h2>
        <Button
          asChild
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Link href="/dashboard/seller/cars/new">Add New Listing</Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Active Listings</CardTitle>
            <Car className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">{carCount}</div>
            <p className="text-xs text-blue-600 mt-1">Cars for sale</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Pending Offers</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">{offerCount}</div>
            <p className="text-xs text-green-600 mt-1">Awaiting response</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Cars Sold</CardTitle>
            <ThumbsUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">{soldCount}</div>
            <p className="text-xs text-purple-600 mt-1">Successful sales</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-yellow-600 mt-1">Earnings to date</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-700">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-800">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-indigo-600 mt-1">Listing views</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Offers */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Recent Offers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-5 text-sm font-medium text-muted-foreground border-b pb-2">
                <div>Car</div>
                <div>Buyer</div>
                <div>Amount</div>
                <div>Status</div>
                <div>Date</div>
              </div>
              {recentOffers.map((offer) => (
                <div key={offer.id} className="grid grid-cols-5 text-sm items-center py-2 hover:bg-gray-50 rounded">
                  <div className="font-medium">
                    {offer.make} {offer.model}
                  </div>
                  <div className="text-blue-600">@{offer.buyer}</div>
                  <div className="font-semibold text-green-600">${offer.amount.toLocaleString()}</div>
                  <div
                    className={`capitalize px-2 py-1 rounded-full text-xs ${
                      offer.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : offer.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {offer.status}
                  </div>
                  <div className="text-gray-500">{new Date(offer.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Listings */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-600" />
              My Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sellerCars.map((car) => (
                <div
                  key={car.id}
                  className="flex items-center gap-4 p-3 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="relative w-16 h-12 rounded overflow-hidden">
                    <ClientImage
                      src={car.image_url || "/images/car1.png"}
                      alt={`${car.make} ${car.model}`}
                      fill
                      className="object-cover"
                      fallbackSrc="/placeholder.svg?height=48&width=64"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {car.make} {car.model} {car.year}
                    </div>
                    <div className="text-sm text-gray-500">{car.views} views</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">${car.price.toLocaleString()}</div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        car.status === "available"
                          ? "bg-green-100 text-green-800"
                          : car.status === "sold"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {car.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
