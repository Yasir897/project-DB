import Link from "next/link"
import Image from "next/image"
import { requireAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle } from "lucide-react"

export default async function SellerCarsPage() {
  const user = await requireAuth("seller")

  // Fetch seller's cars
  const cars = await executeQuery<any[]>(
    `SELECT c.*, 
     (SELECT image_url FROM car_images WHERE car_id = c.id AND is_primary = TRUE LIMIT 1) as image_url,
     (SELECT COUNT(*) FROM offers WHERE car_id = c.id AND status = 'pending') as offer_count
     FROM cars c
     WHERE c.seller_id = ?
     ORDER BY c.created_at DESC`,
    [user.id],
  )

  return (
    <DashboardLayout user={user}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Car Listings</h2>
        <Button asChild>
          <Link href="/dashboard/seller/cars/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Listing
          </Link>
        </Button>
      </div>

      {cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Card key={car.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={car.image_url || `/placeholder.svg?height=400&width=600`}
                  alt={`${car.make} ${car.model}`}
                  fill
                  className="object-cover"
                />
                <Badge
                  className={`absolute top-2 right-2 ${
                    car.status === "available" ? "bg-green-500" : car.status === "sold" ? "bg-red-500" : "bg-yellow-500"
                  }`}
                >
                  {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-sm text-muted-foreground">{car.year}</p>
                  </div>
                  <Badge variant="secondary">${car.price.toLocaleString()}</Badge>
                </div>

                <div className="flex justify-between items-center mt-4">
                  {car.offer_count > 0 && (
                    <Badge variant="outline" className="bg-blue-50">
                      {car.offer_count} {car.offer_count === 1 ? "offer" : "offers"}
                    </Badge>
                  )}

                  <div className="flex gap-2 ml-auto">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/cars/${car.id}`}>View</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/seller/cars/${car.id}/edit`}>Edit</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">No Car Listings Yet</h3>
            <p className="text-muted-foreground mb-4">Start selling by adding your first car listing.</p>
            <Button asChild>
              <Link href="/dashboard/seller/cars/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Listing
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}
