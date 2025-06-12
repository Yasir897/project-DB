import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { executeQuery } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { Search, ChevronRight, Heart, Star, Filter } from "lucide-react"

export default async function Home() {
  const session = await getSession()
  const featuredCars = await executeQuery<any[]>(
    `SELECT c.*, u.username as seller_name, 
     (SELECT image_url FROM car_images WHERE car_id = c.id AND is_primary = TRUE LIMIT 1) as image_url 
     FROM cars c 
     JOIN users u ON c.seller_id = u.id 
     WHERE c.status = 'available' 
     LIMIT 6`,
  )

  // Get unique makes for filter
  const makes = await executeQuery<any[]>(`
    SELECT DISTINCT make FROM cars WHERE status = 'available' ORDER BY make
  `)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            CSBS
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/cars" className="text-gray-600 hover:text-gray-900">
                Browse Cars
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link href="/support" className="text-gray-600 hover:text-gray-900">
                Support
              </Link>
            </nav>
            {session ? (
              <div className="flex items-center gap-4">
                <Link href={`/dashboard/${session.role}`} className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <Button asChild variant="outline" size="sm">
                  <Link href="/logout">Logout</Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Button asChild size="sm">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Find Your Perfect Car</h1>
            <p className="text-xl text-gray-600 mb-8">
              Browse thousands of cars from trusted sellers. Buy or sell with confidence on our secure platform.
            </p>

            {/* Search Bar */}
            <div className="bg-white p-2 rounded-full shadow-lg flex items-center max-w-2xl mx-auto">
              <div className="flex-1 px-4">
                <Input
                  type="text"
                  placeholder="Search by make, model, or keyword"
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button size="icon" className="rounded-full">
                <Search className="h-5 w-5" />
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {makes.slice(0, 5).map((make) => (
                <Link
                  key={make.make}
                  href={`/cars?make=${make.make}`}
                  className="bg-white px-4 py-2 rounded-full text-sm border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  {make.make}
                </Link>
              ))}
              <Link
                href="/cars"
                className="bg-white px-4 py-2 rounded-full text-sm border border-gray-200 hover:border-gray-300 transition-colors flex items-center gap-1"
              >
                <Filter className="h-3 w-3" />
                All Filters
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Cars</h2>
            <Link href="/cars" className="text-primary flex items-center gap-1 hover:underline">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car, index) => (
              <Card key={car.id} className="overflow-hidden border-0 shadow-md rounded-xl">
                <div className="relative h-56">
                  <Image
                    src={car.image_url || `/images/car${(index % 6) + 1}.png`}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Button variant="ghost" size="icon" className="rounded-full bg-white/80 hover:bg-white">
                      <Heart className="h-5 w-5 text-gray-600" />
                    </Button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {car.make} {car.model}
                    </h3>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      ${car.price.toLocaleString()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    {car.year} • {car.mileage?.toLocaleString() || "N/A"} miles • {car.transmission || "N/A"}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">4.8</span>
                      <span className="text-xs text-gray-500">(24 reviews)</span>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary">
                      <Link href={`/cars/${car.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Search Cars</h3>
              <p className="text-gray-600">Browse our extensive collection of quality vehicles from trusted sellers.</p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Make an Offer</h3>
              <p className="text-gray-600">Found your dream car? Make an offer directly through our secure platform.</p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Drive Happy</h3>
              <p className="text-gray-600">Complete your purchase with confidence and enjoy your new vehicle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Sell Your Car?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              List your car for sale and reach thousands of potential buyers on our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/register?role=seller">Become a Seller</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/10"
              >
                <Link href="/learn-more">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
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
                  <Link href="/cars" className="text-gray-400 hover:text-white">
                    Browse Cars
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-gray-400 hover:text-white">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-400 hover:text-white">
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
