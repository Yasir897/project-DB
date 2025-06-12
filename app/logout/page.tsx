"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    async function handleLogout() {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
        })
      } catch (error) {
        console.error("Logout error:", error)
      } finally {
        router.push("/")
      }
    }

    handleLogout()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Logging out...</p>
    </div>
  )
}
