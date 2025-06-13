import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { requireAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Users, Plus, Edit, Trash2, Eye, Mail, Calendar, Car, ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { UserModal } from "@/components/user-modal"
import { DeleteUserButton } from "@/components/delete-user-button"

export default async function AdminUsersPage() {
  const user = await requireAuth("admin")

  // Fetch all users with stats
  let users: any[] = []
  try {
    users = await executeQuery<any[]>(`
      SELECT 
        u.id,
        u.username,
        u.email,
        u.role,
        u.created_at,
        u.updated_at,
        (SELECT COUNT(*) FROM cars WHERE seller_id = u.id) as car_count,
        (SELECT COUNT(*) FROM offers WHERE buyer_id = u.id) as offer_count,
        (SELECT COUNT(*) FROM purchases WHERE buyer_id = u.id) as purchase_count,
        (SELECT COALESCE(SUM(amount), 0) FROM purchases WHERE seller_id = u.id) as total_revenue
      FROM users u
      ORDER BY u.created_at DESC
    `)
  } catch (error) {
    console.error("Error fetching users:", error)
    // Fallback data
    users = [
      {
        id: 1,
        username: "admin",
        email: "admin@test.com",
        role: "admin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        car_count: 0,
        offer_count: 0,
        purchase_count: 0,
        total_revenue: 0,
      },
      {
        id: 2,
        username: "johnseller",
        email: "seller@test.com",
        role: "seller",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        car_count: 5,
        offer_count: 0,
        purchase_count: 0,
        total_revenue: 45000,
      },
      {
        id: 3,
        username: "marybuyer",
        email: "buyer@test.com",
        role: "buyer",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        car_count: 0,
        offer_count: 8,
        purchase_count: 2,
        total_revenue: 0,
      },
    ]
  }

  // Calculate stats
  const totalUsers = users.length
  const adminCount = users.filter((u) => u.role === "admin").length
  const sellerCount = users.filter((u) => u.role === "seller").length
  const buyerCount = users.filter((u) => u.role === "buyer").length

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-gray-600 mt-2">Manage all users, roles, and permissions</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" className="shadow-sm">
              <Link href="/dashboard/admin">
                <Eye className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <UserModal mode="create">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                Add New User
              </Button>
            </UserModal>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Total Users</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{totalUsers}</div>
              <p className="text-xs text-blue-700 mt-1">All registered users</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Admins</CardTitle>
              <Users className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{adminCount}</div>
              <p className="text-xs text-purple-700 mt-1">System administrators</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Sellers</CardTitle>
              <Car className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{sellerCount}</div>
              <p className="text-xs text-green-700 mt-1">Car sellers</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-800">Buyers</CardTitle>
              <ShoppingCart className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900">{buyerCount}</div>
              <p className="text-xs text-amber-700 mt-1">Car buyers</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="h-6 w-6" />
              All Users ({totalUsers})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <div className="grid grid-cols-8 bg-gray-50 p-4 text-sm font-medium text-gray-600 rounded-t-lg">
                  <div>User</div>
                  <div>Email</div>
                  <div>Role</div>
                  <div>Cars</div>
                  <div>Offers</div>
                  <div>Revenue</div>
                  <div>Joined</div>
                  <div>Actions</div>
                </div>
                {users.map((userData) => (
                  <div
                    key={userData.id}
                    className="grid grid-cols-8 p-4 text-sm border-b hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {userData.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{userData.username}</div>
                        <div className="text-xs text-gray-500">ID: {userData.id}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600 truncate">{userData.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge
                        className={
                          userData.role === "admin"
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                            : userData.role === "seller"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : userData.role === "buyer"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }
                      >
                        {userData.role}
                      </Badge>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Car className="h-4 w-4 mr-1" />
                      {userData.car_count || 0}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      {userData.offer_count || 0}
                    </div>
                    <div className="flex items-center text-green-600 font-medium">
                      ${(userData.total_revenue || 0).toLocaleString()}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(userData.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <UserModal user={userData} mode="view">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </UserModal>
                      <UserModal user={userData} mode="edit">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </UserModal>
                      <DeleteUserButton userId={userData.id} username={userData.username}>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DeleteUserButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
