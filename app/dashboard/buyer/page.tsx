import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { requireAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Car, ShoppingCart, ThumbsUp, Eye, Clock, CheckCircle } from "lucide-react"

export default async function BuyerDashboard() {
  const user = await requireAuth("buyer")

  // Fetch buyer stats
  const [offerCountResult, acceptedCountResult, purchaseCountResult] = await Promise.all([
    executeQuery<any[]>("SELECT COUNT(*) as count FROM offers WHERE buyer_id = ?", [user.id]),
    executeQuery<any[]>('SELECT COUNT(*) as count FROM offers WHERE buyer_id = ? AND status = "accepted"', [user.id]),
    executeQuery<any[]>("SELECT COUNT(*) as count FROM purchases WHERE buyer_id = ?", [user.id]),
  ])

  const offerCount = offerCountResult[0]?.count || 0
  const acceptedCount = acceptedCountResult[0]?.count || 0
  const purchaseCount = purchaseCountResult[0]?.count || 0

  // Fetch recent offers
  const recentOffers = await executeQuery<any[]>(
    `SELECT o.id, o.amount, o.status, o.created_at, c.make, c.model, c.year, c.price, u.username as seller,
     (SELECT image_url FROM car_images WHERE car_id = c.id AND is_primary = TRUE LIMIT 1) as image_url
     FROM offers o 
     JOIN cars c ON o.car_id = c.id 
     JOIN users u ON c.seller_id = u.id 
     WHERE o.buyer_id = ? 
     ORDER BY o.created_at DESC LIMIT 5`,
    [user.id],
  )

  // Fetch recommended cars
  const recommendedCars = await executeQuery<any[]>(
    `SELECT c.id, c.make, c.model, c.year, c.price, u.username as seller,
     (SELECT image_url FROM car_images WHERE car_id = c.id AND is_primary = TRUE LIMIT 1) as image_url
     FROM cars c
     JOIN users u ON c.seller_id = u.id
     WHERE c.status = 'available'
     ORDER BY c.created_at DESC
     LIMIT 3`,
  )

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
                        <Image
                          src={offer.image_url || "/images/car1.png"}
                          alt={`${offer.make} ${offer.model}`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=50&width=70"
                          }}
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
                    <Image
                      src={car.image_url || "/images/car1.png"}
                      alt={`${car.make} ${car.model}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=200&width=300"
                      }}
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
}
