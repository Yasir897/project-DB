import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { requireAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ArrowLeft, Clock, CheckCircle, XCircle, Eye, MessageSquare } from "lucide-react"

export default async function BuyerOffersPage() {
  const user = await requireAuth("buyer")

  // Fetch all offers made by this buyer
  const offers = await executeQuery<any[]>(
    `SELECT o.id, o.amount, o.status, o.message, o.created_at, o.updated_at,
     c.id as car_id, c.make, c.model, c.year, c.price, c.status as car_status,
     u.username as seller_name, u.email as seller_email,
     (SELECT image_url FROM car_images WHERE car_id = c.id AND is_primary = TRUE LIMIT 1) as image_url
     FROM offers o 
     JOIN cars c ON o.car_id = c.id 
     JOIN users u ON c.seller_id = u.id 
     WHERE o.buyer_id = ? 
     ORDER BY o.created_at DESC`,
    [user.id],
  )

  const pendingOffers = offers.filter((offer) => offer.status === "pending")
  const acceptedOffers = offers.filter((offer) => offer.status === "accepted")
  const rejectedOffers = offers.filter((offer) => offer.status === "rejected")

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/buyer">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Offers
            </h1>
            <p className="text-gray-600">Track all your car offers in one place</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">Pending Offers</CardTitle>
              <Clock className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-800">{pendingOffers.length}</div>
              <p className="text-xs text-yellow-600 mt-1">Awaiting response</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Accepted Offers</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-800">{acceptedOffers.length}</div>
              <p className="text-xs text-green-600 mt-1">Ready to purchase</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Rejected Offers</CardTitle>
              <XCircle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-800">{rejectedOffers.length}</div>
              <p className="text-xs text-red-600 mt-1">Not accepted</p>
            </CardContent>
          </Card>
        </div>

        {/* All Offers */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">All Offers</CardTitle>
          </CardHeader>
          <CardContent>
            {offers.length > 0 ? (
              <div className="space-y-6">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-white to-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="relative w-24 h-16 rounded-lg overflow-hidden shadow-md">
                          <Image
                            src={offer.image_url || "/images/car1.png"}
                            alt={`${offer.make} ${offer.model}`}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg?height=70&width=100"
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">
                            {offer.make} {offer.model} {offer.year}
                          </h3>
                          <p className="text-gray-600 mb-2">Seller: {offer.seller_name}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Listed Price: ${offer.price.toLocaleString()}</span>
                            <span>•</span>
                            <span>Offered: ${offer.amount.toLocaleString()}</span>
                            <span>•</span>
                            <span>Submitted: {new Date(offer.created_at).toLocaleDateString()}</span>
                          </div>
                          {offer.message && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                              <div className="flex items-start gap-2">
                                <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                                <p className="text-sm text-blue-800">{offer.message}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            offer.status === "accepted"
                              ? "default"
                              : offer.status === "rejected"
                                ? "destructive"
                                : "secondary"
                          }
                          className="mb-3"
                        >
                          {offer.status === "accepted" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {offer.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                          {offer.status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
                          {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                        </Badge>
                        <div className="space-y-2">
                          <Button asChild size="sm" variant="outline" className="w-full">
                            <Link href={`/cars/${offer.car_id}`}>
                              <Eye className="w-4 h-4 mr-1" />
                              View Car
                            </Link>
                          </Button>
                          {offer.status === "accepted" && (
                            <Button size="sm" className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white">
                              Complete Purchase
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Offers Yet</h3>
                <p className="text-gray-500 mb-6">You haven't made any offers on cars yet.</p>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <Link href="/cars">Browse Cars to Make Offers</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
