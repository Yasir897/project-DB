import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requireAuth } from "@/lib/auth"
import { executeQuery } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import { MessageSquare, CheckCircle, AlertCircle } from "lucide-react"

export default async function SupportDashboard() {
  const user = await requireAuth("support")

  // Fetch support stats
  const [totalComplaints, pendingComplaints, resolvedComplaints] = await Promise.all([
    executeQuery<any[]>("SELECT COUNT(*) as count FROM complaints"),
    executeQuery<any[]>("SELECT COUNT(*) as count FROM complaints WHERE status = 'pending'"),
    executeQuery<any[]>("SELECT COUNT(*) as count FROM complaints WHERE status = 'resolved'"),
  ])

  // Fetch recent complaints
  const recentComplaints = await executeQuery<any[]>(
    `SELECT c.id, c.subject, c.status, c.created_at, u.username 
     FROM complaints c 
     JOIN users u ON c.user_id = u.id 
     ORDER BY c.created_at DESC LIMIT 5`,
  )

  return (
    <DashboardLayout user={user}>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComplaints[0]?.count || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingComplaints[0]?.count || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedComplaints[0]?.count || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 text-sm font-medium text-muted-foreground">
              <div>Subject</div>
              <div>User</div>
              <div>Status</div>
              <div>Date</div>
            </div>
            {recentComplaints.length > 0 ? (
              recentComplaints.map((complaint) => (
                <div key={complaint.id} className="grid grid-cols-4 text-sm">
                  <div className="font-medium">{complaint.subject}</div>
                  <div>{complaint.username}</div>
                  <div className="capitalize">{complaint.status}</div>
                  <div>{new Date(complaint.created_at).toLocaleDateString()}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">No complaints found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
