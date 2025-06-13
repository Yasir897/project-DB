"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"

interface DashboardStatus {
  role: string
  status: "success" | "error" | "loading"
  message: string
  loadTime?: number
}

export function DashboardStatus({ userRole }: { userRole: string }) {
  const [statuses, setStatuses] = useState<DashboardStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkDashboards = async () => {
      const roles = ["admin", "buyer", "seller", "support"]
      const results: DashboardStatus[] = []

      for (const role of roles) {
        const startTime = Date.now()
        try {
          // Simulate dashboard check - in real app, this would be actual API calls
          await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500))

          results.push({
            role,
            status: "success",
            message: "Dashboard loaded successfully",
            loadTime: Date.now() - startTime,
          })
        } catch (error) {
          results.push({
            role,
            status: "error",
            message: "Failed to load dashboard",
            loadTime: Date.now() - startTime,
          })
        }
      }

      setStatuses(results)
      setLoading(false)
    }

    checkDashboards()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Checking Dashboard Status...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {["admin", "buyer", "seller", "support"].map((role) => (
              <div key={role} className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
                <span className="capitalize">{role} Dashboard</span>
                <Badge variant="outline">Checking...</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Dashboard Status Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {statuses.map((status) => (
            <div key={status.role} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {status.status === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : status.status === "error" ? (
                  <XCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-600" />
                )}
                <div>
                  <div className="font-medium capitalize">{status.role} Dashboard</div>
                  <div className="text-sm text-gray-600">{status.message}</div>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    status.status === "success" ? "default" : status.status === "error" ? "destructive" : "secondary"
                  }
                >
                  {status.status}
                </Badge>
                {status.loadTime && <div className="text-xs text-gray-500 mt-1">{status.loadTime}ms</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Current User: {userRole}</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            You are currently logged in as <strong>{userRole}</strong>. Use the test login page to switch between
            different roles.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
