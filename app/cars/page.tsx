import { Card, CardContent } from "@/components/ui/card"
import { executeQuery } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { FeaturedCars } from "@/components/featured-cars"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

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
        <h1 className="text-3xl font-bold mb-6">Browse Cars</h1>

        <Card className="mb-8">
          <CardContent className="p-6">
            <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Make</label>
                <Select name="make" defaultValue={make || "Any Make"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Make" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any Make">Any Make</SelectItem>
                    {makes.map((m) => (
                      <SelectItem key={m.make} value={m.make}>
                        {m.make}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Min Price</label>
                <Input type="number" name="minPrice" placeholder="Min Price" defaultValue={minPrice} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Max Price</label>
                <Input type="number" name="maxPrice" placeholder="Max Price" defaultValue={maxPrice} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sort By</label>
                <Select name="sort" defaultValue={sort}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-4 flex justify-end">
                <Button type="submit">Apply Filters</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {cars.length > 0 ? (
          <FeaturedCars cars={cars} />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">No cars found</h2>
            <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
          </div>
        )}
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
