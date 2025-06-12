import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { requireAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Car, ShoppingCart, ThumbsUp } from "lucide-react"

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
    `SELECT o.id, o.amount, o.status, o.created_at, c.make, c.model, u.username as seller 
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Buyer Dashboard</h2>
        <Button asChild>
          <Link href="/cars">Browse Cars</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Offers</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offerCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted Offers</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acceptedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Purchases</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchaseCount}</div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
