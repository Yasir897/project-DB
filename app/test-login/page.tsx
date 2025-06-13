"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, ShoppingCart, Car, Headphones } from "lucide-react"

const testAccounts = [
  {
    role: "admin",
    email: "admin@test.com",
    password: "admin123",
    username: "admin",
    icon: Shield,
    color: "bg-purple-500",
    description: "Full system access",
  },
  {
    role: "buyer",
    email: "buyer@test.com",
    password: "buyer123",
    username: "buyer",
    icon: ShoppingCart,
    color: "bg-blue-500",
    description: "Browse and buy cars",
  },
  {
    role: "seller",
    email: "seller@test.com",
    password: "seller123",
    username: "seller",
    icon: Car,
    color: "bg-green-500",
    description: "List and sell cars",
  },
  {
    role: "support",
    email: "support@test.com",
    password: "support123",
    username: "support",
    icon: Headphones,
    color: "bg-orange-500",
    description: "Customer support",
  },
]

export default function TestLoginPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleQuickLogin = async (account: (typeof testAccounts)[0]) => {
    setLoading(account.role)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: account.email,
          password: account.password,
          role: account.role,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to appropriate dashboard
        router.push(`/dashboard/${account.role}`)
      } else {
        setError(data.message || "Login failed")
      }
    } catch (err) {
      setError("Network error occurred")
      console.error("Login error:", err)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Dashboard Testing Portal
          </h1>
          <p className="text-gray-600">Quick login to test all user roles and dashboards</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">{error}</div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testAccounts.map((account) => {
            const IconComponent = account.icon
            return (
              <Card key={account.role} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 ${account.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="capitalize">{account.role}</CardTitle>
                  <p className="text-sm text-gray-600">{account.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div>
                      <Label className="text-xs text-gray-500">Email</Label>
                      <div className="font-mono text-xs bg-gray-100 p-2 rounded">{account.email}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Password</Label>
                      <div className="font-mono text-xs bg-gray-100 p-2 rounded">{account.password}</div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleQuickLogin(account)}
                    disabled={loading === account.role}
                    className="w-full"
                    variant={account.role === "admin" ? "default" : "outline"}
                  >
                    {loading === account.role ? "Logging in..." : `Login as ${account.role}`}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Card className="inline-block">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Testing Checklist</h3>
              <div className="grid gap-2 text-left text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="w-16">
                    Admin
                  </Badge>
                  <span>✓ User management, car oversight, system analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="w-16">
                    Buyer
                  </Badge>
                  <span>✓ Browse cars, make offers, view purchases</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="w-16">
                    Seller
                  </Badge>
                  <span>✓ List cars, manage offers, track sales</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="w-16">
                    Support
                  </Badge>
                  <span>✓ Handle tickets, user assistance, system health</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 text-center">
          <Button variant="ghost" asChild>
            <a href="/login">← Back to Regular Login</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
