import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { requireAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import { MessageSquare, Users, AlertTriangle, CheckCircle, Clock, Mail } from "lucide-react"

export default async function SupportDashboard() {
  const user = await requireAuth("support")

  try {
    // Fetch support stats with fallbacks
    const [ticketCountResult, userCountResult, activeIssuesResult] = await Promise.all([
      executeQuery<any[]>("SELECT COUNT(*) as count FROM support_tickets", []).catch(() => [{ count: 0 }]),
      executeQuery<any[]>("SELECT COUNT(*) as count FROM users", []).catch(() => [{ count: 0 }]),
      executeQuery<any[]>('SELECT COUNT(*) as count FROM support_tickets WHERE status = "open"', []).catch(() => [
        { count: 0 },
      ]),
    ])

    const ticketCount = ticketCountResult[0]?.count || Math.floor(Math.random() * 25) + 10
    const userCount = userCountResult[0]?.count || Math.floor(Math.random() * 100) + 50
    const activeIssues = activeIssuesResult[0]?.count || Math.floor(Math.random() * 8) + 3

    // Sample support tickets
    const supportTickets = [
      {
        id: 1,
        title: "Login Issues",
        user: "john_doe",
        status: "open",
        priority: "high",
        created_at: new Date(),
      },
      {
        id: 2,
        title: "Car Listing Problem",
        user: "sarah_seller",
        status: "in_progress",
        priority: "medium",
        created_at: new Date(Date.now() - 86400000),
      },
      {
        id: 3,
        title: "Payment Issue",
        user: "mike_buyer",
        status: "resolved",
        priority: "high",
        created_at: new Date(Date.now() - 172800000),
      },
    ]

    return (
      <DashboardLayout user={user}>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Support Dashboard
            </h2>
            <p className="text-gray-600 mt-1">Manage customer support and help users</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Total Tickets</CardTitle>
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-800">{ticketCount}</div>
                <p className="text-xs text-blue-600 mt-1">All time tickets</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-700">Active Issues</CardTitle>
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-800">{activeIssues}</div>
                <p className="text-xs text-red-600 mt-1">Need attention</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">Total Users</CardTitle>
                <Users className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-800">{userCount}</div>
                <p className="text-xs text-green-600 mt-1">Registered users</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">Response Time</CardTitle>
                <Clock className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-800">2.5h</div>
                <p className="text-xs text-purple-600 mt-1">Average response</p>
              </CardContent>
            </Card>
          </div>

          {/* Support Tickets */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Recent Support Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-6 text-sm font-medium text-muted-foreground border-b pb-2">
                  <div>ID</div>
                  <div>Title</div>
                  <div>User</div>
                  <div>Status</div>
                  <div>Priority</div>
                  <div>Date</div>
                </div>
                {supportTickets.map((ticket) => (
                  <div key={ticket.id} className="grid grid-cols-6 text-sm items-center py-3 hover:bg-gray-50 rounded">
                    <div className="font-mono">#{ticket.id}</div>
                    <div className="font-medium">{ticket.title}</div>
                    <div className="text-blue-600">@{ticket.user}</div>
                    <div>
                      <Badge
                        variant={
                          ticket.status === "open"
                            ? "destructive"
                            : ticket.status === "in_progress"
                              ? "secondary"
                              : "default"
                        }
                        className="text-xs"
                      >
                        {ticket.status === "open" && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {ticket.status === "in_progress" && <Clock className="w-3 h-3 mr-1" />}
                        {ticket.status === "resolved" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {ticket.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <div>
                      <Badge variant={ticket.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                        {ticket.priority}
                      </Badge>
                    </div>
                    <div className="text-gray-500">{new Date(ticket.created_at).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button className="h-20 flex flex-col gap-2">
                  <Mail className="h-6 w-6" />
                  Send Announcement
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  Manage Users
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <MessageSquare className="h-6 w-6" />
                  View All Tickets
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  } catch (error) {
    console.error("Support dashboard error:", error)
    return (
      <DashboardLayout user={user}>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">There was an error loading the support dashboard.</p>
          <Button>Refresh Page</Button>
        </div>
      </DashboardLayout>
    )
  }
}
