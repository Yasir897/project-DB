import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { executeQuery } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MakeOfferForm } from "@/components/make-offer-form"

export default async function CarDetailsPage({ params }: { params: { id: string } }) {
  const session = await getSession()
  const carId = Number.parseInt(params.id)

  if (isNaN(carId)) {
    notFound()
  }

  // Get car details
  const cars = await executeQuery<any[]>(
    `SELECT c.*, u.username as seller_name, u.email as seller_email
     FROM cars c
     JOIN users u ON c.seller_id = u.id
     WHERE c.id = ?`,
    [carId],
  )

  if (cars.length === 0) {
    notFound()
  }

  const car = cars[0]

  // Get car images
  const images = await executeQuery<any[]>(`SELECT * FROM car_images WHERE car_id = ? ORDER BY is_primary DESC`, [
    carId,
  ])

  // Check if user has already made an offer
  let userOffer = null
  if (session && session.role === "buyer") {
    const offers = await executeQuery<any[]>(
      `SELECT * FROM offers WHERE car_id = ? AND buyer_id = ? AND status = 'pending'`,
      [carId, session.id],
    )

    if (offers.length > 0) {
      userOffer = offers[0]
    }
  }

  // Determine if user can make an offer
  const canMakeOffer = session && session.role === "buyer" && car.status === "available" && !userOffer

  return (
    <div className="min-h-screen">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            CSBS
          </Link>
          <nav className="space-x-4">
            <Link href="/cars" className="hover:underline">
              Browse Cars
            </Link>
            {session ? (
              <>
                <Link href={`/dashboard/${session.role}`} className="hover:underline">
                  Dashboard
                </Link>
                <Link href="/logout" className="hover:underline">
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:underline">
                  Login
                </Link>
                <Link href="/register" className="hover:underline">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="mb-6">
          <Link href="/cars" className="text-primary hover:underline">
            &larr; Back to Cars
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="relative h-80 mb-4 rounded-lg overflow-hidden">
              <Image
                src={images[0]?.image_url || `/placeholder.svg?height=600&width=800`}
                alt={`${car.make} ${car.model}`}
                fill
                className="object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(1).map((image) => (
                  <div key={image.id} className="relative h-20 rounded-lg overflow-hidden">
                    <Image
                      src={image.image_url || "/placeholder.svg"}
                      alt={`${car.make} ${car.model}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold">
                  {car.make} {car.model} {car.year}
                </h1>
                <p className="text-muted-foreground">Listed by {car.seller_name}</p>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                ${car.price.toLocaleString()}
              </Badge>
            </div>

            <Card className="mb-6">
              <CardContent className="p-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Year</p>
                  <p className="font-medium">{car.year}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mileage</p>
                  <p className="font-medium">{car.mileage?.toLocaleString() || "N/A"} miles</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Color</p>
                  <p className="font-medium">{car.color || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fuel Type</p>
                  <p className="font-medium">{car.fuel_type || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transmission</p>
                  <p className="font-medium">{car.transmission || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{car.status}</p>
                </div>
              </CardContent>
            </Card>

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Description</h2>
              <p>{car.description || "No description provided."}</p>
            </div>

            {canMakeOffer ? (
              <MakeOfferForm carId={car.id} buyerId={session.id} carPrice={car.price} />
            ) : userOffer ? (
              <Card>
                <CardContent className="p-4">
                  <p className="font-medium">
                    You have an offer of ${userOffer.amount.toLocaleString()} pending for this car.
                  </p>
                </CardContent>
              </Card>
            ) : !session ? (
              <Card>
                <CardContent className="p-4">
                  <p className="mb-4">Please login as a buyer to make an offer on this car.</p>
                  <Button asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : car.status !== "available" ? (
              <Card>
                <CardContent className="p-4">
                  <p className="font-medium">This car is no longer available.</p>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </main>

      <footer className="bg-secondary py-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Car Selling & Buying System</h3>
              <p>Your trusted platform for buying and selling cars online.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/cars" className="hover:underline">
                    Browse Cars
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:underline">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:underline">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <p>Email: info@csbs.com</p>
              <p>Phone: (123) 456-7890</p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-200 text-center">
            <p>&copy; {new Date().getFullYear()} Car Selling & Buying System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
