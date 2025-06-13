import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { executeQuery } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { Search, ChevronRight, Heart, Star, Shield, Users, Clock, Award, CheckCircle, Car } from "lucide-react"
import ClientImage from "@/components/ClientImage"
import { AboutModal } from "@/components/about-modal"
import { ContactModal } from "@/components/contact-modal"

export default async function Home() {
  const session = await getSession()
  const featuredCars = await executeQuery<any[]>(
    `SELECT c.*, u.username as seller_name, 
     (SELECT image_url FROM car_images WHERE car_id = c.id AND is_primary = TRUE LIMIT 1) as image_url 
     FROM cars c 
     JOIN users u ON c.seller_id = u.id 
     WHERE c.status = 'available' 
     LIMIT 8`,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <header className="border-b border-white/20 sticky top-0 bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Yasir Cars
          </Link>
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/cars" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Browse Cars
              </Link>
              <Link
                href="/register?role=seller"
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                Sell Car
              </Link>
              <AboutModal>
                <button className="text-gray-700 hover:text-pink-600 font-medium transition-colors">About</button>
              </AboutModal>
              <ContactModal>
                <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</button>
              </ContactModal>
              <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Login
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
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Car Background */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 opacity-50"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Floating Car Images */}
        <div className="absolute top-20 left-10 opacity-20 animate-bounce">
          <ClientImage src="/images/car1.png" alt="Car" width={100} height={60} className="transform rotate-12" />
        </div>
        <div className="absolute top-40 right-20 opacity-20 animate-pulse">
          <ClientImage src="/images/car2.png" alt="Car" width={120} height={70} className="transform -rotate-12" />
        </div>
        <div className="absolute bottom-20 left-1/4 opacity-20 animate-bounce delay-1000">
          <ClientImage src="/images/car3.png" alt="Car" width={110} height={65} className="transform rotate-6" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Find Your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Dream Car
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed">
              The most trusted platform for buying and selling quality vehicles.
              <br className="hidden md:block" />
              Connect with verified dealers and private sellers worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 shadow-lg"
              >
                <Link href="/cars">Browse Cars</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 shadow-lg"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </div>

            {/* Enhanced Search Bar */}
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-3xl shadow-2xl flex items-center max-w-2xl mx-auto border border-white/50">
              <div className="flex-1 px-4">
                <Input
                  type="text"
                  placeholder="Search by make, model, or keyword..."
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg bg-transparent"
                />
              </div>
              <Button
                size="lg"
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Car className="h-10 w-10 text-blue-600" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                50K+
              </div>
              <div className="text-gray-700 font-medium">Cars Sold</div>
            </div>

            <div className="text-center group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-green-100 to-green-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Users className="h-10 w-10 text-green-600" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                25K+
              </div>
              <div className="text-gray-700 font-medium">Happy Customers</div>
            </div>

            <div className="text-center group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Shield className="h-10 w-10 text-purple-600" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                1000+
              </div>
              <div className="text-gray-700 font-medium">Verified Dealers</div>
            </div>

            <div className="text-center group hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Clock className="h-10 w-10 text-orange-600" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-gray-700 font-medium">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars with Enhanced Design */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-4">
              Featured Cars Available Now
            </h2>
            <p className="text-xl text-gray-600">Discover our handpicked selection of premium vehicles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCars.slice(0, 8).map((car, index) => (
              <Card
                key={car.id}
                className="overflow-hidden border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 group bg-white/90 backdrop-blur-sm hover:scale-105"
              >
                <div className="relative h-48">
                  <ClientImage
                    src={car.image_url || `/images/car${(index % 6) + 1}.png`}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    fallbackSrc="/placeholder.svg?height=200&width=300"
                  />
                  <div className="absolute top-3 right-3">
                    <Button variant="ghost" size="icon" className="rounded-full bg-white/80 hover:bg-white shadow-lg">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                      ${car.price.toLocaleString()}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-bold text-lg text-gray-900">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {car.year} • {car.mileage?.toLocaleString() || "N/A"} miles
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Link href={`/cars/${car.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 shadow-lg"
            >
              <Link href="/cars">
                View All Cars <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Why Choose Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent mb-4">
              Why Choose Yasir Cars?
            </h2>
            <p className="text-xl text-gray-600">Experience the difference with our premium car marketplace</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Shield className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Listings</h3>
              <p className="text-gray-600">
                Every car is thoroughly inspected and verified by our expert team before listing.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl hover:bg-gradient-to-br hover:from-green-50 hover:to-blue-50 transition-all duration-300 group">
              <div className="bg-gradient-to-br from-green-100 to-green-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Transparent Pricing</h3>
              <p className="text-gray-600">
                No hidden fees or surprises. Get fair market prices with complete transparency.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300 group">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Award className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Support</h3>
              <p className="text-gray-600">Our dedicated team provides 24/7 support throughout your buying journey.</p>
            </div>

            <div className="text-center p-6 rounded-2xl hover:bg-gradient-to-br hover:from-orange-50 hover:to-red-50 transition-all duration-300 group">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Users className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Trusted Community</h3>
              <p className="text-gray-600">
                Join thousands of satisfied customers who trust Yasir Cars for their vehicle needs.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 transition-all duration-300 group">
              <div className="bg-gradient-to-br from-red-100 to-red-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Clock className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quick Process</h3>
              <p className="text-gray-600">
                Fast and efficient buying process with minimal paperwork and maximum convenience.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 group">
              <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Star className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Guarantee</h3>
              <p className="text-gray-600">
                All vehicles come with quality assurance and comprehensive vehicle history reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Perfect Car?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their dream cars with Yasir Cars
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg"
            >
              <Link href="/cars">Browse Cars Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 shadow-lg"
            >
              <Link href="/register?role=seller">Start Selling</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Yasir Cars
              </h3>
              <p className="text-gray-400 mb-4">
                Your trusted platform for buying and selling quality vehicles worldwide.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>📍 253-M Block, Sabzazar, Lahore</p>
                <p>📞 +92 314 4107039</p>
                <p>✉️ info@yasircars.com</p>
              </div>
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
                  <AboutModal>
                    <button className="text-gray-400 hover:text-white transition-colors">About Us</button>
                  </AboutModal>
                </li>
                <li>
                  <Link href="/dashboard/support" className="text-gray-400 hover:text-white transition-colors">
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
              <ContactModal>
                <Button variant="outline" size="sm" className="mb-3 border-gray-600 text-gray-300 hover:bg-gray-800">
                  Get in Touch
                </Button>
              </ContactModal>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Business Hours:</p>
                <p>Mon-Fri: 9AM-8PM</p>
                <p>Sat-Sun: 10AM-6PM</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Yasir Cars. All rights reserved. Made with ❤️ for car enthusiasts.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
