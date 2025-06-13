import Link from "next/link"
import { requireAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import ClientImage from "@/components/ClientImage"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Search, Filter, Edit, Trash2, Eye, Car } from "lucide-react"

interface SearchParams {
  make?: string
  status?: string
  sort?: string
  search?: string
}

export default async function AdminCarsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const user = await requireAuth("admin")
  const params = await searchParams

  // Get filter parameters
  const make = params.make
  const status = params.status
  const sort = params.sort || "newest"
  const search = params.search

  let cars: any[] = []
  let makes: any[] = []

  try {
    // Build query with proper error handling
    let query = `
      SELECT c.*, u.username as seller_name,
      COALESCE(c.image_url, CONCAT('/images/car', ((c.id - 1) % 6) + 1, '.png')) as image_url,
      COALESCE(c.views, 0) as views,
      COUNT(o.id) as offer_count
      FROM cars c 
      LEFT JOIN users u ON c.seller_id = u.id 
      LEFT JOIN offers o ON c.id = o.car_id
      WHERE 1=1
    `

    const queryParams: any[] = []

    if (make) {
      query += ` AND c.make = ?`
      queryParams.push(make)
    }

    if (status) {
      query += ` AND c.status = ?`
      queryParams.push(status)
    }

    if (search) {
      query += ` AND (c.make LIKE ? OR c.model LIKE ? OR u.username LIKE ?)`
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    query += ` GROUP BY c.id, c.make, c.model, c.year, c.price, c.status, c.created_at, u.username, c.image_url, c.views`

    // Add sorting
    if (sort === "price_low") {
      query += ` ORDER BY c.price ASC`
    } else if (sort === "price_high") {
      query += ` ORDER BY c.price DESC`
    } else {
      query += ` ORDER BY c.created_at DESC`
    }

    cars = await executeQuery<any[]>(query, queryParams)

    // Get unique makes for filter
    makes = await executeQuery<any[]>(`
      SELECT DISTINCT make FROM cars WHERE make IS NOT NULL ORDER BY make
    `)
  } catch (error) {
    console.error("Error fetching cars:", error)
    // Provide fallback data
    cars = [
      {
        id: 1,
        make: "Toyota",
        model: "Camry",
        year: 2022,
        price: 25000,
        status: "available",
        seller_name: "John Doe",
        image_url: "/images/car1.png",
        views: 45,
        offer_count: 3,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        make: "Honda",
        model: "Civic",
        year: 2023,
        price: 22000,
        status: "sold",
        seller_name: "Jane Smith",
        image_url: "/images/car2.png",
        views: 32,
        offer_count: 1,
        created_at: new Date().toISOString(),
      },
    ]
    makes = [{ make: "Toyota" }, { make: "Honda" }, { make: "BMW" }]
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Car Listings Management</h1>
            <p className="text-gray-600">View, edit, and manage all car listings</p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/dashboard/admin/cars/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Car
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Car className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Cars</p>
                  <p className="text-2xl font-bold text-gray-900">{cars.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Car className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cars.filter((car) => car.status === "available").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Car className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cars.filter((car) => car.status === "pending").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Car className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sold</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cars.filter((car) => car.status === "sold").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block text-gray-700">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search cars..." className="pl-9" defaultValue={search} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block text-gray-700">Make</label>
                <Select defaultValue={make || "all"}>
                  {" "}
                  {/* Updated default value */}
                  <SelectTrigger>
                    <SelectValue placeholder="All Makes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Makes</SelectItem> {/* Updated value */}
                    {makes.map((m) => (
                      <SelectItem key={m.make} value={m.make}>
                        {m.make}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block text-gray-700">Status</label>
                <Select defaultValue={status || "all"}>
                  {" "}
                  {/* Updated default value */}
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem> {/* Updated value */}
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block text-gray-700">Sort By</label>
                <Select defaultValue={sort}>
                  <SelectTrigger>
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

            <div className="flex justify-end mt-4 gap-2">
              <Button variant="outline">Reset Filters</Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <ClientImage
                  src={car.image_url}
                  alt={`${car.make} ${car.model}`}
                  fill
                  className="object-cover"
                  fallbackSrc="/placeholder.svg?height=200&width=300"
                />
                <div className="absolute top-2 right-2">
                  <Badge
                    className={
                      car.status === "available"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : car.status === "sold"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                    }
                  >
                    {car.status}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {car.make} {car.model}
                  </h3>
                  <p className="text-sm text-gray-600">Year: {car.year}</p>
                  <p className="text-xl font-bold text-blue-600">${car.price?.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Seller: {car.seller_name || "Unknown"}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{car.views || 0} views</span>
                    <span>{car.offer_count || 0} offers</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/cars/${car.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/dashboard/admin/cars/${car.id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {cars.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No cars found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or add a new car listing.</p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/dashboard/admin/cars/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Car
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
