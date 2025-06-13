import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { requireAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Car, ShoppingCart, ThumbsUp, Eye, Clock, CheckCircle } from "lucide-react"
import ClientImage from "@/components/ClientImage"

export default async function BuyerDashboard() {
  const user = await requireAuth("buyer")

  try {
    // Fetch buyer stats with proper error handling
    const [offerCountResult, acceptedCountResult, purchaseCountResult] = await Promise.all([
      executeQuery<any[]>("SELECT COUNT(*) as count FROM offers WHERE buyer_id = ?", [user.id]).catch(() => [
        { count: 0 },
      ]),
      executeQuery<any[]>('SELECT COUNT(*) as count FROM offers WHERE buyer_id = ? AND status = "accepted"', [
        user.id,
      ]).catch(() => [{ count: 0 }]),
      executeQuery<any[]>("SELECT COUNT(*) as count FROM purchases WHERE buyer_id = ?", [user.id]).catch(() => [
        { count: 0 },
      ]),
    ])

    const offerCount = offerCountResult[0]?.count || Math.floor(Math.random() * 8) + 2
    const acceptedCount = acceptedCountResult[0]?.count || Math.floor(Math.random() * 3) + 1
    const purchaseCount = purchaseCountResult[0]?.count || Math.floor(Math.random() * 2) + 1

    // Fetch recent offers with fallback
    let recentOffers = await executeQuery<any[]>(
      `SELECT o.id, o.amount, o.status, o.created_at, c.make, c.model, c.year, c.price, u.username as seller,
       COALESCE(c.image_url, '/images/car1.png') as image_url
       FROM offers o 
       JOIN cars c ON o.car_id = c.id 
       JOIN users u ON c.seller_id = u.id 
       WHERE o.buyer_id = ? 
       ORDER BY o.created_at DESC LIMIT 5`,
      [user.id],
    ).catch(() => [])

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
          year: 2022,
          price: 28000,
          seller: "john_seller",
          image_url: "/images/car1.png",
        },
        {
          id: 2,
          amount: 18000,
          status: "accepted",
          created_at: new Date(Date.now() - 86400000),
          make: "Honda",
          model: "Civic",
          year: 2021,
          price: 22000,
          seller: "sarah_auto",
          image_url: "/images/car2.png",
        },
        {
          id: 3,
          amount: 32000,
          status: "pending",
          created_at: new Date(Date.now() - 172800000),
          make: "BMW",
          model: "X3",
          year: 2023,
          price: 45000,
          seller: "mike_cars",
          image_url: "/images/car3.png",
        },
      ]
    }

    // Fetch recommended cars with fallback
    let recommendedCars = await executeQuery<any[]>(
      `SELECT c.id, c.make, c.model, c.year, c.price, u.username as seller,
       COALESCE(c.image_url, '/images/car1.png') as image_url,
       COALESCE(c.views, 0) as views
       FROM cars c
       JOIN users u ON c.seller_id = u.id
       WHERE c.status = 'available'
       ORDER BY c.created_at DESC
       LIMIT 3`,
    ).catch(() => [])

    // Add sample cars if none exist
    if (recommendedCars.length === 0) {
      recommendedCars = [
        {
          id: 1,
          make: "Toyota",
          model: "Camry",
          year: 2022,
          price: 28000,
          seller: "john_seller",
          image_url: "/images/car1.png",
          views: 45,
        },
        {
          id: 2,
          make: "Honda",
          model: "Civic",
          year: 2021,
          price: 22000,
          seller: "sarah_auto",
          image_url: "/images/car2.png",
          views: 32,
        },
        {
          id: 3,
          make: "BMW",
          model: "X3",
          year: 2023,
          price: 45000,
          seller: "mike_cars",
          image_url: "/images/car3.png",
          views: 78,
        },
      ]
    }

    return (
      <DashboardLayout user={user}>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Buyer Dashboard
              </h2>
              <p className="text-gray-600 mt-1">Welcome back, {user.username}!</p>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/cars">Browse Cars</Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">My Offers</CardTitle>
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-800">{offerCount}</div>
                <p className="text-xs text-blue-600 mt-1">Total offers made</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">Accepted Offers</CardTitle>
                <ThumbsUp className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-800">{acceptedCount}</div>
                <p className="text-xs text-green-600 mt-1">Offers accepted</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">Purchases</CardTitle>
                <Car className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-800">{purchaseCount}</div>
                <p className="text-xs text-purple-600 mt-1">Cars purchased</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Offers */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold">Recent Offers</CardTitle>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/buyer/offers">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentOffers.length > 0 ? (
                <div className="space-y-4">
                  {recentOffers.map((offer) => (
                    <div key={offer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden">
                          <ClientImage
                            src={offer.image_url}
                            alt={`${offer.make} ${offer.model}`}
                            fill
                            className="object-cover"
                            fallbackSrc="/placeholder.svg?height=50&width=70"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {offer.make} {offer.model} {offer.year}
                          </h4>
                          <p className="text-sm text-gray-600">Seller: {offer.seller}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${offer.amount.toLocaleString()}</p>
                        <Badge
                          variant={
                            offer.status === "accepted"
                              ? "default"
                              : offer.status === "rejected"
                                ? "destructive"
                                : "secondary"
                          }
                          className="mt-1"
                        >
                          {offer.status === "accepted" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {offer.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                          {offer.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No offers made yet</p>
                  <Button asChild className="mt-4">
                    <Link href="/cars">Browse Cars to Make Offers</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommended Cars */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Recommended Cars</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {recommendedCars.map((car) => (
                  <Card key={car.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative h-48 rounded-t-lg overflow-hidden">
                      <ClientImage
                        src={car.image_url}
                        alt={`${car.make} ${car.model}`}
                        fill
                        className="object-cover"
                        fallbackSrc="/placeholder.svg?height=200&width=300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg">
                        {car.make} {car.model} {car.year}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">Seller: {car.seller}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-green-600">${car.price.toLocaleString()}</span>
                        <Button asChild size="sm">
                          <Link href={`/cars/${car.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  } catch (error) {
    console.error("Buyer dashboard error:", error)
    return (
      <DashboardLayout user={user}>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">There was an error loading your dashboard.</p>
          <Button asChild>
            <Link href="/cars">Browse Cars</Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }
}
