import Link from "next/link"
import Image from "next/image"
import { requireAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Search, Filter, Edit, Trash2, Eye } from "lucide-react"

export default async function AdminCarsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user = await requireAuth("admin")

  // Get filter parameters
  const make = typeof searchParams.make === "string" ? searchParams.make : ""
  const status = typeof searchParams.status === "string" ? searchParams.status : ""
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "newest"
  const search = typeof searchParams.search === "string" ? searchParams.search : ""

  // Build query
  let query = `
    SELECT c.*, u.username as seller_name, 
    (SELECT image_url FROM car_images WHERE car_id = c.id AND is_primary = TRUE LIMIT 1) as image_url 
    FROM cars c 
    JOIN users u ON c.seller_id = u.id 
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
    SELECT DISTINCT make FROM cars ORDER BY make
  `)

  return (
    <DashboardLayout user={user}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Car Listings Management</h1>
          <p className="text-gray-600">View, edit, and manage all car listings</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/cars/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Car
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
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
              <Select defaultValue={make}>
                <SelectTrigger>
                  <SelectValue placeholder="All Makes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Makes</SelectItem>
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
              <Select defaultValue={status}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
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

          <div className="flex justify-end mt-4">
            <Button className="mr-2" variant="outline">
              Reset Filters
            </Button>
            <Button>
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="grid grid-cols-8 bg-gray-50 p-4 text-sm font-medium text-gray-600">
          <div className="col-span-2">Car</div>
          <div>Price</div>
          <div>Year</div>
          <div>Status</div>
          <div>Seller</div>
          <div>Listed Date</div>
          <div>Actions</div>
        </div>

        {cars.length > 0 ? (
          <div className="divide-y">
            {cars.map((car) => (
              <div key={car.id} className="grid grid-cols-8 p-4 items-center text-sm">
                <div className="col-span-2 flex items-center gap-3">
                  <div className="relative h-12 w-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={car.image_url || `/images/car${(car.id % 6) + 1}.png`}
                      alt={`${car.make} ${car.model}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {car.make} {car.model}
                    </p>
                    <p className="text-xs text-gray-500">ID: {car.id}</p>
                  </div>
                </div>
                <div className="font-medium">${car.price.toLocaleString()}</div>
                <div>{car.year}</div>
                <div>
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
                <div>{car.seller_name}</div>
                <div>{new Date(car.created_at).toLocaleDateString()}</div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild title="View">
                    <Link href={`/cars/${car.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild title="Edit">
                    <Link href={`/dashboard/admin/cars/${car.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-1">No cars found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or add a new car listing.</p>
            <Button asChild>
              <Link href="/dashboard/admin/cars/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Car
              </Link>
            </Button>
          </div>
        )}
      </div>

      {cars.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">Showing {cars.length} cars</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
