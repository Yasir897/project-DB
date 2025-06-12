import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { executeQuery } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { FeaturedCars } from "@/components/featured-cars"
import { HeroSection } from "@/components/hero-section"

export default async function Home() {
  const session = await getSession()
  const featuredCars = await executeQuery<any[]>(
    `SELECT c.*, u.username as seller_name, 
     (SELECT image_url FROM car_images WHERE car_id = c.id AND is_primary = TRUE LIMIT 1) as image_url 
     FROM cars c 
     JOIN users u ON c.seller_id = u.id 
     WHERE c.status = 'available' AND c.featured = TRUE 
     LIMIT 6`,
  )

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

      <HeroSection />

      <main className="container mx-auto py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Featured Cars</h2>
          <FeaturedCars cars={featuredCars} />
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">For Buyers</h3>
              <p className="mb-4">Find your dream car from our extensive collection of quality vehicles.</p>
              <Button asChild>
                <Link href="/cars">Browse Cars</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">For Sellers</h3>
              <p className="mb-4">List your car for sale and reach thousands of potential buyers.</p>
              <Button asChild>
                <Link href="/register?role=seller">Become a Seller</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Need Help?</h3>
              <p className="mb-4">Our support team is ready to assist you with any questions.</p>
              <Button asChild variant="outline">
                <Link href="/support">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
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
