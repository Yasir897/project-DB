import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { requireAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ArrowLeft, Clock, CheckCircle, XCircle, Eye } from "lucide-react"

export default async function BuyerOffersPage() {
  const user = await requireAuth("buyer")

  // Fetch all offers made by the buyer
  const offers = await executeQuery<any[]>(
    `SELECT o.id, o.amount, o.status, o.created_at, o.message,
     c.id as car_id, c.make, c.model, c.year, c.price, c.mileage,
     u.username as seller,
     (SELECT image_url FROM car_images WHERE car_id = c.id AND is_primary = TRUE LIMIT 1) as image_url
     FROM offers o 
     JOIN cars c ON o.car_id = c.id 
     JOIN users u ON c.seller_id = u.id 
     WHERE o.buyer_id = ? 
     ORDER BY o.created_at DESC`,
    [user.id],
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/buyer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Offers
            </h2>
            <p className="text-gray-600 mt-1">Track all your car offers</p>
          </div>
        </div>

        {/* Offers List */}
        {offers.length > 0 ? (
          <div className="space-y-4">
            {offers.map((offer) => (
              <Card key={offer.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Car Image */}
                    <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={offer.image_url || "/images/car1.png"}
                        alt={`${offer.make} ${offer.model}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=130&width=200"
                        }}
                      />
                    </div>

                    {/* Car Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {offer.make} {offer.model} {offer.year}
                          </h3>
                          <p className="text-gray-600">Seller: {offer.seller}</p>
                          <p className="text-sm text-gray-500">
                            {offer.mileage ? `${offer.mileage.toLocaleString()} miles` : "Mileage not specified"}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(offer.status)} border`}>
                          {getStatusIcon(offer.status)}
                          <span className="ml-1 capitalize">{offer.status}</span>
                        </Badge>
                      </div>

                      {/* Offer Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Asking Price</p>
                          <p className="text-lg font-semibold text-gray-900">${offer.price.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Your Offer</p>
                          <p className="text-lg font-bold text-blue-600">${offer.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Offer Date</p>
                          <p className="text-sm text-gray-900">{new Date(offer.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Message */}
                      {offer.message && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-1">Your Message</p>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{offer.message}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/cars/${offer.car_id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Car
                          </Link>
                        </Button>
                        {offer.status === "accepted" && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Complete Purchase
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Offers Yet</h3>
              <p className="text-gray-600 mb-6">You haven't made any offers on cars yet.</p>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Link href="/cars">Browse Cars</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
