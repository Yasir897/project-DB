import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { requireAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Car, DollarSign, ShoppingCart, ThumbsUp } from "lucide-react"

export default async function SellerDashboard() {
  const user = await requireAuth("seller")

  // Fetch seller stats
  const [carCountResult, offerCountResult, soldCountResult, revenueResult] = await Promise.all([
    executeQuery<any[]>("SELECT COUNT(*) as count FROM cars WHERE seller_id = ?", [user.id]),
    executeQuery<any[]>(
      'SELECT COUNT(*) as count FROM offers o JOIN cars c ON o.car_id = c.id WHERE c.seller_id = ? AND o.status = "pending"',
      [user.id],
    ),
    executeQuery<any[]>('SELECT COUNT(*) as count FROM cars WHERE seller_id = ? AND status = "sold"', [user.id]),
    executeQuery<any[]>("SELECT SUM(amount) as total FROM purchases WHERE seller_id = ?", [user.id]),
  ])

  const carCount = carCountResult[0]?.count || 0
  const offerCount = offerCountResult[0]?.count || 0
  const soldCount = soldCountResult[0]?.count || 0
  const totalRevenue = revenueResult[0]?.total || 0

  // Fetch recent offers
  const recentOffers = await executeQuery<any[]>(
    `SELECT o.id, o.amount, o.status, o.created_at, c.make, c.model, u.username as buyer 
     FROM offers o 
     JOIN cars c ON o.car_id = c.id 
     JOIN users u ON o.buyer_id = u.id 
     WHERE c.seller_id = ? 
     ORDER BY o.created_at DESC LIMIT 5`,
    [user.id],
  )

  return (
    <DashboardLayout user={user}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Seller Dashboard</h2>
        <Button asChild>
          <Link href="/dashboard/seller/cars/new">Add New Listing</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{carCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Offers</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offerCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cars Sold</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{soldCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-5 text-sm font-medium text-muted-foreground">
              <div>Car</div>
              <div>Buyer</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Date</div>
            </div>
            {recentOffers.length > 0 ? (
              recentOffers.map((offer) => (
                <div key={offer.id} className="grid grid-cols-5 text-sm">
                  <div className="font-medium">
                    {offer.make} {offer.model}
                  </div>
                  <div>{offer.buyer}</div>
                  <div>${offer.amount.toLocaleString()}</div>
                  <div className="capitalize">{offer.status}</div>
                  <div>{new Date(offer.created_at).toLocaleDateString()}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">No offers received yet</div>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
