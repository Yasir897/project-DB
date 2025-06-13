import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { executeQuery } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MakeOfferForm } from "@/components/make-offer-form"
import { Heart, Share2, Star, ChevronLeft, Check, MapPin, Calendar, Gauge, Fuel, Zap } from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CarDetailsPage({ params }: PageProps) {
  const session = await getSession()
  const { id } = await params // Properly await params
  const carId = Number.parseInt(id)

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

  // Use actual car images with fallbacks
  const carImages =
    images.length > 0
      ? images.map((img) => img.image_url)
      : ["/images/car1.png", "/images/car2.png", "/images/car3.png"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            CSBS
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/cars" className="text-gray-600 hover:text-gray-900 transition-colors">
                Browse Cars
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="/support" className="text-gray-600 hover:text-gray-900 transition-colors">
                Support
              </Link>
            </nav>
            {session ? (
              <div className="flex items-center gap-4">
                <Link
                  href={`/dashboard/${session.role}`}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Dashboard
                </Link>
                <Button asChild variant="outline" size="sm">
                  <Link href="/logout">Logout</Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Login
                </Link>
                <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/cars" className="text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back to Cars
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Car Images */}
          <div className="lg:col-span-2">
            <div className="relative h-96 rounded-2xl overflow-hidden mb-4 shadow-2xl">
              <Image
                src={carImages[0] || "/placeholder.svg?height=400&width=600"}
                alt={`${car.make} ${car.model}`}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=400&width=600"
                }}
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-full bg-white/80 hover:bg-white shadow-lg">
                  <Heart className="h-5 w-5 text-gray-600" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full bg-white/80 hover:bg-white shadow-lg">
                  <Share2 className="h-5 w-5 text-gray-600" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {carImages.slice(1).map((image, index) => (
                <div key={index} className="relative h-24 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={image || "/placeholder.svg?height=100&width=150"}
                    alt={`${car.make} ${car.model} - View ${index + 2}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=100&width=150"
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Car Details */}
            <div className="mt-8">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Vehicle Details
              </h2>
              <p className="text-gray-600 mb-6">Complete specifications and features</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3 p-4 bg-white/80 rounded-xl shadow-md">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-bold text-lg">{car.year}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/80 rounded-xl shadow-md">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-full">
                    <Gauge className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mileage</p>
                    <p className="font-bold text-lg">{car.mileage?.toLocaleString() || "N/A"} miles</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/80 rounded-xl shadow-md">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-full">
                    <Zap className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Transmission</p>
                    <p className="font-bold text-lg">{car.transmission || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/80 rounded-xl shadow-md">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-full">
                    <Fuel className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fuel Type</p>
                    <p className="font-bold text-lg">{car.fuel_type || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/80 rounded-xl shadow-md">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-full">
                    <div className="h-6 w-6 flex items-center justify-center text-blue-700 font-bold text-lg">C</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Color</p>
                    <p className="font-bold text-lg">{car.color || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/80 rounded-xl shadow-md">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-full">
                    <Check className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-bold text-lg capitalize">{car.status}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent">
                  Description
                </h3>
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-100 shadow-lg">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {car.description || "No description provided."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm">
                <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {car.make} {car.model} {car.year}
                      </h1>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">4.8</span>
                        <span className="text-xs text-gray-500">(24 reviews)</span>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 text-xl px-4 py-2 shadow-lg">
                      ${car.price.toLocaleString()}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Los Angeles, CA</span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="font-bold mb-3 text-lg">Seller Information</h3>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 flex items-center justify-center text-blue-700 font-bold text-lg">
                        {car.seller_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-lg">{car.seller_name}</p>
                        <p className="text-sm text-gray-500">Member since 2022</p>
                      </div>
                    </div>
                  </div>

                  {canMakeOffer ? (
                    <MakeOfferForm carId={car.id} buyerId={session.id} carPrice={car.price} />
                  ) : userOffer ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                      <p className="font-medium text-blue-700">
                        You have an offer of ${userOffer.amount.toLocaleString()} pending for this car.
                      </p>
                    </div>
                  ) : !session ? (
                    <div className="text-center">
                      <p className="mb-4 text-gray-600">Please login as a buyer to make an offer on this car.</p>
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                      >
                        <Link href="/login">Login</Link>
                      </Button>
                    </div>
                  ) : car.status !== "available" ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                      <p className="font-medium text-yellow-700">This car is no longer available.</p>
                    </div>
                  ) : null}

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Button variant="outline" className="w-full mb-3 hover:bg-blue-50 shadow-md">
                      Contact Seller
                    </Button>
                    <Button variant="outline" className="w-full hover:bg-purple-50 shadow-md">
                      Schedule Test Drive
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Car Selling & Buying System</h3>
              <p className="text-gray-400">Your trusted platform for buying and selling cars online.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/cars" className="text-gray-400 hover:text-white transition-colors">
                    Browse Cars
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-gray-400 hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <p className="text-gray-400">Email: info@csbs.com</p>
              <p className="text-gray-400">Phone: (123) 456-7890</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Car Selling & Buying System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
