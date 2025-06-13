import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { executeQuery } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { Search, Heart, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default async function CarsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getSession()

  // Get filter parameters
  const make = typeof searchParams.make === "string" ? searchParams.make : undefined
  const minPrice = typeof searchParams.minPrice === "string" ? Number.parseInt(searchParams.minPrice) : undefined
  const maxPrice = typeof searchParams.maxPrice === "string" ? Number.parseInt(searchParams.maxPrice) : undefined
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "newest"

  // Build query
  let query = `
    SELECT c.*, u.username as seller_name, 
    (SELECT image_url FROM car_images WHERE car_id = c.id AND is_primary = TRUE LIMIT 1) as image_url 
    FROM cars c 
    JOIN users u ON c.seller_id = u.id 
    WHERE c.status = 'available'
  `

  const queryParams: any[] = []

  if (make) {
    query += ` AND c.make = ?`
    queryParams.push(make)
  }

  if (minPrice !== undefined) {
    query += ` AND c.price >= ?`
    queryParams.push(minPrice)
  }

  if (maxPrice !== undefined) {
    query += ` AND c.price <= ?`
    queryParams.push(maxPrice)
  }

  // Add sorting
  if (sort === "price_low") {
    query += ` ORDER BY c.price ASC`
  } else if (sort === "price_high") {
    query += ` ORDER BY c.price DESC`
  } else {
    query += ` ORDER BY c.created_at DESC`
  }

  const cars = await executeQuery<any[]>(query, queryParams)

  // Get unique makes for filter
  const makes = await executeQuery<any[]>(`
    SELECT DISTINCT make FROM cars WHERE status = 'available' ORDER BY make
  `)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Yasir Cars
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/cars" className="text-blue-600 hover:text-blue-800 font-medium">
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

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect Car</h1>
            <p className="text-lg mb-6">Browse our extensive collection of quality vehicles from trusted sellers</p>
            <div className="bg-white p-3 rounded-full shadow-lg flex items-center max-w-2xl mx-auto">
              <div className="flex-1 px-4">
                <Input
                  type="text"
                  placeholder="Search by make, model, or keyword..."
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6 text-gray-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-blue-600 font-medium">Browse Cars</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                  <h2 className="font-bold text-gray-900">Filters</h2>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    Reset All
                  </Button>
                </div>

                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-sm mb-3">Make</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {makes.map((m) => (
                      <div key={m.make} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`make-${m.make}`}
                          className="rounded text-blue-600 focus:ring-blue-600"
                          defaultChecked={make === m.make}
                        />
                        <label htmlFor={`make-${m.make}`} className="ml-2 text-sm text-gray-700">
                          {m.make}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-sm mb-3">Price Range</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input type="number" placeholder="Min" className="h-9 text-sm" defaultValue={minPrice} />
                    </div>
                    <div>
                      <Input type="number" placeholder="Max" className="h-9 text-sm" defaultValue={maxPrice} />
                    </div>
                  </div>
                </div>

                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-sm mb-3">Year</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input type="number" placeholder="From" className="h-9 text-sm" />
                    </div>
                    <div>
                      <Input type="number" placeholder="To" className="h-9 text-sm" />
                    </div>
                  </div>
                </div>

                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-sm mb-3">Mileage</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input type="number" placeholder="Min" className="h-9 text-sm" />
                    </div>
                    <div>
                      <Input type="number" placeholder="Max" className="h-9 text-sm" />
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Apply Filters</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
              <div className="relative w-full md:w-auto md:flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input type="text" placeholder="Search by make, model, or keyword" className="pl-10" />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <Select defaultValue={sort}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">Showing {cars.length} results</p>
            </div>

            {/* Car Listings */}
            {cars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cars.map((car, index) => (
                  <Card
                    key={car.id}
                    className="overflow-hidden border-0 shadow-lg rounded-xl hover:shadow-xl transition-shadow"
                  >
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
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-xl font-bold text-white">
                          {car.make} {car.model}
                        </h3>
                        <p className="text-white/90">{car.year}</p>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            {car.mileage?.toLocaleString() || "N/A"} miles • {car.transmission || "N/A"}
                          </p>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">4.8</span>
                            <span className="text-xs text-gray-500">(24 reviews)</span>
                          </div>
                        </div>
                        <Badge className="bg-blue-600 text-white border-0">${car.price.toLocaleString()}</Badge>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <p className="text-sm text-gray-500">Listed by {car.seller_name}</p>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          <Link href={`/cars/${car.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold mb-2">No cars found</h2>
                <p className="text-gray-600 mb-6">Try adjusting your filters to see more results.</p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/cars">Reset Filters</Link>
                </Button>
              </div>
            )}

            {/* Pagination */}
            {cars.length > 0 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" disabled>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Yasir Cars</h3>
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
              <p className="text-gray-400">Email: info@yasircars.com</p>
              <p className="text-gray-400">Phone: (123) 456-7890</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Yasir Cars. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
